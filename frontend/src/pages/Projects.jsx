import { useEffect, useState } from 'react'
import ProjectList from '../components/projects/ProjectList.jsx'
import ProjectDetail from './ProjectDetail.jsx'
import { getProjects } from '../services/projectsService.js'

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [projects, setProjects] = useState([])
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setSelectedProject(null)
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])
  useEffect(() => {
    getProjects().then(setProjects).catch((error) => console.error(error))
  }, [])

  return <main className="projects-page">
    <nav className="nav shell">
      <a className="brand" href="/" aria-label="Dani's portfolio home">
      <span className="brand-mark">d.</span> dani<span>portfolio</span></a>
      <a className="text-link" href="/">← Back home</a>
      </nav><section className="all-projects shell">
        <p className="section-kicker">SELECTED WORK / ALL PROJECTS</p>
        <h1>Made of thoughts,<br /><em>shaped by code.</em></h1>
        <p className="all-projects-intro">Every project starts somewhere — 
          with an idea, a blank screen,
          and the small belief that something better can be made.</p>
          <ProjectList projects={projects} onSelect={setSelectedProject} />
          </section>
          <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
          </main>
}   
