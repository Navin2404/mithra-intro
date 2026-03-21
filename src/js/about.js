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

// ─── BOOT ────────────────────────────────────────────
initCursor()
initTransitions()

// ─── HERO REVEAL ─────────────────────────────────────
window.addEventListener('load', () => {
  const lines = document.querySelectorAll('.reveal-line')

  gsap.to(lines, {
    y: 0,
    duration: 1.1,
    ease: 'power4.out',
    stagger: 0.07,
    delay: 0.2,
  })
})

// ─── SCROLL REVEALS ───────────────────────────────────
const reveals = document.querySelectorAll('.reveal-up')

reveals.forEach((el) => {
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