import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, CalendarDays } from 'lucide-react'
import { getNotes } from '../services/notesService.js'

function displayDate(value) {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}

function NoteArticle({ note }) {
  const paragraphs = note.content.split(/\n\s*\n/).filter(Boolean)

  return (
    <main className="min-h-screen bg-[#192338] px-5 py-12 text-[#d9e1f1] sm:px-8">
      <article className="mx-auto max-w-3xl">
        <a className="inline-flex items-center gap-2 text-sm font-semibold text-[#8fb3e2] hover:text-[#d9e1f1]" href="/notes"><ArrowLeft size={17} /> All notes</a>
        <p className="mt-12 flex items-center gap-2 text-sm font-medium text-[#8fb3e2]"><CalendarDays size={16} /> {displayDate(note.published_at)}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#e8eef8] sm:text-5xl">{note.title}</h1>
        <p className="mt-6 text-xl leading-8 text-[#8fb3e2]">{note.excerpt}</p>
        <div className="mt-10 space-y-6 text-lg leading-8 text-[#d9e1f1]">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </article>
    </main>
  )
}

function NotesList({ notes }) {
  return (
    <main className="min-h-screen bg-[#192338] px-5 py-12 text-[#d9e1f1] sm:px-8">
      <section className="mx-auto max-w-5xl">
        <a className="inline-flex items-center gap-2 text-sm font-semibold text-[#8fb3e2] hover:text-[#d9e1f1]" href="/"><ArrowLeft size={17} /> Back home</a>
        <p className="mt-12 text-xs font-bold tracking-[0.2em] text-[#8fb3e2]">FROM THE NOTEBOOK</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#e8eef8] sm:text-5xl">Small thoughts, big curiosity.</h1>
        {notes.length === 0 ? <p className="mt-10 text-[#8fb3e2]">No notes have been published yet.</p> : <div className="mt-10 grid gap-5 md:grid-cols-2">{notes.map((note) => <a className="group rounded-2xl border border-[#8fb3e2]/30 bg-[#1e2f4e] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md" href={`/notes/${note.slug}`} key={note.id}><p className="flex items-center justify-between text-sm text-[#8fb3e2]"><span>{displayDate(note.published_at)}</span><ArrowUpRight className="text-[#8fb3e2]" size={19} /></p><h2 className="mt-8 text-2xl font-bold text-[#e8eef8]">{note.title}</h2><p className="mt-3 leading-6 text-[#8fb3e2]">{note.excerpt}</p><span className="mt-6 inline-block text-sm font-semibold text-[#8fb3e2]">Read note</span></a>)}</div>}
      </section>
    </main>
  )
}

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const slug = window.location.pathname.split('/')[2]

  useEffect(() => {
    getNotes().then(setNotes).catch((reason) => setError(reason.message)).finally(() => setLoading(false))
  }, [])

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#192338] text-[#8fb3e2]">Loading notes…</main>
  if (error) return <main className="grid min-h-screen place-items-center bg-[#192338] px-5 text-[#fda4af]">{error}</main>

  const note = notes.find((item) => item.slug === slug)
  return slug ? (note ? <NoteArticle note={note} /> : <NotesList notes={notes} />) : <NotesList notes={notes} />
}
