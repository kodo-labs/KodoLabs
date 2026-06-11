import { buildChatSystemPrompt, sanitizeChatMessages } from '../server/chatPolicy.js'
import { readJsonBody, requireMethod, sendJson } from '../server/http.js'
import { selectRows, verifyRequestUser } from '../server/supabaseAdmin.js'

function buildAdminSummary(reservations) {
  const byStatus = reservations.reduce((result, reservation) => {
    result[reservation.status] = (result[reservation.status] ?? 0) + 1
    return result
  }, {})

  return {
    total_reservas: reservations.filter(item => !item.is_blocked).length,
    confirmadas: byStatus.confirmed ?? 0,
    pendientes: byStatus.pending ?? 0,
    canceladas: byStatus.cancelled ?? 0,
    bloqueos: reservations.filter(item => item.is_blocked).length,
  }
}

async function askClaude({ messages, system }) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Falta ANTHROPIC_API_KEY.')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: 450,
      temperature: 0.2,
      system,
      messages,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'Claude no esta disponible.')
  }

  const reply = data.content
    ?.filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n')
    .trim()

  if (!reply) throw new Error('Claude devolvio una respuesta vacia.')
  return reply
}

export default async function handler(request, response) {
  if (!requireMethod(request, response, ['POST'])) return

  try {
    const { profile } = await verifyRequestUser(request)
    const messages = sanitizeChatMessages(readJsonBody(request).messages)

    if (!messages.length || messages.at(-1).role !== 'user') {
      return sendJson(response, 400, { error: 'Envia al menos un mensaje del usuario.' })
    }

    const resources = await selectRows('resources', {
      select: 'id,name,type,capacity,floor,amenities',
      order: 'name.asc',
    })

    let reservations = []
    let summary = null

    if (profile.role === 'admin') {
      reservations = await selectRows('reservations', {
        select: 'status,is_blocked',
      })
      summary = buildAdminSummary(reservations)
    } else {
      reservations = await selectRows('reservations', {
        select: 'id,date,start_time,end_time,status,resource_id,resources(name)',
        user_id: `eq.${profile.id}`,
        order: 'date.desc',
        limit: '20',
      })
      reservations = reservations.map(item => ({
        ...item,
        resource_name: item.resources?.name ?? item.resource_id,
        resources: undefined,
      }))
    }

    const system = buildChatSystemPrompt({
      profile,
      resources,
      reservations,
      summary,
    })
    const reply = await askClaude({ messages, system })

    return sendJson(response, 200, { reply })
  } catch (error) {
    return sendJson(response, error.status ?? 502, {
      error: error.message ?? 'No se pudo consultar al asistente.',
    })
  }
}
