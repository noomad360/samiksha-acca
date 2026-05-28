import { portfolio } from '../data/portfolio'
import './Header.css'

export function Header() {
  return (
    <header className="site-header">
      <a href="#" className="logo">
        {portfolio.name}
        <span className="logo-dot" aria-hidden="true" />
      </a>
      <nav aria-label="Main">
        <ul>
          {portfolio.nav.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <a href="#contact" className="header-cta">
        Get in touch
      </a>
    </header>
  )
}
