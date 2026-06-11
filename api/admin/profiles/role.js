import { readJsonBody, requireMethod, sendJson } from '../../../server/http.js'
import { selectRows, updateRows, verifyRequestUser } from '../../../server/supabaseAdmin.js'

const ALLOWED_ROLES = new Set(['member', 'admin'])

export default async function handler(request, response) {
  if (!requireMethod(request, response, ['PATCH'])) return

  try {
    const { profile: actor } = await verifyRequestUser(request)
    if (actor.role !== 'admin') {
      return sendJson(response, 403, { error: 'Se requiere un administrador.' })
    }

    const { email, role } = readJsonBody(request)
    const normalizedEmail = String(email ?? '').trim().toLowerCase()

    if (!normalizedEmail || !ALLOWED_ROLES.has(role)) {
      return sendJson(response, 400, { error: 'Email o rol invalido.' })
    }

    const profiles = await selectRows('profiles', {
      select: 'id,name,email,role',
      email: `eq.${normalizedEmail}`,
      limit: '1',
    })
    const target = profiles[0]

    if (!target) {
      return sendJson(response, 404, { error: 'Perfil no encontrado.' })
    }

    if (target.role === role) {
      return sendJson(response, 200, {
        ok: true,
        unchanged: true,
        profile: target,
      })
    }

    const updated = await updateRows(
      'profiles',
      { id: `eq.${target.id}` },
      { role }
    )

    return sendJson(response, 200, {
      ok: true,
      unchanged: false,
      profile: updated[0],
    })
  } catch (error) {
    return sendJson(response, error.status ?? 500, {
      error: error.message ?? 'No se pudo actualizar el rol.',
    })
  }
}
