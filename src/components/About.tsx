import { portfolio } from '../data/portfolio'
import './Section.css'

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="section-label">01 — About</div>
      <h2 id="about-heading">Background</h2>
      <p className="section-lead">{portfolio.about}</p>
    </section>
  )
}
