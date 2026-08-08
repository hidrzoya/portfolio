import { X } from 'lucide-react'

export default function ProjectDetail({ project, onClose }) {
  if (!project) return null

  return (
    <div className="project-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close project details"><X aria-hidden="true" /></button>
        <p className="section-kicker">SELECTED WORK / PROJECT</p>
        <h2 id="project-modal-title">{project.title}</h2>
        <p className="modal-summary">{project.description}</p>
        <div className="project-tags" aria-label="Project technologies">
          {project.tech_stack.split(',').map((tag) => <span key={tag}>{tag.trim()}</span>)}
        </div>
      </section>
    </div>
  )
}
