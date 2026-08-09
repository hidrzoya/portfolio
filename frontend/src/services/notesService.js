const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '')

if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL must be set for production builds.')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) {
    throw new Error((await response.json().catch(() => ({}))).detail ?? 'Request failed.')
  }
  return response.status === 204 ? null : response.json()
}

const adminHeaders = (token) => ({
  Authorization: `Token ${token}`,
  'Content-Type': 'application/json',
})

export const getNotes = () => request('/api/notes/')
export const createNote = (data, token) => request('/api/notes/', { method: 'POST', headers: adminHeaders(token), body: JSON.stringify(data) })
export const updateNote = (id, data, token) => request(`/api/notes/${id}/`, { method: 'PATCH', headers: adminHeaders(token), body: JSON.stringify(data) })
export const deleteNote = (id, token) => request(`/api/notes/${id}/`, { method: 'DELETE', headers: { Authorization: `Token ${token}` } })
