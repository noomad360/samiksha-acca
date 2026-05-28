import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.75 },
  viewport: { once: true, amount: 0.2 },
}

const stats = [
  { label: 'ACCA Progress', value: 'FA Completed' },
  { label: 'Current Focus', value: 'MA, FR, AA' },
  { label: 'Collaboration', value: 'Remote / Hybrid' },
]

const skills = [
  'Financial Accounting (FA) and Financial Reporting (FR) fundamentals',
  'Ledger Reconciliation and Error Correction',
  'Ratio Analysis and Performance Commentary',
  'Excel for Accounting Schedules',
  'Audit and Assurance (AA) evidence documentation basics',
  'Management Accounting (MA) interpretation and costing logic',
  'Exam Technique and Time Management',
  'Professional Communication for Finance Roles',
]

const papers = [
  {
    code: 'FA',
    title: 'Financial Accounting',
    description: 'Completed paper with focused practice on double-entry, trial balance adjustments, and financial statement basics.',
    status: 'Completed',
  },
  {
    code: 'MA',
    title: 'Management Accounting',
    description: 'Building strength in costing techniques, budgeting, and performance analysis for decision-making.',
    status: 'In Progress',
  },
  {
    code: 'FR',
    title: 'Financial Reporting',
    description: 'Developing clear interpretation of statements, accounting standards awareness, and reporting quality review.',
    status: 'In Progress',
  },
  {
    code: 'AA',
    title: 'Audit and Assurance',
    description: 'Strengthening understanding of audit planning, internal controls, and evidence-based conclusions.',
    status: 'Planned Focus',
  },
]

const timeline = [
  { year: '2024', title: 'Started ACCA Journey', note: 'Established a strong FA foundation with disciplined study and practice.' },
  { year: '2025', title: 'FA Completed', note: 'Shifted active preparation toward MA and FR with regular question review.' },
  { year: '2026', title: 'AA Preparation Track', note: 'Expanding into AA with focus on audit process and assurance reasoning.' },
]

function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  })
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const profileRotate = useTransform(scrollYProgress, [0, 1], [0, -5])

  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    function onMove(e: PointerEvent) {
      setPointer({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const glowStyle = useMemo(() => {
    if (!pointer) return undefined
    return {
      transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)`,
    } as const
  }, [pointer])

  return (
    <div className="page">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="mesh mesh-a" aria-hidden="true" />
      <div className="mesh mesh-b" aria-hidden="true" />
      <div className="mesh mesh-c" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" style={glowStyle} />

      <header className="topbar">
        <div className="topbar-shell">
          <a className="brand" href="#hero">
            <span className="brand-mark" aria-hidden="true" />
            SAMIKSHA / ACCA
          </a>

          <div className="brand-center-wrap">
            <nav className="topbar-nav" aria-label="Main">
              <a href="#about">About</a>
              <a href="#skills">Skills</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>

          <div className="topbar-right">
            <a className="mail desktop-only" href="mailto:samikshabh06@gmail.com">Let's talk</a>
            <button
              className="hamburger mobile-only"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
            >
              <span className="hamburger-box">
                <span className="hamburger-inner" />
              </span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mobile-menu" role="dialog" aria-modal="true">
            <nav>
              <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
              <a href="#skills" onClick={() => setMobileOpen(false)}>Skills</a>
              <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
              <a className="mobile-cta" href="mailto:samikshabh06@gmail.com">Let's talk</a>
            </nav>
          </div>
        )}
      </header>

      <main className="container">
        <motion.section id="hero" className="hero-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
          <article className="hero-main panel panel-hero">
            <motion.p className="eyebrow" initial={{ opacity: 0, letterSpacing: '0.45em' }} animate={{ opacity: 1, letterSpacing: '0.2em' }} transition={{ delay: 0.1, duration: 0.75 }}>
              ACCA STUDENT PORTFOLIO
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
              Samiksha
              <span> Bhattarai</span>
            </motion.h1>
            <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
              I turn ACCA learning into practical accounting output. FA is completed, and my current study focus is MA, FR, and AA.
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
              <a className="btn btn-fill" href="#papers">View ACCA Papers</a>
              <a className="btn btn-line" href="#contact">Book a Conversation</a>
            </motion.div>
          </article>
          <motion.figure
            className="hero-image-wrap hero-image-main panel"
            style={{ y: heroImageY, rotate: profileRotate }}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img src="/profile.png" alt="Portrait of Samiksha Bhattarai" />
          </motion.figure>
        </motion.section>

        <motion.section id="about" className="panel" {...fadeUp}>
          <p className="panel-index">01</p>
          <h2>About</h2>
          <div className="about-layout">
            <p>
              I am an ACCA student based in Nepal, focused on Financial Accounting and professional growth through structured study.
              My direction is clear: build strong command over FA, MA, FR, and AA, then step into finance roles with practical confidence.
            </p>
          </div>
        </motion.section>

        <motion.section className="panel snapshot-panel" {...fadeUp}>
          <p className="panel-index">Snapshot</p>
          <ul className="stat-list">
            {stats.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section id="skills" className="panel" {...fadeUp}>
          <p className="panel-index">02</p>
          <h2>Skills & Strengths</h2>
          <ul className="skills">
            {skills.map((skill, idx) => (
              <motion.li key={skill} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx, duration: 0.45 }} viewport={{ once: true }}>
                {skill}
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <motion.section id="papers" className="panel" {...fadeUp}>
          <p className="panel-index">03</p>
          <h2>ACCA Paper Focus</h2>
          <p className="section-note">Consistent preparation plan across FA, MA, FR, and AA.</p>
          <div className="projects">
            {papers.map((paper, idx) => (
              <motion.article
                key={paper.code}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * idx, duration: 0.55 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -6 }}
              >
                <h3>{paper.code} - {paper.title}</h3>
                <p>{paper.description}</p>
                <span className="project-type">{paper.status}</span>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section id="timeline" className="panel" {...fadeUp}>
          <p className="panel-index">04</p>
          <h2>Journey Timeline</h2>
          <div className="timeline">
            {timeline.map((item, idx) => (
              <motion.article
                key={item.title}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.07 * idx, duration: 0.45 }}
                viewport={{ once: true }}
              >
                <div className="dot" aria-hidden="true" />
                <p className="year">{item.year}</p>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section id="contact" className="panel contact" {...fadeUp}>
          <p className="panel-index">05</p>
          <h2>Let&apos;s Connect</h2>
          <p>Open to internships, collaboration, and entry-level opportunities in accounting and finance.</p>
          <a className="mail-big" href="mailto:samikshabh06@gmail.com">samikshabh06@gmail.com</a>
        </motion.section>
      </main>
    </div>
  )
}

export default App
