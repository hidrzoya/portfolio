const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '')

if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL must be set for production builds.')

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/projects/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail ?? 'Could not sign in.')
  return data
}

export async function logout(token) {
  await fetch(`${API_BASE_URL}/api/projects/auth/logout/`, {
    method: 'POST',
    headers: { Authorization: `Token ${token}` },
  })
}
