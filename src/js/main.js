import Lenis from 'lenis'
import gsap  from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLoader }      from './loader.js'
import { initCursor }      from './cursor.js'
import { initTransitions } from './transition.js'
import { initNoise }       from './noise.js'

gsap.registerPlugin(ScrollTrigger)

// ─── ELEMENTS ─────────────────────────────────────────
const strip     = document.getElementById('strip')
const container = document.getElementById('scroll-container')
const counterCur = document.getElementById('counter__cur')
const thumbsBar  = document.getElementById('thumbs')
const thumbEls   = document.querySelectorAll('.thumb')
const items      = document.querySelectorAll('.item')
const TOTAL      = items.length

// ─── STATE ────────────────────────────────────────────
let expandedIndex = -1   // which item is open, -1 = none
let scrollTween         // the horizontal scroll tween
let isAnimating = false  // guard during transitions
let currentProgress = 0 // track scroll progress

// ─── SMOOTH SCROLL ────────────────────────────────────
const lenis = new Lenis({
  duration: 1.6,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  ScrollTrigger.update()
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ─── BOOT ─────────────────────────────────────────────
initCursor()
initTransitions()
initNoise()

initLoader(() => {
  buildScrollScene()
  bindEvents()
  entrance()
})

// ─── ENTRANCE ─────────────────────────────────────────
function entrance() {
  gsap.fromTo('#nav',
    { opacity: 0, y: -12 },
    { opacity: 1, y: 0, duration: .7, ease: 'power3.out', delay: .1 }
  )
  gsap.fromTo(items,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
      stagger: .06, delay: .2 }
  )
  gsap.fromTo('#counter',
    { opacity: 0 },
    { opacity: 1, duration: .6, delay: .7 }
  )
}

// ─── HORIZONTAL SCROLL SCENE ──────────────────────────
function buildScrollScene() {
  const getTravel = () => {
    const stripW = strip.scrollWidth
    const viewW  = window.innerWidth
    return Math.max(0, stripW - viewW + viewW * 0.12)
  }

  const travel = getTravel()
  container.style.setProperty('--scroll-height', (window.innerHeight + travel) + 'px')

  scrollTween = gsap.to(strip, {
    x: -travel,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: () => '+=' + getTravel(),
      pin: '#sticky-wrap',
      scrub: 1.4,
      invalidateOnRefresh: true,
      onUpdate(self) {
        currentProgress = self.progress
        // Update counter — but only when nothing expanded
        if (expandedIndex === -1) {
          const idx = Math.round(self.progress * (TOTAL - 1))
          counterCur.textContent = String(idx + 1).padStart(2, '0')
        }
      },
    },
  })

  window.addEventListener('resize', () => {
    container.style.setProperty('--scroll-height',
      (window.innerHeight + getTravel()) + 'px')
    ScrollTrigger.refresh()
  })
}

// ─── EXPAND ITEM ──────────────────────────────────────
function expandItem(index) {
  if (isAnimating || expandedIndex !== -1) return
  isAnimating = true
  expandedIndex = index

  const item = items[index]

  // Dim all others
  items.forEach((el, i) => {
    if (i !== index) el.classList.add('is-dimmed')
  })

  // Pause scroll
  lenis.stop()
  ScrollTrigger.getAll().forEach(t => t.disable())

  // Expand
  item.classList.add('is-expanded')

  // Show thumbnails, update active
  thumbsBar.classList.add('is-visible')
  thumbEls.forEach(t => t.classList.remove('active'))
  thumbEls[index].classList.add('active')

  // Update counter
  counterCur.textContent = String(index + 1).padStart(2, '0')

  setTimeout(() => { isAnimating = false }, 900)
}

// ─── COLLAPSE ITEM ────────────────────────────────────
function collapseItem() {
  if (isAnimating || expandedIndex === -1) return
  isAnimating = true

  const item = items[expandedIndex]
  expandedIndex = -1

  // Collapse
  item.classList.remove('is-expanded')

  // Un-dim all
  items.forEach(el => el.classList.remove('is-dimmed'))

  // Hide thumbnails
  thumbsBar.classList.remove('is-visible')

  // Re-enable scroll after animation
  setTimeout(() => {
    lenis.start()
    ScrollTrigger.getAll().forEach(t => t.enable())
    ScrollTrigger.refresh()
    isAnimating = false
  }, 950)
}

// ─── BIND EVENTS ──────────────────────────────────────
function bindEvents() {

  // Click item → expand
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (expandedIndex === -1) {
        expandItem(i)
      }
    })
  })

  // Scroll down while expanded → collapse
  window.addEventListener('wheel', (e) => {
    if (expandedIndex !== -1 && e.deltaY > 30) {
      collapseItem()
    }
  }, { passive: true })

  // Touch swipe down while expanded → collapse
  let touchStartY = 0
  window.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY
  }, { passive: true })

  window.addEventListener('touchend', e => {
    const dy = touchStartY - e.changedTouches[0].clientY
    // Swipe UP on screen = scroll down = collapse
    if (expandedIndex !== -1 && dy < -40) {
      collapseItem()
    }
  }, { passive: true })

  // Thumbnail click while expanded → jump to that item
  thumbEls.forEach((thumb, i) => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation()
      if (expandedIndex === -1) return

      // Collapse current, expand new
      const prev = items[expandedIndex]
      prev.classList.remove('is-expanded')
      expandedIndex = -1

      setTimeout(() => {
        expandItem(i)
      }, 50)
    })
  })

  // ESC → collapse
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && expandedIndex !== -1) collapseItem()
  })
}