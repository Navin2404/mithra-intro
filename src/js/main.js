import gsap from 'gsap'
import { initLoader }      from './loader.js'
import { initCursor }      from './cursor.js'
import { initTransitions } from './transition.js'
import { initNoise }       from './noise.js'

// ─── ELEMENTS ─────────────────────────────────────────
const strip      = document.getElementById('strip')
const items      = document.querySelectorAll('.item')
const thumbEls   = document.querySelectorAll('.thumb')
const thumbsBar  = document.getElementById('thumbs')
const counterCur = document.getElementById('counter__cur')
const counterEl  = document.getElementById('counter')
const TOTAL      = items.length

// ─── STATE ────────────────────────────────────────────
let expandedIndex  = -1
let currentSlide   = 0
let isAnimating    = false
let stripX         = 0    // current horizontal offset
let targetX        = 0
let rafId          = null

// Item dimensions
const ITEM_W  = 240
const ITEM_H  = 320
const GAP     = 10
const PADDING = window.innerWidth * 0.08

// ─── BOOT ─────────────────────────────────────────────
initCursor()
initTransitions()
initNoise()

initLoader(() => {
  setupStrip()
  scatterEntrance()
  bindEvents()
})

// ─── INITIAL STRIP POSITION ───────────────────────────
function setupStrip() {
  // Start strip so items are centered vertically — CSS handles that
  // Position strip so first item starts at 8vw
  gsap.set(strip, { x: 0 })
  gsap.set(counterEl, { opacity: 0 })
  gsap.set('#nav', { opacity: 0 })
}

