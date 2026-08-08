import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Footer from '../components/common/Footer.jsx'
import Navbar from '../components/common/Navbar.jsx'
import ProjectList from '../components/projects/ProjectList.jsx'
import ProjectDetail from './ProjectDetail.jsx'
import { getProjects } from '../services/projectsService.js'

const Arrow = () => <ArrowUpRight className="arrow" aria-hidden="true" />

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isAboutExpanded, setIsAboutExpanded] = useState(false)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setSelectedProject(null)
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    getProjects().then(setProjects).catch((error) => console.error(error))
  }, [])

  return (
    <main>
      <Navbar />
      <section className="hero shell" id="home">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="spark">✦</span> Software Engineer · Full-Stack Developer
            </p>
          <h1>
            A little logic,<br /><em>a little wonder.</em>
          </h1>
          <p className="intro">Hi, I&apos;m Daniella — I’m a software engineer and full-stack developer 
            focused on building modern web applications across the frontend, backend, databases, APIs, and cloud. 
            I enjoy solving complex technical challenges and developing secure, scalable, and 
            maintainable systems that deliver reliable experiences for users.
            </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">See my work <Arrow /></a>
            <a className="text-link" href="#about">A little about me <span>↓</span></a>
          </div>
        </div>
        <div className="hero-art" aria-label="A friendly cat, dinosaur, and shark illustration">
          <span className="orbit orbit-one" /><span className="orbit orbit-two" />
          <span className="star star-one">✦</span><span className="star star-two">✦</span>
          <div className="creature cat"><span className="ear left" /><span className="ear right" /><i>•ᴗ•</i></div>
          <div className="creature dino"><span className="dino-spikes">▲▲▲</span><i>•ᴗ•</i></div>
          <div className="creature shark"><span className="fin">◢</span><i>•ᴗ•</i></div>
          <p className="art-caption">cats + dinos + sharks</p>
        </div>
      </section>
      <section className="marquee" aria-label="My specialties"><div><span>full-stack development <b>✦</b> front-end development <b>✦</b> back-end development <b>✦</b> web design <b>✦</b> REST APIs <b>✦</b> database design <b>✦</b> cloud deployment <b>✦</b> AI integration <b>✦</b></span><span aria-hidden="true">full-stack development <b>✦</b> front-end development <b>✦</b> back-end development <b>✦</b> web design <b>✦</b> REST APIs <b>✦</b> database design <b>✦</b> cloud deployment <b>✦</b> AI integration <b>✦</b></span></div></section>
      <section className="about shell" id="about">
        <p className="section-kicker">01 / ABOUT ME</p>
        <div className="about-grid"><h2>I write logic<br />into <em>living things.</em></h2><div className="about-copy">
          <p>I&apos;m Daniella Nomel a Computer Science graduate, developer, and designer who loves turning good ideas into useful, reliable, and engaging experiences on the web. I enjoy building full-stack applications, exploring AI integration, and creating systems that are both thoughtfully designed and technically sound.</p>
          <div className="about-more" id="about-more" hidden={!isAboutExpanded}>
            <p>I have hands-on experience in full-stack development, AI integration, and enterprise web applications, working with technologies such as React, Django, Laravel, REST APIs, SQL, and Microsoft Azure. I enjoy building modern, secure, and scalable applications while solving technical problems and exploring new ways to use technology.</p>
            <p>My process is equal parts careful systems thinking and playful experimentation. I enjoy learning by building, turning ideas into practical software solutions, and continuously improving my skills with new technologies.</p>
            <p>When I&apos;m away from my laptop, you&apos;ll probably find me looking at cats, learning dinosaur facts, or attempting to identify every shark in a nature documentary.</p>
          </div>
          <button className="about-toggle" type="button" aria-expanded={isAboutExpanded} aria-controls="about-more" onClick={() => setIsAboutExpanded((expanded) => !expanded)}>{isAboutExpanded ? 'See less' : 'See more'} <span aria-hidden="true">{isAboutExpanded ? '↑' : '↓'}</span></button>
          <div className="about-links"><a className="text-link" href="mailto:nomeldaniellaempoc@gmail.com">Get in touch <Arrow /></a><a className="button button-primary cv-button" href="/daniellanomelresume.pdf" download>Download CV <span aria-hidden="true">↓</span></a></div>
        </div></div>
        <section className="skills" aria-labelledby="skills-heading"><h3 id="skills-heading">Technical skills</h3><div className="skills-grid">
          <div><strong>Programming languages</strong>
          <span>Python, Java, JavaScript, PHP, SQL, HTML, CSS</span>
          </div>
          <div>
            <strong>Framework & Web technologies</strong>
            <span>Django, Laravel, React, Vite, RESTful APIs</span>
          </div>
          <div>
            <strong>Databases</strong>
            <span>PostgreSQL, MySQL, SQLite</span>
          </div>
          <div>
            <strong>Cloud &amp; platforms</strong>
            <span>Linux, Microsoft Azure, Microsoft 365, Termius, WordPress</span>
          </div>
          <div>
            <strong>Productivity tools</strong>
            <span>Figma, Visual Studio Code, Git, GitHub, Postman, Microsoft Office Suite</span>
          </div>
        </div></section>
      </section>
      <section className="experience shell" id="experience"><p className="section-kicker">02 / EXPERIENCE</p><div className="experience-grid"><div><h2>Software Engineering <em>Experience</em></h2><p className="experience-intro">I&apos;ve worked across full-stack development, AI integration, enterprise applications, and cloud deployment, building and maintaining software from the frontend to the backend.</p></div><ul className="experience-list"><li>Developed and maintained full-stack web applications using React, Django, and Laravel.</li><li>Designed and integrated RESTful APIs, improving communication and data flow between frontend and backend systems.</li><li>Built and maintained SQL databases, including schema design, migrations, and performance optimization.</li><li>Implemented AI-assisted solutions to automate workflows, generate insights, and improve operational efficiency.</li><li>Deployed, monitored, and maintained applications on Microsoft Azure, using tools such as Termius to support application reliability and security.</li><li>Managed WordPress websites, updating content, resolving UI issues, and improving responsive experiences.</li><li>Tested and validated enterprise business processes, including payroll, accounts payable, and customs-related workflows.</li><li>Collaborated in Agile development environments, using Git, Postman, and Microsoft 365 to build and deliver reliable software solutions.</li></ul></div></section>
      <section className="work shell" id="work"><div className="section-heading"><p className="section-kicker">03 / SELECTED WORK</p><a className="text-link" href="/projects" target="_blank" rel="noreferrer">View all projects <Arrow /></a></div><ProjectList projects={projects.slice(0, 3)} onSelect={setSelectedProject} /></section>
      <section className="notes shell" id="notes"><div><p className="section-kicker">04 / FROM THE NOTEBOOK</p><h2>Small thoughts,<br />big <em>curiosity.</em></h2></div><a className="note-card" href="/notes/why-i-still-sketch-before-i-code"><span>01.07.2026</span><h3>Why I still sketch before I code</h3><Arrow /></a><a className="note-card" href="/notes/building-a-web-that-feels-alive"><span>14.07.2026</span><h3>Building a web that feels alive</h3><Arrow /></a></section>
      <Footer />
      <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  )
}
