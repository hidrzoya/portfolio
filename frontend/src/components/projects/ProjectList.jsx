import ProjectCard from './ProjectCard.jsx'

export default function ProjectList({ projects, onSelect }) {
  const orderedProjects = [...projects].sort((first, second) =>
    (Number(first.display_order ?? 999) - Number(second.display_order ?? 999)) || second.id - first.id,
  )

  return (
    <div className="projects">
      {orderedProjects.map((project, index) => <ProjectCard key={project.id} project={project} displayNumber={index + 1} onSelect={onSelect} />)}
    </div>
  )
}
