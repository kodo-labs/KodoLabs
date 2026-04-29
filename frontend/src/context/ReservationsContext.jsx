import { createContext, useContext, useEffect, useState } from 'react'
import { INITIAL_RESERVATIONS } from '../data/mockData'
import { useAuth } from './AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  createReservation,
  fetchReservations,
  updateReservationStatus,
} from '../services/bookdeskRepository'

const ReservationsContext = createContext(null)

export function ReservationsProvider({ children }) {
  const { user } = useAuth()
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadReservations() {
      if (isSupabaseConfigured && !user) {
        setReservations(INITIAL_RESERVATIONS)
        setLoading(false)
        return
      }

      try {
        const data = await fetchReservations()
        if (active) {
          setReservations(data)
          setError('')
        }
      } catch (err) {
        if (active) {
          setError(err.message)
          setReservations(INITIAL_RESERVATIONS)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadReservations()
    return () => {
      active = false
    }
  }, [user])

  async function addReservation(reservation) {
    const newRes = {
      ...reservation,
      id: `r${Date.now()}`,
      status: 'confirmed',
    }
    const saved = await createReservation(newRes)
    setReservations(prev => [...prev, saved])
    return saved
  }

  async function cancelReservation(id) {
    await updateReservationStatus(id, 'cancelled')
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r)
    )
  }

  async function blockSlot(resourceId, date, startTime, endTime) {
    const blocked = {
      id: `block-${Date.now()}`,
      resourceId,
      userId: 3, // admin
      date,
      startTime,
      endTime,
      status: 'confirmed',
      title: 'BLOQUEADO — Admin',
      isBlocked: true,
    }
    const saved = await createReservation(blocked)
    setReservations(prev => [...prev, saved])
    return saved
  }

  return (
    <ReservationsContext.Provider value={{ reservations, loading, error, addReservation, cancelReservation, blockSlot }}>
      {children}
    </ReservationsContext.Provider>
  )
}

export function useReservations() {
  return useContext(ReservationsContext)
}
