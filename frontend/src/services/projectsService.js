const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '')

if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL must be set for production builds.')

export const resolveImageUrl = (image) => image?.startsWith('http') ? image : image ? `${API_BASE_URL}${image}` : null

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail ?? 'Request failed.')
  return response.status === 204 ? null : response.json()
}

const adminHeaders = (token) => ({ Authorization: `Token ${token}` })

export const getProjects = () => request('/api/projects/')
export const createProject = (data, token) => request('/api/projects/', { method: 'POST', headers: adminHeaders(token), body: data })
export const updateProject = (id, data, token) => request(`/api/projects/${id}/`, { method: 'PATCH', headers: adminHeaders(token), body: data })
export const deleteProject = (id, token) => request(`/api/projects/${id}/`, { method: 'DELETE', headers: adminHeaders(token) })
export const deleteProjectCoverImage = (id, token) => request(`/api/projects/${id}/cover-image/`, { method: 'DELETE', headers: adminHeaders(token) })
export const deleteProjectGalleryImage = (projectId, imageId, token) => request(`/api/projects/${projectId}/images/${imageId}/`, { method: 'DELETE', headers: adminHeaders(token) })
