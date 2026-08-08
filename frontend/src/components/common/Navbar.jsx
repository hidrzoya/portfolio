const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>

export default function Navbar() {
  return (
    <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#home" aria-label="Dani's portfolio home">
        <span className="brand-mark">dn.</span> da<span>ni</span>
      </a>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#work">Work</a>
        <a href="#notes">Notes</a>
        <a className="nav-contact" href="mailto:nomeldaniellaempoc@gmail.com">Let&apos;s talk <Arrow /></a>
      </div>
    </nav>
  )
}
