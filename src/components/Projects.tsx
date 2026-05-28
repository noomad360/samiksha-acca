import { portfolio } from '../data/portfolio'
import './Section.css'
import './Projects.css'

export function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="section-label">03 — Projects</div>
      <h2 id="projects-heading">Selected work</h2>
      <ul className="projects-list">
        {portfolio.projects.map((project) => (
          <li key={project.title} className="project-card">
            <div className="project-card-inner">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul className="project-tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className="project-links">
                {'link' in project && project.link !== '#' && (
                  <a href={project.link} target="_blank" rel="noreferrer">
                    Live demo →
                  </a>
                )}
                {'github' in project && project.github && project.github !== '#' && (
                  <a href={project.github} target="_blank" rel="noreferrer">
                    Source
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
