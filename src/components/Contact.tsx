import { portfolio } from '../data/portfolio'
import './Section.css'
import './Contact.css'

export function Contact() {
  return (
    <section id="contact" className="section section-contact" aria-labelledby="contact-heading">
      <div className="section-label">04 — Contact</div>
      <h2 id="contact-heading">Let&apos;s connect</h2>
      <p className="section-lead">
        Open to internships, study collaborations, and finance-related projects.
      </p>
      <div className="contact-actions">
        <a href={`mailto:${portfolio.email}`} className="btn btn-primary">
          {portfolio.email}
        </a>
        <div className="contact-social">
          <a href={portfolio.social.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={portfolio.social.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
