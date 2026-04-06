// ─── Usuarios ────────────────────────────────────────────────────────────────
export const USERS = [
  {
    id: 1,
    name: 'Valentina López',
    email: 'valentina@kutz.co',
    password: '1234',
    role: 'member',
    avatar: 'VL',
  },
  {
    id: 2,
    name: 'Marcos Díaz',
    email: 'marcos@kutz.co',
    password: '1234',
    role: 'member',
    avatar: 'MD',
  },
  {
    id: 3,
    name: 'Admin Kutz',
    email: 'admin@kutz.co',
    password: 'admin',
    role: 'admin',
    avatar: 'AK',
  },
]

// ─── Recursos ─────────────────────────────────────────────────────────────────
export const RESOURCES = [
  {
    id: 'sala-alpha',
    name: 'Sala Alpha',
    type: 'room',
    capacity: 8,
    floor: 2,
    amenities: ['Proyector', 'Pizarrón', 'AC', 'Video conferencia'],
    description: 'Sala de reuniones equipada para equipos medianos.',
    image: null,
  },
  {
    id: 'sala-beta',
    name: 'Sala Beta',
    type: 'room',
    capacity: 4,
    floor: 1,
    amenities: ['TV 55"', 'Pizarrón', 'AC'],
    description: 'Sala compacta, ideal para reuniones pequeñas o entrevistas.',
    image: null,
  },
  {
    id: 'sala-gamma',
    name: 'Sala Gamma',
    type: 'room',
    capacity: 12,
    floor: 3,
    amenities: ['Proyector 4K', 'AC', 'Video conferencia', 'Sistema de audio'],
    description: 'Sala grande para workshops, demos o reuniones de equipo.',
    image: null,
  },
  {
    id: 'escritorio-a1',
    name: 'Escritorio A1',
    type: 'desk',
    capacity: 1,
    floor: 1,
    amenities: ['Monitor 27"', 'Teclado', 'Mouse'],
    description: 'Escritorio en zona tranquila, vista al parque.',
    image: null,
  },
  {
    id: 'escritorio-a2',
    name: 'Escritorio A2',
    type: 'desk',
    capacity: 1,
    floor: 1,
    amenities: ['Monitor 24"'],
    description: 'Escritorio estándar cerca de la ventana.',
    image: null,
  },
  {
    id: 'escritorio-a3',
    name: 'Escritorio A3',
    type: 'desk',
    capacity: 1,
    floor: 1,
    amenities: ['Monitor 27"', 'Teclado mecánico', 'Mouse'],
    description: 'Escritorio premium en zona silenciosa.',
    image: null,
  },
  {
    id: 'escritorio-b1',
    name: 'Escritorio B1',
    type: 'desk',
    capacity: 1,
    floor: 2,
    amenities: ['Monitor 24"', 'Teclado'],
    description: 'Escritorio en planta alta, zona colaborativa.',
    image: null,
  },
  {
    id: 'escritorio-b2',
    name: 'Escritorio B2',
    type: 'desk',
    capacity: 1,
    floor: 2,
    amenities: ['Monitor 24"'],
    description: 'Escritorio en planta alta, cerca de la cocina.',
    image: null,
  },
]

// ─── Reservas (semana del 7 al 11 de abril 2026) ───────────────────────────────
// status: 'confirmed' | 'pending' | 'cancelled'
export const INITIAL_RESERVATIONS = [
  // Sala Alpha
  {
    id: 'r001',
    resourceId: 'sala-alpha',
    userId: 1,
    date: '2026-04-07',
    startTime: '09:00',
    endTime: '11:00',
    status: 'confirmed',
    title: 'Sprint Planning',
  },
  {
    id: 'r002',
    resourceId: 'sala-alpha',
    userId: 2,
    date: '2026-04-07',
    startTime: '14:00',
    endTime: '16:00',
    status: 'confirmed',
    title: 'Reunión de equipo',
  },
  {
    id: 'r003',
    resourceId: 'sala-alpha',
    userId: 2,
    date: '2026-04-09',
    startTime: '10:00',
    endTime: '12:00',
    status: 'confirmed',
    title: 'Demo cliente',
  },
  // Sala Beta
  {
    id: 'r004',
    resourceId: 'sala-beta',
    userId: 1,
    date: '2026-04-08',
    startTime: '11:00',
    endTime: '13:00',
    status: 'confirmed',
    title: 'Entrevista candidato',
  },
  {
    id: 'r005',
    resourceId: 'sala-beta',
    userId: 2,
    date: '2026-04-10',
    startTime: '09:00',
    endTime: '10:00',
    status: 'pending',
    title: 'Llamada con proveedor',
  },
  // Sala Gamma (bloqueada por admin el jueves)
  {
    id: 'r006',
    resourceId: 'sala-gamma',
    userId: 3,
    date: '2026-04-10',
    startTime: '08:00',
    endTime: '18:00',
    status: 'confirmed',
    title: 'BLOQUEADO — Mantenimiento',
    isBlocked: true,
  },
  {
    id: 'r007',
    resourceId: 'sala-gamma',
    userId: 1,
    date: '2026-04-11',
    startTime: '10:00',
    endTime: '13:00',
    status: 'confirmed',
    title: 'Workshop UX',
  },
  // Escritorios
  {
    id: 'r008',
    resourceId: 'escritorio-a1',
    userId: 2,
    date: '2026-04-07',
    startTime: '08:00',
    endTime: '18:00',
    status: 'confirmed',
    title: 'Jornada completa',
  },
  {
    id: 'r009',
    resourceId: 'escritorio-a2',
    userId: 1,
    date: '2026-04-08',
    startTime: '08:00',
    endTime: '14:00',
    status: 'confirmed',
    title: 'Media jornada',
  },
  {
    id: 'r010',
    resourceId: 'escritorio-a3',
    userId: 1,
    date: '2026-04-09',
    startTime: '09:00',
    endTime: '17:00',
    status: 'confirmed',
    title: 'Trabajo remoto',
  },
]

// ─── Horarios disponibles ────────────────────────────────────────────────────
export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
]

export const WEEK_DAYS = [
  { label: 'Lun', date: '2026-04-07' },
  { label: 'Mar', date: '2026-04-08' },
  { label: 'Mié', date: '2026-04-09' },
  { label: 'Jue', date: '2026-04-10' },
  { label: 'Vie', date: '2026-04-11' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
                  'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
}

export function isSlotOccupied(reservations, resourceId, date, startTime) {
  const slotHour = parseInt(startTime.split(':')[0])
  return reservations.some(r => {
    if (r.resourceId !== resourceId || r.date !== date || r.status === 'cancelled') return false
    const rStart = parseInt(r.startTime.split(':')[0])
    const rEnd = parseInt(r.endTime.split(':')[0])
    return slotHour >= rStart && slotHour < rEnd
  })
}

export function getSlotReservation(reservations, resourceId, date, startTime) {
  const slotHour = parseInt(startTime.split(':')[0])
  return reservations.find(r => {
    if (r.resourceId !== resourceId || r.date !== date || r.status === 'cancelled') return false
    const rStart = parseInt(r.startTime.split(':')[0])
    const rEnd = parseInt(r.endTime.split(':')[0])
    return slotHour >= rStart && slotHour < rEnd
  })
}
