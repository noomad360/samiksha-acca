import { portfolio } from '../data/portfolio'
import './Section.css'
import './Skills.css'

export function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-heading">
      <div className="section-label">02 — Skills</div>
      <h2 id="skills-heading">What I work with</h2>
      <ul className="skills-grid">
        {portfolio.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  )
}
