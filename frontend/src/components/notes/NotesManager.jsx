import { useEffect, useState } from 'react'
import { FileText, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { createNote, deleteNote, getNotes, updateNote } from '../../services/notesService.js'

const emptyNote = { title: '', excerpt: '', content: '', published_at: new Date().toISOString().slice(0, 10) }
const inputClass = 'mt-1 w-full rounded-lg border border-[#8fb3e2]/30 bg-[#1e2f4e] px-3 py-2 text-[#e8eef8] outline-none transition focus:border-[#8fb3e2] focus:ring-2 focus:ring-[#8fb3e2]/30'

const makeSlug = (title) => title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function NoteForm({ note, onCancel, onSaved, token }) {
  const [values, setValues] = useState(note ? { ...note } : emptyNote)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEditing = Boolean(note?.id)

  function updateValue(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const payload = { ...values, slug: values.slug || makeSlug(values.title) }
    try {
      const saved = isEditing ? await updateNote(note.id, payload, token) : await createNote(payload, token)
      onSaved(saved, isEditing)
      if (!isEditing) setValues(emptyNote)
    } catch (reason) {
      setError(reason.message)
    } finally {
      setSaving(false)
    }
  }

  return <form className="rounded-2xl border border-[#8fb3e2]/30 bg-[#1e2f4e] p-6 shadow-sm" onSubmit={submit}>
    <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-semibold text-[#e8eef8]">{isEditing ? 'Edit note' : 'Add a note'}</h2>{isEditing && <button className="inline-flex items-center gap-1 text-sm font-medium text-[#8fb3e2]" type="button" onClick={onCancel}><X size={16} /> Cancel</button>}</div>
    <div className="space-y-4">
      <label className="block text-sm font-medium text-[#d9e1f1]">Title<input className={inputClass} name="title" value={values.title} onChange={updateValue} required /></label>
      <label className="block text-sm font-medium text-[#d9e1f1]">Excerpt<textarea className={inputClass} name="excerpt" value={values.excerpt} onChange={updateValue} required rows="3" /></label>
      <label className="block text-sm font-medium text-[#d9e1f1]">Content<textarea className={inputClass} name="content" value={values.content} onChange={updateValue} required rows="8" /></label>
      <label className="block text-sm font-medium text-[#d9e1f1]">Published date<input className={inputClass} name="published_at" type="date" value={values.published_at} onChange={updateValue} required /></label>
    </div>
    {error && <p className="mt-4 text-sm text-[#fda4af]">{error}</p>}
    <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#8fb3e2] px-4 py-2.5 font-semibold text-[#192338] transition hover:bg-[#d9e1f1]" disabled={saving}>{isEditing ? <Save size={18} /> : <Plus size={18} />}{saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create note'}</button>
  </form>
}

export default function NotesManager({ token }) {
  const [notes, setNotes] = useState([])
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getNotes().then(setNotes).catch((reason) => setError(reason.message))
  }, [])

  function saveNote(saved, wasEditing) {
    setNotes((current) => wasEditing ? current.map((note) => note.id === saved.id ? saved : note) : [saved, ...current])
    setEditing(null)
  }

  async function removeNote(note) {
    if (!window.confirm(`Delete “${note.title}”?`)) return
    try {
      await deleteNote(note.id, token)
      setNotes((current) => current.filter((item) => item.id !== note.id))
    } catch (reason) {
      setError(reason.message)
    }
  }

  return <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
    <NoteForm key={editing?.id ?? 'new'} note={editing} token={token} onSaved={saveNote} onCancel={() => setEditing(null)} />
    <div className="rounded-2xl border border-[#8fb3e2]/30 bg-[#1e2f4e] p-6 shadow-sm"><h2 className="mb-4 text-xl font-semibold text-[#e8eef8]">Your notes</h2>{error && <p className="mb-4 text-sm text-[#fda4af]">{error}</p>}{notes.length === 0 ? <p className="text-[#8fb3e2]">No notes yet.</p> : <div className="divide-y divide-[#8fb3e2]/20">{notes.map((note) => <article className="flex items-center gap-4 py-4" key={note.id}><div className="grid h-12 w-12 place-items-center rounded-lg bg-[#31487a] text-[#8fb3e2]"><FileText size={20} /></div><div className="min-w-0 flex-1"><h3 className="truncate font-semibold text-[#e8eef8]">{note.title}</h3><p className="text-sm text-[#8fb3e2]">{note.published_at}</p></div><div className="flex gap-1"><button className="rounded-md p-2 text-[#8fb3e2] hover:bg-[#31487a]" aria-label={`Edit ${note.title}`} onClick={() => setEditing(note)}><Pencil size={17} /></button><button className="rounded-md p-2 text-[#fda4af] hover:bg-[#7f1d1d]/30" aria-label={`Delete ${note.title}`} onClick={() => removeNote(note)}><Trash2 size={17} /></button></div></article>)}</div>}</div>
  </section>
}
