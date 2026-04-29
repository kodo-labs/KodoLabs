import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RESOURCES } from '../data/mockData'

const rooms = RESOURCES.filter(resource => resource.type === 'room').length
const desks = RESOURCES.filter(resource => resource.type === 'desk').length
const totalCapacity = RESOURCES.reduce((sum, resource) => sum + resource.capacity, 0)

const heroStats = [
  { value: RESOURCES.length, label: 'espacios cargados' },
  { value: rooms, label: 'salas privadas' },
  { value: desks, label: 'escritorios' },
  { value: totalCapacity, label: 'puestos disponibles' },
]

const features = [
  {
    icon: 'sync',
    title: 'Reserva instantanea',
    text: 'Elegi salas y escritorios disponibles sin cruces de agenda.',
  },
  {
    icon: 'bell',
    title: 'Recordatorios automaticos',
    text: 'Confirmaciones y estados claros para miembros y administradores.',
  },
  {
    icon: 'door',
    title: 'Panel del coworking',
    text: 'Controla capacidad, amenities, bloqueos y ocupacion diaria.',
  },
]

const workflow = [
  {
    step: '01',
    title: 'Elegi el espacio',
    text: 'Filtra por salas o escritorios y revisa capacidad, piso y amenities antes de avanzar.',
  },
  {
    step: '02',
    title: 'Selecciona horario',
    text: 'El calendario semanal muestra disponibilidad real para evitar reservas superpuestas.',
  },
  {
    step: '03',
    title: 'Confirma la reserva',
    text: 'BookDesk registra el turno, actualiza el estado y deja todo listo para el equipo.',
  },
]

const adminItems = [
  'Bloqueo de salas por mantenimiento o eventos internos.',
  'Vista rapida de ocupacion para tomar decisiones operativas.',
  'Administracion de recursos, pisos, capacidad y equipamiento.',
]

const scheduleCells = [
  ['full', 'free', 'free', 'soft', 'free'],
  ['free', 'full', 'soft', 'free', 'free'],
  ['soft', 'free', 'full', 'free', 'soft'],
  ['free', 'soft', 'free', 'full', 'free'],
]

function FeatureIcon({ type }) {
  if (type === 'sync') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11V9a3 3 0 013-3h15" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v2a3 3 0 01-3 3H3" />
      </svg>
    )
  }

  if (type === 'bell') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.7 21a2 2 0 01-3.4 0" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3h5v18h-5" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  )
}

