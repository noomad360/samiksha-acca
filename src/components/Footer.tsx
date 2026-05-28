import { portfolio } from '../data/portfolio'
import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <p>
        © {year} {portfolio.name}. ACCA portfolio and learning journey.
      </p>
    </footer>
  )
}
