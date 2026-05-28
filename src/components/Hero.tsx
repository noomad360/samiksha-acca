import { portfolio } from '../data/portfolio'
import './Hero.css'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <p className="hero-eyebrow">Portfolio</p>
      <h1 id="hero-heading">
        Hi, I&apos;m <em>{portfolio.name}</em>
      </h1>
      <p className="hero-tagline">{portfolio.tagline}</p>
      <p className="hero-location">{portfolio.location}</p>
      <div className="hero-actions">
        <a href="#projects" className="btn btn-primary">
          View projects
        </a>
        <a href={portfolio.social.linkedin} className="btn btn-ghost" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
    </section>
  )
}
