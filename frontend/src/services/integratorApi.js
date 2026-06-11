import { isSupabaseConfigured, supabase } from '../lib/supabase'

async function getAccessToken() {
  if (!isSupabaseConfigured) return ''
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session?.access_token ?? ''
}

async function authorizedRequest(path, options = {}) {
  const token = await getAccessToken()
  if (!token) throw new Error('Necesitas una sesion activa para usar esta funcion.')

  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.error || 'No se pudo completar la solicitud.')
    error.status = response.status
    throw error
  }
  return data
}

export async function sendReservationNotification(event, reservationId) {
  if (!isSupabaseConfigured) {
    return { ok: false, skipped: true, error: 'Notificaciones desactivadas en modo demo.' }
  }

  try {
    const result = await authorizedRequest('/api/notifications/reservation', {
      method: 'POST',
      body: JSON.stringify({ event, reservationId }),
    })
    window.dispatchEvent(new CustomEvent('bookdesk:notifications-changed'))
    return result
  } catch (error) {
    window.dispatchEvent(new CustomEvent('bookdesk:notifications-changed'))
    return { ok: false, error: error.message }
  }
}

export async function fetchNotifications() {
  if (!isSupabaseConfigured) return { notifications: [] }
  return authorizedRequest('/api/notifications')
}

export async function markNotificationsRead() {
  if (!isSupabaseConfigured) return { ok: true }
  return authorizedRequest('/api/notifications', {
    method: 'POST',
    body: JSON.stringify({ action: 'mark-all-read' }),
  })
}

export async function sendChatMessage(messages) {
  return authorizedRequest('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  })
}
