export function sendJson(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

export function readJsonBody(request) {
  if (!request.body) return {}
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body)
    } catch {
      return {}
    }
  }
  return request.body
}

export function requireMethod(request, response, allowedMethods) {
  if (allowedMethods.includes(request.method)) return true

  response.setHeader('Allow', allowedMethods.join(', '))
  sendJson(response, 405, { error: 'Metodo no permitido.' })
  return false
}

export function getBearerToken(request) {
  const authorization = request.headers.authorization ?? ''
  if (!authorization.startsWith('Bearer ')) return ''
  return authorization.slice(7).trim()
}
