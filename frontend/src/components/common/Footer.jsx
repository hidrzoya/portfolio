export default function Footer() {
  return (
    <footer className="footer shell">
      <div className="footer-kicker"><p>Have a nice idea?</p></div>
      <div className="footer-main">
        <a href="mailto:nomeldaniellaempoc@gmail.com">Let&apos;s make it real <span className="arrow">↗</span></a>
        <section className="social-card" aria-label="My social links">
          <h2>My Socials</h2>
          <div className="social-links">
            <a href="mailto:nomeldaniellaempoc@gmail.com" aria-label="Email">✉</a>
            <a className="linkedin-link" href="https://www.linkedin.com/in/daniella-nomel-a597b8377/?skipRedirect=true" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
            <a className="youtube-link" href="https://www.youtube.com/@nomeldaniella" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
          </div>
        </section>
      </div>
      <div className="footer-meta">
        <span>© 2026 Dani </span>
        <span>Made with curiosity ✦</span>
      </div>
    </footer>
  )
}