// ─── SCATTER → COLLECT ENTRANCE ──────────────────────
// Images fly in from random positions all over screen, then collect into strip
function scatterEntrance() {
  const vw = window.innerWidth
  const vh = window.innerHeight

  // 1. Set each item at a random scattered position
  items.forEach((item) => {
    const rx = gsap.utils.random(-vw * 0.4, vw * 0.4)
    const ry = gsap.utils.random(-vh * 0.5, vh * 0.5)
    const rr = gsap.utils.random(-25, 25)
    const rs = gsap.utils.random(0.5, 1.3)

    gsap.set(item, {
      x: rx,
      y: ry,
      rotation: rr,
      scale: rs,
      opacity: 0,
    })
  })

  const tl = gsap.timeline({
    onComplete: () => {
      // After collect, show nav + counter
      gsap.to('#nav',    { opacity: 1, duration: 0.5, ease: 'power2.out' })
      gsap.to(counterEl, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      startSmoothScroll()
    }
  })

  // 2. Fade all in scattered
  tl.to(items, {
    opacity: 1,
    duration: 0.5,
    stagger: 0.04,
    ease: 'power2.out',
  })

  // 3. Collect — animate all back to x:0 y:0 rotation:0 scale:1 (strip position)
  .to(items, {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    duration: 1.1,
    stagger: 0.04,
    ease: 'power4.out',
  }, '+=0.15')
}

// ─── SMOOTH HORIZONTAL SCROLL ─────────────────────────
function startSmoothScroll() {
  function loop() {
    // Lerp toward target
    stripX += (targetX - stripX) * 0.08
    gsap.set(strip, { x: stripX })

    // Update counter based on which item is most centered
    const centerX  = window.innerWidth / 2
    const stepW    = ITEM_W + GAP
    const rawIdx   = (-stripX + centerX - PADDING - ITEM_W / 2) / stepW
    const snapIdx  = Math.round(rawIdx)
    const clamped  = Math.max(0, Math.min(TOTAL - 1, snapIdx))

    if (clamped !== currentSlide) {
      currentSlide = clamped
      counterCur.textContent = String(currentSlide + 1).padStart(2, '0')
    }

    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)
}

// Max scroll — so last item doesn't go past center
function getMaxScroll() {
  const totalW = TOTAL * (ITEM_W + GAP) - GAP + PADDING * 2
  return Math.max(0, totalW - window.innerWidth)
}

// ─── EXPAND ───────────────────────────────────────────
function expandItem(index) {
  if (isAnimating || expandedIndex !== -1) return
  isAnimating   = true
  expandedIndex = index

  const item = items[index]

  // Dim all others
  items.forEach((el, i) => {
    if (i !== index) el.classList.add('is-dimmed')
  })

  // Stop smooth scroll loop
  cancelAnimationFrame(rafId)

  // Expand this item
  item.classList.add('is-expanded')

  // Show thumbs, set active
  thumbsBar.classList.add('is-visible')
  thumbEls.forEach(t => t.classList.remove('active'))
  thumbEls[index].classList.add('active')

  // Update counter
  counterCur.textContent = String(index + 1).padStart(2, '0')

  setTimeout(() => { isAnimating = false }, 1000)
}

// ─── COLLAPSE ─────────────────────────────────────────
function collapseItem() {
  if (isAnimating || expandedIndex === -1) return
  isAnimating = true

  const item = items[expandedIndex]
  expandedIndex = -1

  // Remove expanded
  item.classList.remove('is-expanded')

  // Un-dim all
  items.forEach(el => el.classList.remove('is-dimmed'))

  // Hide thumbs
  thumbsBar.classList.remove('is-visible')

  // Resume scroll loop after CSS transition
  setTimeout(() => {
    startSmoothScroll()
    isAnimating = false
  }, 1050)
}

// ─── EVENTS ───────────────────────────────────────────
function bindEvents() {

  // Click item → expand
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (expandedIndex === -1 && !isAnimating) expandItem(i)
    })
  })

  // Wheel — horizontal scroll when strip visible, collapse when expanded
  window.addEventListener('wheel', (e) => {
    if (expandedIndex !== -1) {
      // Any scroll = collapse
      if (Math.abs(e.deltaY) > 10) collapseItem()
      return
    }
    // Drive horizontal
    const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX
    targetX = Math.max(-getMaxScroll(), Math.min(0, targetX - delta * 1.2))
  }, { passive: true })

  // Touch swipe
  let tx = 0, ty = 0
  window.addEventListener('touchstart', e => {
    tx = e.touches[0].clientX
    ty = e.touches[0].clientY
  }, { passive: true })

  window.addEventListener('touchmove', e => {
    if (expandedIndex !== -1) return
    const dx = tx - e.touches[0].clientX
    targetX = Math.max(-getMaxScroll(), Math.min(0, targetX - dx * 1.5))
    tx = e.touches[0].clientX
  }, { passive: true })

  window.addEventListener('touchend', e => {
    if (expandedIndex !== -1) {
      const dy = ty - e.changedTouches[0].clientY
      if (dy < -40) collapseItem()
    }
  }, { passive: true })

  // Thumbnail click → switch expanded image
  thumbEls.forEach((thumb, i) => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation()
      if (expandedIndex === -1) return
      if (i === expandedIndex) return

      // Collapse current, expand new
      items[expandedIndex].classList.remove('is-expanded')
      items[expandedIndex].classList.add('is-dimmed')
      expandedIndex = -1

      setTimeout(() => {
        isAnimating = false
        expandItem(i)
      }, 80)
    })
  })

  // ESC → collapse
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') collapseItem()
  })

  // Arrow keys → scroll strip
  document.addEventListener('keydown', e => {
    if (expandedIndex !== -1) return
    const step = ITEM_W + GAP
    if (e.key === 'ArrowRight') targetX = Math.max(-getMaxScroll(), targetX - step)
    if (e.key === 'ArrowLeft')  targetX = Math.min(0, targetX + step)
  })

  // Resize
  window.addEventListener('resize', () => {
    targetX = Math.max(-getMaxScroll(), targetX)
    stripX  = targetX
    gsap.set(strip, { x: stripX })
  })
}