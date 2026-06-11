import { useMemo, useState } from 'react'
import { sendChatMessage } from '../../services/integratorApi'

const STORAGE_KEY = 'bookdesk-chat-session'
const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Hola. Puedo ayudarte con recursos, disponibilidad, reservas y uso de BookDesk.',
}
const QUICK_QUESTIONS = [
  'Que recursos estan disponibles?',
  'Mostrame mis proximas reservas',
  'Como cancelo una reserva?',
]

function loadMessages() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    return Array.isArray(stored) && stored.length ? stored : [INITIAL_MESSAGE]
  } catch {
    return [INITIAL_MESSAGE]
  }
}

function localFallback(question) {
  const normalized = question.toLowerCase()
  if (normalized.includes('cancel')) {
    return 'Podes cancelar desde "Mis reservas": busca la reserva activa y elegi "Cancelar".'
  }
  if (normalized.includes('reserv')) {
    return 'Para crear una reserva, entra en "Reservar", elegi el recurso y luego un horario disponible.'
  }
  if (normalized.includes('recurso') || normalized.includes('sala') || normalized.includes('escritorio')) {
    return 'Los recursos se consultan desde "Reservar". Alli podes filtrar salas y escritorios.'
  }
  return 'El asistente inteligente no esta disponible ahora. Podes usar Reservar, Mis reservas o Recursos para continuar.'
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(loadMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastQuestion, setLastQuestion] = useState('')

  const visibleQuickQuestions = useMemo(
    () => messages.length <= 2 ? QUICK_QUESTIONS : [],
    [messages.length]
  )

  function persist(nextMessages) {
    setMessages(nextMessages)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextMessages))
  }

  async function submit(question = input) {
    const cleanQuestion = question.trim().slice(0, 1000)
    if (!cleanQuestion || loading) return

    const userMessage = { role: 'user', content: cleanQuestion }
    const nextMessages = [...messages, userMessage]
    persist(nextMessages)
    setInput('')
    setLastQuestion(cleanQuestion)
    setLoading(true)

    try {
      const result = await sendChatMessage(nextMessages)
      persist([...nextMessages, { role: 'assistant', content: result.reply }])
    } catch {
      persist([
        ...nextMessages,
        {
          role: 'assistant',
          content: localFallback(cleanQuestion),
          fallback: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function clearConversation() {
    persist([INITIAL_MESSAGE])
    setLastQuestion('')
    setInput('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <section className="mb-3 flex h-[min(590px,calc(100vh-110px))] w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-white/90 bg-white/88 shadow-[0_30px_90px_rgba(35,55,95,0.24)] backdrop-blur-2xl">
          <header className="flex items-center justify-between border-b border-white/80 bg-gradient-to-r from-blue-50/90 to-violet-50/80 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0070eb] text-white shadow-[0_12px_25px_rgba(0,112,235,0.25)]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
                  <path d="M8 9h8M8 13h5" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-black text-[#202837]">Asistente BookDesk</h2>
                <p className="text-[10px] font-bold text-emerald-600">Consulta, no ejecuta acciones</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearConversation} className="rounded-lg p-2 text-[#667085] hover:bg-white/80" aria-label="Limpiar conversacion" title="Limpiar conversacion">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                </svg>
              </button>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-[#667085] hover:bg-white/80" aria-label="Cerrar asistente">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-5 ${
                  message.role === 'user'
                    ? 'rounded-br-md bg-[#0070eb] text-white'
                    : message.fallback
                      ? 'rounded-bl-md border border-amber-100 bg-amber-50 text-amber-900'
                      : 'rounded-bl-md bg-[#f1f3fe] text-[#414755]'
                }`}>
                  {message.content}
                  {message.fallback && (
                    <button onClick={() => submit(lastQuestion)} className="mt-2 block text-[10px] font-black text-amber-700 underline">
                      Reintentar con Claude
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#f1f3fe] px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0070eb]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0070eb] [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0070eb] [animation-delay:240ms]" />
                </div>
              </div>
            )}

            {visibleQuickQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {visibleQuickQuestions.map(question => (
                  <button key={question} onClick={() => submit(question)} className="rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2 text-left text-[10px] font-black text-[#0058bc] hover:bg-blue-100">
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={event => {
              event.preventDefault()
              submit()
            }}
            className="flex items-end gap-2 border-t border-white/80 bg-white/75 p-3"
          >
            <textarea
              value={input}
              onChange={event => setInput(event.target.value)}
              rows="1"
              maxLength="1000"
              placeholder="Pregunta sobre BookDesk..."
              className="max-h-24 min-h-10 flex-1 resize-none rounded-xl border border-[#d8dce9] bg-[#f7f8fd] px-3 py-2.5 text-xs font-semibold text-[#202837] outline-none focus:border-[#0070eb] focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0070eb] text-white shadow-[0_12px_25px_rgba(0,112,235,0.25)] disabled:opacity-40"
              aria-label="Enviar mensaje"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
              </svg>
            </button>
          </form>
        </section>
      )}

      <button
        onClick={() => setOpen(current => !current)}
        className="ml-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#0070eb] text-white shadow-[0_20px_44px_rgba(0,112,235,0.38)] transition-transform hover:-translate-y-1"
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente BookDesk'}
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" /><path d="M8 9h8M8 13h5" /></>}
        </svg>
      </button>
    </div>
  )
}
