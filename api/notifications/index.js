import { readJsonBody, requireMethod, sendJson } from '../../server/http.js'
import { selectRows, updateRows, verifyRequestUser } from '../../server/supabaseAdmin.js'

function visibilityFilter(profile) {
  return profile.role === 'admin'
    ? `or(user_id.eq.${profile.id},actor_id.eq.${profile.id})`
    : `user_id.eq.${profile.id}`
}

export default async function handler(request, response) {
  if (!requireMethod(request, response, ['GET', 'POST'])) return

  try {
    const { profile } = await verifyRequestUser(request)

    if (request.method === 'GET') {
      const query = {
        select: '*',
        order: 'created_at.desc',
        limit: '20',
      }

      if (profile.role === 'admin') {
        query.or = `(user_id.eq.${profile.id},actor_id.eq.${profile.id})`
      } else {
        query.user_id = `eq.${profile.id}`
      }

      const notifications = await selectRows('notification_logs', query)
      return sendJson(response, 200, { notifications })
    }

    const { action } = readJsonBody(request)
    if (action !== 'mark-all-read') {
      return sendJson(response, 400, { error: 'Accion invalida.' })
    }

    const filters = {
      read_at: 'is.null',
    }
    if (profile.role === 'admin') {
      filters.or = `(user_id.eq.${profile.id},actor_id.eq.${profile.id})`
    } else {
      filters.user_id = `eq.${profile.id}`
    }

    await updateRows('notification_logs', filters, {
      read_at: new Date().toISOString(),
    })

    return sendJson(response, 200, { ok: true })
  } catch (error) {
    return sendJson(response, error.status ?? 500, {
      error: error.message ?? 'No se pudieron cargar las notificaciones.',
    })
  }
}
