import { INITIAL_RESERVATIONS, USERS } from '../data/mockData'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

function toReservation(row) {
  return {
    id: row.id,
    resourceId: row.resource_id,
    userId: row.user_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status,
    title: row.title,
    isBlocked: row.is_blocked,
  }
}

function fromReservation(reservation) {
  return {
    id: reservation.id,
    resource_id: reservation.resourceId,
    user_id: reservation.userId,
    date: reservation.date,
    start_time: reservation.startTime,
    end_time: reservation.endTime,
    status: reservation.status,
    title: reservation.title,
    is_blocked: Boolean(reservation.isBlocked),
  }
}

export async function signIn(email, password) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle()

    return {
      ok: true,
      user: {
        id: profile?.id ?? data.user.id,
        name: profile?.name ?? data.user.email,
        email: data.user.email,
        role: profile?.role ?? 'member',
        avatar: profile?.avatar ?? data.user.email?.slice(0, 2).toUpperCase(),
      },
    }
  }

  const found = USERS.find(user => user.email === email && user.password === password)
  if (found) return { ok: true, user: found }
  return { ok: false, error: 'Credenciales incorrectas.' }
}

export async function signOut() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut()
  }
}

export async function signUp({ name, email, password }) {
  if (!isSupabaseConfigured) {
    return { ok: true }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) return { ok: false, error: error.message }

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      name,
      email,
      role: 'member',
      avatar: name
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    })
  }

  return { ok: true }
}

export async function fetchReservations() {
  if (!isSupabaseConfigured) return INITIAL_RESERVATIONS

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw error
  return data.map(toReservation)
}

export async function createReservation(reservation) {
  if (!isSupabaseConfigured) return reservation

  const { data, error } = await supabase
    .from('reservations')
    .insert(fromReservation(reservation))
    .select()
    .single()

  if (error) throw error
  return toReservation(data)
}

export async function updateReservationStatus(id, status) {
  if (!isSupabaseConfigured) return

  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)

  if (error) throw error
}
