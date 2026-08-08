import { useEffect, useState } from 'react'
import { ImagePlus, LockKeyhole, LogOut, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { login, logout } from '../services/authService.js'
import { createProject, deleteProject, deleteProjectCoverImage, deleteProjectGalleryImage, getProjects, resolveImageUrl, updateProject } from '../services/projectsService.js'
import NotesManager from '../components/notes/NotesManager.jsx'

const emptyProject = { title: '', description: '', tech_stack: '', project_url: '', github_url: '', display_order: 0, image: null, gallery: [] }
const inputClass = 'mt-1 w-full rounded-lg border border-[#8fb3e2]/30 bg-[#1e2f4e] px-3 py-2 text-[#e8eef8] outline-none transition focus:border-[#8fb3e2] focus:ring-2 focus:ring-[#8fb3e2]/30'
const sortProjects = (projects) => [...projects].sort((a, b) => (Number(a.display_order ?? 0) - Number(b.display_order ?? 0)) || b.id - a.id)

function ProjectForm({ project, onCancel, onImageDeleted, onSaved, token }) {
  const [values, setValues] = useState(project ?? emptyProject)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEditing = Boolean(project?.id)

  function updateValue(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function removeCoverImage() {
    if (values.image instanceof File || !isEditing) {
      setValues({ ...values, image: null })
      return
    }
    if (!window.confirm('Delete this cover image?')) return
    try {
      await deleteProjectCoverImage(project.id, token)
      setValues({ ...values, image: null })
      onImageDeleted(project.id, 'cover')
    } catch (reason) {
      setError(reason.message)
    }
  }

  async function removeGalleryImage(image) {
    if (!window.confirm('Delete this gallery image?')) return
    try {
      await deleteProjectGalleryImage(project.id, image.id, token)
      setValues({ ...values, images: values.images.filter((item) => item.id !== image.id) })
      onImageDeleted(project.id, image.id)
    } catch (reason) {
      setError(reason.message)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const data = new FormData()
    for (const [key, value] of Object.entries(values)) {
      if (key === 'gallery' || key === 'images') continue
      if (key !== 'image' || value instanceof File) data.append(key, value ?? '')
    }
    for (const image of values.gallery ?? []) data.append('gallery', image)
    try {
      const saved = isEditing ? await updateProject(project.id, data, token) : await createProject(data, token)
      onSaved(saved, isEditing)
      if (!isEditing) setValues(emptyProject)
    } catch (reason) {
      setError(reason.message)
    } finally {
      setSaving(false)
    }
  }

  return <form className="rounded-2xl border border-[#8fb3e2]/30 bg-[#1e2f4e] p-6 shadow-sm" onSubmit={handleSubmit}>
    <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-semibold text-[#e8eef8]">{isEditing ? 'Edit project' : 'Add a project'}</h2>{isEditing && <button className="inline-flex items-center gap-1 text-sm font-medium text-[#8fb3e2] hover:text-[#e8eef8]" type="button" onClick={onCancel}><X size={16} /> Cancel</button>}</div>
    <div className="space-y-4">
      <label className="block text-sm font-medium text-[#d9e1f1]">Title<input className={inputClass} name="title" value={values.title} onChange={updateValue} required /></label>
      <label className="block text-sm font-medium text-[#d9e1f1]">Description<textarea className={inputClass} name="description" value={values.description} onChange={updateValue} required rows="5" /></label>
      <label className="block text-sm font-medium text-[#d9e1f1]">Tech stack <span className="font-normal text-[#8fb3e2]">(comma-separated)</span><input className={inputClass} name="tech_stack" value={values.tech_stack} onChange={updateValue} required /></label>
      <label className="block text-sm font-medium text-[#d9e1f1]">Display order <span className="font-normal text-[#8fb3e2]">(1 is first; leave 0 to place last)</span><input className={inputClass} name="display_order" type="number" min="0" value={values.display_order ?? 0} onChange={updateValue} required /></label>
      <label className="block text-sm font-medium text-[#d9e1f1]">Project URL<input className={inputClass} name="project_url" type="url" value={values.project_url ?? ''} onChange={updateValue} /></label>
      <label className="block text-sm font-medium text-[#d9e1f1]">GitHub URL<input className={inputClass} name="github_url" type="url" value={values.github_url ?? ''} onChange={updateValue} /></label>
      <label className="block text-sm font-medium text-[#d9e1f1]">Image<input className="mt-1 block w-full text-sm text-[#8fb3e2] file:mr-3 file:rounded-lg file:border-0 file:bg-[#31487a] file:px-3 file:py-2 file:font-medium file:text-[#8fb3e2] hover:file:bg-[#31487a]" name="image" type="file" accept="image/*" onChange={(event) => setValues({ ...values, image: event.target.files[0] ?? null })} /></label>
      {values.image && <div className="relative"><img className="h-40 w-full rounded-lg border border-[#8fb3e2]/30 bg-[#192338] object-contain" src={values.image instanceof File ? URL.createObjectURL(values.image) : resolveImageUrl(values.image)} alt="Cover image preview" /><button className="absolute right-2 top-2 rounded-md bg-[#7f1d1d] p-1.5 text-[#fda4af]" type="button" aria-label="Delete cover image" onClick={removeCoverImage}><X size={16} /></button></div>}
      <label className="block text-sm font-medium text-[#d9e1f1]">Gallery images <span className="font-normal text-[#8fb3e2]">(optional, select multiple)</span><input className="mt-1 block w-full text-sm text-[#8fb3e2] file:mr-3 file:rounded-lg file:border-0 file:bg-[#31487a] file:px-3 file:py-2 file:font-medium file:text-[#8fb3e2] hover:file:bg-[#31487a]" name="gallery" type="file" accept="image/*" multiple onChange={(event) => setValues({ ...values, gallery: Array.from(event.target.files) })} /></label>
      {values.images?.length > 0 && <div><p className="mb-2 text-sm font-medium text-[#d9e1f1]">Current gallery</p><div className="grid grid-cols-3 gap-2">{values.images.map((item) => <div className="relative" key={item.id}><img className="h-20 w-full rounded-md border border-[#8fb3e2]/30 bg-[#192338] object-cover" src={resolveImageUrl(item.image)} alt="Current gallery image" /><button className="absolute right-1 top-1 rounded bg-[#7f1d1d] p-1 text-[#fda4af]" type="button" aria-label="Delete gallery image" onClick={() => removeGalleryImage(item)}><X size={13} /></button></div>)}</div></div>}
      {values.gallery?.length > 0 && <div className="grid grid-cols-3 gap-2">{values.gallery.map((image, index) => <div className="relative" key={`${image.name}-${image.lastModified}`}><img className="h-20 w-full rounded-md border border-[#8fb3e2]/30 bg-[#192338] object-cover" src={URL.createObjectURL(image)} alt="Gallery image preview" /><button className="absolute right-1 top-1 rounded bg-[#7f1d1d] p-1 text-[#fda4af]" type="button" aria-label="Remove selected gallery image" onClick={() => setValues({ ...values, gallery: values.gallery.filter((_, currentIndex) => currentIndex !== index) })}><X size={13} /></button></div>)}</div>}
    </div>
    {error && <p className="mt-4 text-sm text-[#fda4af]">{error}</p>}
    <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#8fb3e2] px-4 py-2.5 font-semibold text-[#192338] transition hover:bg-[#d9e1f1] disabled:cursor-not-allowed disabled:opacity-60" disabled={saving}>{isEditing ? <Save size={18} /> : <Plus size={18} />}{saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create project'}</button>
  </form>
}

function ProjectThumbnail({ project }) {
  if (project.image) {
    return <img className="h-14 w-14 rounded-lg object-cover" src={resolveImageUrl(project.image)} alt="" />
  }

  return <div className="grid h-14 w-14 place-items-center rounded-lg bg-[#31487a] text-[#8fb3e2]"><ImagePlus size={22} /></div>
}

function Dashboard({ token, onLogout }) {
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getProjects().then((items) => setProjects(sortProjects(items))).catch((reason) => setError(reason.message))
  }, [])

  function saveProject(saved, wasEditing) {
    setProjects((current) => sortProjects(wasEditing ? current.map((project) => project.id === saved.id ? saved : project) : [...current, saved]))
    setEditing(null)
  }

  function removeImage(projectId, imageId) {
    setProjects((current) => current.map((project) => {
      if (project.id !== projectId) return project
      return imageId === 'cover' ? { ...project, image: null } : { ...project, images: project.images.filter((image) => image.id !== imageId) }
    }))
  }

  async function removeProject(project) {
    if (!window.confirm(`Delete “${project.title}”?`)) return
    try {
      await deleteProject(project.id, token)
      setProjects((current) => current.filter((item) => item.id !== project.id))
    } catch (reason) {
      setError(reason.message)
    }
  }

  return (
    <main className="min-h-screen bg-[#192338] px-5 py-10 text-[#d9e1f1] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#8fb3e2]">PRIVATE AREA</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#e8eef8]">Project dashboard</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#8fb3e2] hover:bg-[#31487a] hover:text-[#e8eef8]" onClick={onLogout}>
            <LogOut size={17} /> Sign out
          </button>
        </header>
        {error && <p className="mb-5 rounded-lg bg-[#7f1d1d]/30 p-3 text-sm text-[#fda4af]">{error}</p>}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
          <ProjectForm key={editing?.id ?? 'new'} project={editing} token={token} onSaved={saveProject} onImageDeleted={removeImage} onCancel={() => setEditing(null)} />
          <section className="rounded-2xl border border-[#8fb3e2]/30 bg-[#1e2f4e] p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#e8eef8]">Your projects</h2>
            {projects.length === 0 ? <p className="text-[#8fb3e2]">No projects yet.</p> : <div className="divide-y divide-[#8fb3e2]/20">{projects.map((project) => <article className="flex items-center gap-4 py-4" key={project.id}><span className="w-7 text-sm font-bold text-[#8fb3e2]">{String(project.display_order).padStart(2, '0')}</span><ProjectThumbnail project={project} /><div className="min-w-0 flex-1"><h3 className="truncate font-semibold text-[#e8eef8]">{project.title}</h3><p className="truncate text-sm text-[#8fb3e2]">{project.tech_stack}</p></div><div className="flex gap-1"><button className="rounded-md p-2 text-[#8fb3e2] hover:bg-[#31487a] hover:text-[#e8eef8]" aria-label={`Edit ${project.title}`} onClick={() => setEditing(project)}><Pencil size={17} /></button><button className="rounded-md p-2 text-[#fda4af] hover:bg-[#7f1d1d]/30 hover:text-[#fda4af]" aria-label={`Delete ${project.title}`} onClick={() => removeProject(project)}><Trash2 size={17} /></button></div></article>)}</div>}
          </section>
        </div>
        <NotesManager token={token} />
      </div>
    </main>
  )
}

export default function AdminDashboard() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin-token'))
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    try {
      const result = await login(credentials.username, credentials.password)
      sessionStorage.setItem('admin-token', result.token)
      setToken(result.token)
    } catch (reason) {
      setError(reason.message)
    }
  }

  async function handleLogout() {
    await logout(token)
    sessionStorage.removeItem('admin-token')
    setToken(null)
  }

  if (token) return <Dashboard token={token} onLogout={handleLogout} />

  return (
    <main className="grid min-h-screen place-items-center bg-[#192338] px-5 py-10">
      <form className="w-full max-w-md rounded-2xl border border-[#8fb3e2]/30 bg-[#1e2f4e] p-7 shadow-sm" onSubmit={handleLogin}>
        <div className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-[#8fb3e2] text-white"><LockKeyhole size={21} /></div>
        <p className="text-xs font-bold tracking-[0.2em] text-[#8fb3e2]">PRIVATE AREA</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#e8eef8]">Admin sign in</h1>
        <div className="mt-6 space-y-4"><label className="block text-sm font-medium text-[#d9e1f1]">Username<input className={inputClass} value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} required /></label><label className="block text-sm font-medium text-[#d9e1f1]">Password<input className={inputClass} type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required /></label></div>
        {error && <p className="mt-4 text-sm text-[#fda4af]">{error}</p>}
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#8fb3e2] px-4 py-2.5 font-semibold text-[#192338] transition hover:bg-[#d9e1f1]"><LockKeyhole size={18} /> Sign in</button>
      </form>
    </main>
  )
}