function NavContent() {
  return (
    <>
      <Link to="/" className="flex items-center gap-2" aria-label="BookDesk inicio">
        <span className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-[#54c6ff] to-[#0058bc] shadow-[0_8px_18px_rgba(0,112,235,0.25)]">
          <span className="h-2.5 w-2.5 rounded-sm bg-white/35" />
        </span>
        <span className="text-lg font-bold tracking-normal">BookDesk</span>
      </Link>

      <nav className="hidden items-center gap-9 text-xs font-medium text-[#11151b] sm:flex">
        <a href="#solutions" className="hover:text-[#0058bc]">Soluciones</a>
        <a href="#features" className="hover:text-[#0058bc]">Espacios</a>
        <a href="#community" className="hover:text-[#0058bc]">Comunidad</a>
      </nav>

      <Link
        to="/login"
        className="rounded-full bg-[#0070eb] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(0,112,235,0.32),inset_0_1px_0_rgba(255,255,255,0.28)] transition hover:bg-[#0058bc]"
      >
        Get Started
      </Link>
    </>
  )
}

function ProductMockup() {
  const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie']

  return (
    <div className="bookly-product-stage">
      <div className="bookly-product-plate" />
      <div className="bookly-product-panel">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-[#717786]">Ocupacion en vivo</p>
            <h3 className="mt-1 text-2xl font-black text-[#11151b]">Semana BookDesk</h3>
          </div>
          <span className="rounded-full bg-[#d8eaff] px-4 py-2 text-sm font-black text-[#0058bc]">
            82%
          </span>
        </div>

        <div className="mt-7 grid grid-cols-5 gap-2">
          {days.map(day => (
            <div key={day} className="text-center text-xs font-bold text-[#717786]">
              {day}
            </div>
          ))}
          {scheduleCells.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`h-12 rounded-xl border ${
                  cell === 'full'
                    ? 'border-[#adc6ff] bg-[#0070eb] shadow-[0_12px_26px_rgba(0,112,235,0.22)]'
                    : cell === 'soft'
                      ? 'border-[#d1bcff] bg-[#eaddff]'
                      : 'border-white bg-white/70'
                }`}
              />
            ))
          )}
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {RESOURCES.slice(0, 4).map(resource => (
            <div key={resource.id} className="rounded-2xl border border-white/75 bg-white/58 p-4 shadow-[0_12px_28px_rgba(45,48,57,0.07)]">
              <p className="font-black text-[#11151b]">{resource.name}</p>
              <p className="mt-1 text-sm text-[#717786]">
                Piso {resource.floor} - {resource.capacity} pers.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [navCompact, setNavCompact] = useState(false)

  useEffect(() => {
    let ticking = false

    function updateNav() {
      setNavCompact(window.scrollY > 42)
      ticking = false
    }

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateNav)
        ticking = true
      }
    }

    updateNav()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="bookly-page min-h-screen overflow-hidden bg-[#f9f9ff] text-[#11151b]">
      <section className="relative min-h-screen px-4 pb-10 pt-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(0,112,235,0.12),transparent_28%),radial-gradient(circle_at_68%_18%,rgba(134,84,239,0.13),transparent_28%),linear-gradient(180deg,#fbfbff_0%,#f8f9ff_72%,#f7f8fb_100%)]" />
        <div className="glass-shape glass-shape-left" />
        <div className="glass-shape glass-shape-left-small" />
        <div className="glass-shape glass-shape-right" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-40px)] max-w-[1200px] flex-col items-center">
          <header className={`bookly-nav bookly-nav-full ${navCompact ? 'bookly-nav-hidden' : 'bookly-nav-visible'}`}>
            <NavContent />
          </header>

          <header className={`bookly-nav bookly-nav-pill ${navCompact ? 'bookly-nav-visible' : 'bookly-nav-hidden'}`}>
            <NavContent />
          </header>

          <div className="flex w-full flex-1 flex-col items-center justify-center pt-24 text-center lg:pt-20">
            <h1 className="max-w-[760px] text-[42px] font-black leading-[1.05] tracking-normal text-[#11151b] sm:text-[58px]">
              Reserva. Gestiona. Escala.
              <span className="block">Todo en una <span className="font-serif italic font-medium text-[#0069d9]">Plataforma Coworking.</span></span>
            </h1>

            <form className="mt-7 flex h-[42px] w-full max-w-[438px] items-center rounded-full border-2 border-[#0058bc] bg-white/68 pl-5 pr-1 shadow-[0_12px_26px_rgba(0,88,188,0.10)] backdrop-blur-xl">
              <input
                type="search"
                aria-label="Buscar espacio"
                placeholder="Buscar una sala, escritorio o horario"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#414755] outline-none placeholder:text-[#8a909c]"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="grid h-8 w-8 place-items-center rounded-full bg-[#0070eb] text-white shadow-[0_8px_18px_rgba(0,112,235,0.35)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </button>
            </form>

            <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {heroStats.map(stat => (
                <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/45 px-4 py-3 shadow-[0_12px_30px_rgba(45,48,57,0.07)] backdrop-blur-xl">
                  <p className="text-2xl font-black text-[#0058bc]">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#717786]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div id="features" className="mt-12 grid w-full max-w-[690px] gap-5 sm:grid-cols-3">
              {features.map((feature, index) => (
                <article
                  key={feature.title}
                  className="bookly-card-wrap"
                  style={{ '--card-delay': `${index * 120}ms` }}
                >
                  <div className="bookly-card-plate" />
                  <div className="bookly-feature-card text-left">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d8eaff] text-[#0058bc] shadow-[0_10px_22px_rgba(0,112,235,0.14)]">
                      <FeatureIcon type={feature.icon} />
                    </span>
                    <h2 className="mt-5 text-base font-bold text-[#11151b]">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#5c6472]">{feature.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-black tracking-normal text-[#11151b] sm:text-3xl">
                Listo para transformar tu coworking?
              </h2>
              <Link
                to="/login"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0070eb] px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(0,112,235,0.30),inset_0_1px_0_rgba(255,255,255,0.24)] transition hover:bg-[#0058bc]"
              >
                Start for Free <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="bookly-section relative px-4 py-28">
        <div className="bookly-section-glow left-[-120px] top-16" />
        <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-[#0058bc]">Funciones premium</p>
            <h2 className="mt-4 text-5xl font-black leading-[1.05] tracking-normal text-[#11151b]">
              Menos planillas. Mas claridad operativa.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5c6472]">
              BookDesk mantiene el mismo lenguaje visual del hero: capas suaves, datos claros y acciones rapidas para reservar espacios sin ruido.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {heroStats.map(stat => (
                <div key={stat.label} className="bookly-mini-stat">
                  <p className="text-3xl font-black text-[#0058bc]">{stat.value}</p>
                  <p className="mt-1 text-sm font-semibold text-[#717786]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <ProductMockup />
        </div>
      </section>

      <section className="bookly-section relative px-4 py-28">
        <div className="bookly-section-glow right-[-140px] top-10" />
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase text-[#0058bc]">Como funciona</p>
            <h2 className="mt-4 text-5xl font-black leading-[1.05] tracking-normal text-[#11151b]">
              Un flujo simple, presentado como una experiencia premium.
            </h2>
          </div>

          <div className="mt-16 grid gap-7 md:grid-cols-3">
            {workflow.map((item, index) => (
              <article
                key={item.step}
                className="bookly-step-card"
                style={{ '--card-delay': `${index * 120}ms` }}
              >
                <div className="bookly-step-plate" />
                <div className="bookly-step-surface">
                  <span className="text-sm font-black text-[#0058bc]">{item.step}</span>
                  <h3 className="mt-7 text-2xl font-black leading-tight text-[#11151b]">{item.title}</h3>
                  <p className="mt-4 leading-7 text-[#5c6472]">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="bookly-section relative px-4 py-28">
        <div className="mx-auto grid max-w-[1120px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="bookly-showcase-panel">
            <div className="bookly-showcase-orb" />
            <p className="text-sm font-bold uppercase text-[#0058bc]">Espacios BookDesk</p>
            <h2 className="mt-4 max-w-2xl text-5xl font-black leading-[1.05] tracking-normal text-[#11151b]">
              Salas y escritorios listos para reservar.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {RESOURCES.slice(0, 6).map((resource, index) => (
                <article key={resource.id} className="bookly-resource-card" style={{ '--card-delay': `${index * 70}ms` }}>
                  <p className="font-black text-[#11151b]">{resource.name}</p>
                  <p className="mt-2 text-sm text-[#717786]">
                    {resource.type === 'room' ? 'Sala' : 'Escritorio'} - Piso {resource.floor} - {resource.capacity} pers.
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="bookly-admin-stack">
            <div className="bookly-admin-card">
              <p className="text-sm font-bold uppercase text-[#0058bc]">Administracion</p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal text-[#11151b]">
                Control sin ruido visual.
              </h2>
              <div className="mt-8 space-y-4">
                {adminItems.map(item => (
                  <div key={item} className="rounded-2xl border border-white/75 bg-white/54 p-4 text-sm leading-6 text-[#414755] shadow-[0_12px_30px_rgba(45,48,57,0.07)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bookly-admin-card bookly-admin-card-accent">
              <p className="text-sm font-bold uppercase text-[#7c2e00]">Demo</p>
              <h3 className="mt-3 text-3xl font-black leading-tight text-[#11151b]">
                Proba el flujo completo.
              </h3>
              <Link
                to="/login"
                className="mt-7 inline-flex rounded-full bg-[#0070eb] px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(0,112,235,0.30)] transition hover:bg-[#0058bc]"
              >
                Ir a la demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
