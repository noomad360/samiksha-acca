export const portfolio = {
  name: 'Samiksha Bhattarai',
  tagline: 'ACCA student building a modern finance career',
  location: 'Kathmandu, Nepal · Open to internships',
  email: 'samikshabh06@gmail.com',
  social: {
    github: 'https://github.com/samiksha',
    linkedin: 'https://linkedin.com/in/samiksha-bhattarai',
  },
  about: `I am an ACCA student focused on building strong practical foundations in accounting and financial analysis. I have completed the FA paper and enjoy translating financial data into simple, decision-ready insights through structured project work.`,
  skills: [
    'Financial Accounting (FA)',
    'Management Accounting (MA)',
    'Financial Reporting (FR)',
    'Audit and Assurance (AA)',
    'Double-entry & Ledger Systems',
    'Excel & Financial Modelling',
    'Business and Financial Analysis',
    'Ratio & Performance Analysis',
    'Presentation & Communication',
    'Exam Technique & Time Management',
  ],
  projects: [
    {
      title: 'FA Practice Workbook',
      description:
        'Interactive FA practice environment with timed attempts, feedback loops, and progress snapshots.',
      tags: ['ACCA FA', 'Practice Questions', 'Exam Prep'],
      link: '#',
      github: '#',
    },
    {
      title: 'Listed Company Ratio Brief',
      description:
        'Comparative analysis of profitability, liquidity, and solvency metrics with concise executive commentary.',
      tags: ['Excel', 'ACCA FR'],
      link: '#',
    },
    {
      title: 'ACCA Revision Companion',
      description:
        'Organized notes and rapid-review flashcards for exam prep with topic-first indexing.',
      tags: ['Revision Notes', 'Flashcards', 'ACCA Prep'],
      link: '#',
    },
  ],
  nav: [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'papers', label: 'Papers' },
    { id: 'contact', label: 'Contact' },
  ],
} as const
