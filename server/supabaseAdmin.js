import { getBearerToken } from './http.js'

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.')
  }

  return {
    url: url.replace(/\/$/, ''),
    serviceRoleKey,
  }
}

function adminHeaders(extra = {}) {
  const { serviceRoleKey } = getSupabaseConfig()
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

async function parseResponse(response) {
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const error = new Error(data?.message ?? data?.error_description ?? data?.error ?? 'Error de Supabase.')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export async function verifyRequestUser(request) {
  const token = getBearerToken(request)
  if (!token) {
    const error = new Error('Sesion requerida.')
    error.status = 401
    throw error
  }

  const { url, serviceRoleKey } = getSupabaseConfig()
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${token}`,
    },
  })

  const authUser = await parseResponse(response)
  const profiles = await selectRows('profiles', {
    select: 'id,name,email,role,avatar',
    id: `eq.${authUser.id}`,
    limit: '1',
  })

  return {
    authUser,
    profile: profiles[0] ?? {
      id: authUser.id,
      name: authUser.user_metadata?.name ?? authUser.email,
      email: authUser.email,
      role: 'member',
      avatar: null,
    },
  }
}

export async function selectRows(table, query = {}) {
  const { url } = getSupabaseConfig()
  const search = new URLSearchParams(query)
  const response = await fetch(`${url}/rest/v1/${table}?${search.toString()}`, {
    headers: adminHeaders(),
  })
  return parseResponse(response)
}

export async function insertRow(table, row) {
  const { url } = getSupabaseConfig()
  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: adminHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  })
  const data = await parseResponse(response)
  return data?.[0] ?? null
}

export async function updateRows(table, filters, changes) {
  const { url } = getSupabaseConfig()
  const search = new URLSearchParams(filters)
  const response = await fetch(`${url}/rest/v1/${table}?${search.toString()}`, {
    method: 'PATCH',
    headers: adminHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(changes),
  })
  return parseResponse(response)
}
