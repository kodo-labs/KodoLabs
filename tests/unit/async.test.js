import { withTimeout } from '../../frontend/src/utils/async.js'

describe('withTimeout', () => {
  it('devuelve el resultado cuando la operacion termina a tiempo', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 50)).resolves.toBe('ok')
  })

  it('rechaza con un mensaje controlado cuando la operacion queda pendiente', async () => {
    const pending = new Promise(() => {})
    await expect(withTimeout(pending, 10, 'Tiempo agotado')).rejects.toThrow('Tiempo agotado')
  })
})
