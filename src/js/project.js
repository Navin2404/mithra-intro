import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initCursor } from './cursor.js'
import { initTransitions } from './transition.js'
// Add these imports at the top of about.js and project.js
import { initNoise }   from './noise.js'
import { initMagnetic } from './magnetic.js'

// Add these calls alongside initCursor() and initTransitions()
initNoise()
initMagnetic()

gsap.registerPlugin(ScrollTrigger)

// ─── SMOOTH SCROLL ──────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  ScrollTrigger.update()
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ─── PROJECT DATA ─────────────────────────────────────
// Edit this array with your real project info
const PROJECTS = [
  {
    index: '01',
    title: 'Project Title One',
    tags: 'Brand · Digital · Motion',
    client: 'Client Name',
    year: '2024',
    role: 'Art Direction · Design',
    overview: 'A short description of the project, the brief, the challenge and the approach taken. Keep it to 2–3 sentences.',
    hero: '/assets/images/project-01.jpg',
    gallery: [
      '/assets/images/portrait.jpg',
      '/assets/images/portrait.jpg',
      '/assets/images/portrait.jpg',
    ],
  },
  {
    index: '02',
    title: 'Project Title Two',
    tags: 'Web · Art Direction',
    client: 'Client Name',
    year: '2024',
    role: 'Creative Direction · Web',
    overview: 'A short description of the project. Keep it tight and compelling.',
    hero: '/assets/images/portrait.jpg',
    gallery: [
      '/assets/images/portrait.jpg',
      '/assets/images/portrait.jpg',
    ],
  },
  {
    index: '03',
    title: 'Project Title Three',
    tags: 'Identity · Campaign',
    client: 'Client Name',
    year: '2023',
    role: 'Brand Identity · Design',
    overview: 'A short description of the project.',
    hero: '/assets/images/project-03.jpg',
    gallery: [
      '/assets/images/portrait.jpg',
      '/assets/images/portrait.jpg',
    ],
  },
  {
    index: '04',
    title: 'Project Title Four',
    tags: 'Interactive · Experience',
    client: 'Client Name',
    year: '2023',
    role: 'Interactive Design · Direction',
    overview: 'A short description of the project.',
    hero: '/assets/images/project-04.jpg',
    gallery: [
      '/assets/images/portrait.jpg',
    ],
  },
  {
    index: '05',
    title: 'Project Title Five',
    tags: 'Film · Direction',
    client: 'Client Name',
    year: '2023',
    role: 'Art Direction · Film',
    overview: 'A short description of the project.',
    hero: '/assets/images/project-05.jpg',
    gallery: [
      '/assets/images/portrait.jpg',
      '/assets/images/portrait.jpg',
    ],
  },
  {
    index: '06',
    title: 'Project Title Six',
    tags: 'Brand · Web · Motion',
    client: 'Client Name',
    year: '2022',
    role: 'Brand · Motion Design',
    overview: 'A short description of the project.',
    hero: '/assets/images/portrait.jpg',
    gallery: [
      '/assets/images/portrait.jpg',
    ],
  },
  {
    index: '07',
    title: 'Project Title Seven',
    tags: 'Digital · Experience',
    client: 'Client Name',
    year: '2022',
    role: 'Digital Design · Direction',
    overview: 'A short description of the project.',
    hero: '/assets/images/portrait.jpg',
    gallery: [
      '/assets/images/portrait.jpg',
      '/assets/images/portrait.jpg',
    ],
  },
  {
    index: '08',
    title: 'Project Title Eight',
    tags: 'Campaign · Art Direction',
    client: 'Client Name',
    year: '2022',
    role: 'Art Direction · Campaign',
    overview: 'A short description of the project.',
    hero: '/assets/images/portrait.jpg',
    gallery: [
      '/assets/images/portrait.jpg',
    ],
  },
]

// ─── POPULATE PAGE ────────────────────────────────────
const params = new URLSearchParams(window.location.search)
const id     = parseInt(params.get('id') || '0', 10)
const data   = PROJECTS[id] || PROJECTS[0]
const next   = PROJECTS[(id + 1) % PROJECTS.length]

document.title = `${data.title} — Your Name`

document.getElementById('p-index').textContent   = data.index
document.getElementById('p-tags').textContent    = data.tags
document.getElementById('p-title').textContent   = data.title
document.getElementById('p-overview').textContent = data.overview
document.getElementById('p-client').textContent  = data.client
document.getElementById('p-year').textContent    = data.year
document.getElementById('p-role').textContent    = data.role
document.getElementById('p-hero-src').src        = data.hero
document.getElementById('p-hero-src').alt        = data.title

// Next project link
const nextLink  = document.getElementById('p-next')
const nextTitle = document.getElementById('p-next-title')
nextLink.href        = `/project.html?id=${(id + 1) % PROJECTS.length}`
nextTitle.textContent = next.title

// Gallery
const gallery = document.getElementById('p-gallery')
data.gallery.forEach((src, i) => {
  const item = document.createElement('div')
  item.className = 'gallery-item reveal-up'
  item.innerHTML = `<img src="${src}" alt="${data.title} — ${i + 1}" loading="lazy" />`
  gallery.appendChild(item)
})

// ─── BOOT ─────────────────────────────────────────────
initCursor()
initTransitions()

// ─── HERO REVEAL ──────────────────────────────────────
window.addEventListener('load', () => {
  const lines   = document.querySelectorAll('.reveal-line')
  const heroImg = document.querySelector('.project-hero__image')

  const tl = gsap.timeline()

  tl.to(lines, {
    y: 0,
    duration: 1.1,
    ease: 'power4.out',
    stagger: 0.07,
    delay: 0.15,
  })

  .to(heroImg, {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out',
    onComplete() {
      heroImg.classList.add('revealed')
    },
  }, '-=0.6')
})

// ─── SCROLL REVEALS ───────────────────────────────────
ScrollTrigger.refresh()

document.querySelectorAll('.reveal-up').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      once: true,
    },
  })
})