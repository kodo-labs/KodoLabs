import { buildReservationEmail } from '../../server/emailTemplates.js'
import { readJsonBody, requireMethod, sendJson } from '../../server/http.js'
import {
  insertRow,
  selectRows,
  updateRows,
  verifyRequestUser,
} from '../../server/supabaseAdmin.js'

const ALLOWED_EVENTS = new Set(['confirmed', 'cancelled'])

async function findLog(event, reservationId) {
  const rows = await selectRows('notification_logs', {
    select: '*',
    event: `eq.${event}`,
    reservation_id: `eq.${reservationId}`,
    limit: '1',
  })
  return rows[0] ?? null
}

async function sendWithResend({ event, reservationId, recipient, email }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) {
    throw new Error('Faltan RESEND_API_KEY o RESEND_FROM_EMAIL.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `bookdesk:${event}:${reservationId}`,
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      subject: email.subject,
      html: email.html,
      text: email.text,
      tags: [
        { name: 'event', value: event },
        { name: 'reservation_id', value: reservationId.replace(/[^a-zA-Z0-9_-]/g, '_') },
      ],
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message ?? 'Resend no pudo enviar el correo.')
  }

  return data
}

export default async function handler(request, response) {
  if (!requireMethod(request, response, ['POST'])) return

  let log = null

  try {
    const { profile: actor } = await verifyRequestUser(request)
    const { event, reservationId } = readJsonBody(request)

    if (!ALLOWED_EVENTS.has(event) || !reservationId) {
      return sendJson(response, 400, { error: 'Evento o reserva invalidos.' })
    }

    const reservations = await selectRows('reservations', {
      select: '*',
      id: `eq.${reservationId}`,
      limit: '1',
    })
    const reservation = reservations[0]
    if (!reservation) {
      return sendJson(response, 404, { error: 'Reserva no encontrada.' })
    }

    if (String(reservation.user_id) !== String(actor.id) && actor.role !== 'admin') {
      return sendJson(response, 403, { error: 'No tenes permiso para notificar esta reserva.' })
    }
    if (reservation.status !== event) {
      return sendJson(response, 409, {
        error: 'El estado actual de la reserva no coincide con el evento solicitado.',
      })
    }

    const [profiles, resources] = await Promise.all([
      selectRows('profiles', {
        select: 'id,name,email,role,avatar',
        id: `eq.${reservation.user_id}`,
        limit: '1',
      }),
      selectRows('resources', {
        select: '*',
        id: `eq.${reservation.resource_id}`,
        limit: '1',
      }),
    ])

    const recipientProfile = profiles[0]
    const resource = resources[0]
    if (!recipientProfile?.email || !resource) {
      return sendJson(response, 422, { error: 'Faltan datos del destinatario o recurso.' })
    }

    log = await findLog(event, reservationId)
    if (log?.status === 'sent') {
      return sendJson(response, 200, {
        ok: true,
        duplicate: true,
        notification: log,
      })
    }

    if (!log) {
      try {
        log = await insertRow('notification_logs', {
          id: `notification-${crypto.randomUUID()}`,
          reservation_id: reservationId,
          user_id: String(reservation.user_id),
          actor_id: String(actor.id),
          channel: 'email',
          recipient_email: recipientProfile.email,
          event,
          status: 'processing',
        })
      } catch (error) {
        if (error.status !== 409) throw error
        log = await findLog(event, reservationId)
        if (log?.status === 'sent') {
          return sendJson(response, 200, {
            ok: true,
            duplicate: true,
            notification: log,
          })
        }
      }
    } else {
      const updated = await updateRows(
        'notification_logs',
        { id: `eq.${log.id}` },
        { status: 'processing', error: null }
      )
      log = updated[0] ?? log
    }

    const email = buildReservationEmail({
      event,
      profile: recipientProfile,
      reservation,
      resource,
    })
    const resendData = await sendWithResend({
      event,
      reservationId,
      recipient: recipientProfile.email,
      email,
    })

    const updated = await updateRows(
      'notification_logs',
      { id: `eq.${log.id}` },
      {
        status: 'sent',
        provider_id: resendData.id,
        sent_at: new Date().toISOString(),
        error: null,
      }
    )

    return sendJson(response, 200, {
      ok: true,
      duplicate: false,
      notification: updated[0] ?? log,
    })
  } catch (error) {
    if (log?.id) {
      try {
        await updateRows(
          'notification_logs',
          { id: `eq.${log.id}` },
          { status: 'failed', error: error.message }
        )
      } catch {
        // Preserve the original provider error.
      }
    }

    return sendJson(response, error.status ?? 502, {
      error: error.message ?? 'No se pudo enviar la notificacion.',
    })
  }
}
