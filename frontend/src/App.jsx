import './App.css'

const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>

function App() {
  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#home" aria-label="Dani's portfolio home">
          <span className="brand-mark">d.</span> dani<span>portfolio</span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#notes">Notes</a>
          <a className="nav-contact" href="mailto:hello@example.com">Let&apos;s talk <Arrow /></a>
        </div>
      </nav>

      <section className="hero shell" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><span className="spark">✦</span> Available for thoughtful projects</p>
          <h1>Designing little<br /><em>digital worlds.</em></h1>
          <p className="intro">Hi, I&apos;m Dani — a creative developer making warm, curious websites and experiences for people with big ideas.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">See my work <Arrow /></a>
            <a className="text-link" href="#about">A little about me <span>↓</span></a>
          </div>
        </div>
        <div className="hero-art" aria-label="A friendly cat, dinosaur, and shark illustration">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="star star-one">✦</span><span className="star star-two">✦</span>
          <div className="creature cat"><span className="ear left" /><span className="ear right" /><i>•ᴗ•</i></div>
          <div className="creature dino"><span className="dino-spikes">▲▲▲</span><i>•ᴗ•</i></div>
          <div className="creature shark"><span className="fin">◢</span><i>•ᴗ•</i></div>
          <p className="art-caption">cats + dinos + sharks</p>
        </div>
      </section>

      <section className="marquee" aria-label="My specialties">
        <div>web design <b>✦</b> front-end development <b>✦</b> playful identities <b>✦</b> web design <b>✦</b> front-end development <b>✦</b></div>
      </section>

      <section className="about shell" id="about">
        <p className="section-kicker">01 / ABOUT ME</p>
        <div className="about-grid">
          <h2>I make the internet feel<br />a bit more <em>human.</em></h2>
          <div className="about-copy">
            <p>I&apos;m a developer and designer who loves turning good ideas into useful, joyful places on the web. My process is equal parts careful systems thinking and playful experimentation.</p>
            <p>When I&apos;m away from my laptop, you&apos;ll probably find me looking at cats, learning dinosaur facts, or attempting to identify every shark in a nature documentary.</p>
            <a className="text-link" href="mailto:hello@example.com">Get in touch <Arrow /></a>
          </div>
        </div>
        <div className="stats">
          <div><strong>03+</strong><span>years making things</span></div>
          <div><strong>24</strong><span>happy projects shipped</span></div>
          <div><strong>∞</strong><span>snacks during a sprint</span></div>
        </div>
      </section>

      <section className="work shell" id="work">
        <div className="section-heading"><p className="section-kicker">02 / SELECTED WORK</p><a className="text-link" href="#work">View all projects <Arrow /></a></div>
        <div className="projects">
          <article className="project project-dino"><div className="project-art"><span>ROAR!</span><div className="tiny-dino">●ᴗ●</div></div><div className="project-info"><p>Brand + Website</p><h3>Jurassic Journal</h3><a href="#work" aria-label="View Jurassic Journal project"><Arrow /></a></div></article>
          <article className="project project-cat"><div className="project-art"><span className="yarn">◌</span><div className="project-cat-face">•ᴗ•</div></div><div className="project-info"><p>Design system</p><h3>Catnip Club</h3><a href="#work" aria-label="View Catnip Club project"><Arrow /></a></div></article>
          <article className="project project-shark"><div className="project-art"><span className="bubble">○</span><span className="wave">〰</span><div className="tiny-shark">◢ •ᴗ•</div></div><div className="project-info"><p>Web experience</p><h3>Blue Current</h3><a href="#work" aria-label="View Blue Current project"><Arrow /></a></div></article>
        </div>
      </section>

      <section className="notes shell" id="notes"><div><p className="section-kicker">03 / FROM THE NOTEBOOK</p><h2>Small thoughts,<br />big <em>curiosity.</em></h2></div><a className="note-card" href="#notes"><span>01.07.2025</span><h3>Why I still sketch before I code</h3><Arrow /></a><a className="note-card" href="#notes"><span>14.06.2025</span><h3>Building a web that feels alive</h3><Arrow /></a></section>

      <footer className="footer shell"><p>Have a nice idea?</p><a href="mailto:hello@example.com">Let&apos;s make it real <Arrow /></a><div><span>© 2025 Dani Creates</span><span>Made with curiosity ✦</span></div></footer>
    </main>
  )
}

export default App
