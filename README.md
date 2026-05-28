# Portfolio Website

A personal portfolio built with **React**, **TypeScript**, and **Vite**.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Customize your content

Edit `src/data/portfolio.ts` to update:

- Name, tagline, email, and social links
- About section text
- Skills list
- Projects (title, description, tags, links)

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |

## Project structure

```
src/
  components/   # Header, Hero, About, Skills, Projects, Contact, Footer
  data/         # portfolio.ts — all site content in one place
  App.tsx       # Page layout
  index.css     # Global styles & CSS variables
```

## Deploy

Build static files with `npm run build`, then deploy the `dist/` folder to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
