import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { INITIAL_RESERVATIONS, RESOURCES } from '../frontend/src/data/mockData.js'
import { buildStatisticsRows, toCsv } from '../frontend/src/utils/statisticsExport.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = resolve(root, 'exports', 'reservas-estadistica.csv')

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

function toResource(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    capacity: row.capacity,
    floor: row.floor,
    amenities: row.amenities ?? [],
  }
}

async function fetchTable(table, key) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Supabase ${table}: ${response.status} ${detail}`)
  }
  return response.json()
}

async function loadData() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!process.env.SUPABASE_URL || !key) {
    console.log('Credenciales Supabase ausentes: se exportaran datos demo.')
    return { reservations: INITIAL_RESERVATIONS, resources: RESOURCES }
  }

  const [reservationRows, resourceRows] = await Promise.all([
    fetchTable('reservations', key),
    fetchTable('resources', key),
  ])

  console.log(`Supabase: ${reservationRows.length} reservas y ${resourceRows.length} recursos.`)
  return {
    reservations: reservationRows.map(toReservation),
    resources: resourceRows.map(toResource),
  }
}

const { reservations, resources } = await loadData()
const rows = buildStatisticsRows(reservations, resources)

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `\uFEFF${toCsv(rows)}\r\n`, 'utf8')

console.log(`CSV generado: ${outputPath}`)
console.log(`Registros exportados: ${rows.length}`)
