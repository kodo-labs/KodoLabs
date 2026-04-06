import { createContext, useContext, useState } from 'react'
import { INITIAL_RESERVATIONS } from '../data/mockData'

const ReservationsContext = createContext(null)

export function ReservationsProvider({ children }) {
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS)

  function addReservation(reservation) {
    const newRes = {
      ...reservation,
      id: `r${Date.now()}`,
      status: 'confirmed',
    }
    setReservations(prev => [...prev, newRes])
    return newRes
  }

  function cancelReservation(id) {
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r)
    )
  }

  function blockSlot(resourceId, date, startTime, endTime) {
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
    setReservations(prev => [...prev, blocked])
    return blocked
  }

  return (
    <ReservationsContext.Provider value={{ reservations, addReservation, cancelReservation, blockSlot }}>
      {children}
    </ReservationsContext.Provider>
  )
}

export function useReservations() {
  return useContext(ReservationsContext)
}
