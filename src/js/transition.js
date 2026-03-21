import gsap from 'gsap'

export function initTransitions() {
  // Inject the overlay div
  const overlay = document.createElement('div')
  overlay.id = 'page-transition'
  document.body.appendChild(overlay)

  // Intercept all internal links marked with data-link
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href || href.startsWith('http') || href.startsWith('mailto')) return

    e.preventDefault()
    navigateTo(href)
  })

  // On page load — play the reveal (curtain exits downward)
  window.addEventListener('load', () => {
    gsap.set(overlay, { scaleY: 1, transformOrigin: 'top' })
    gsap.to(overlay, {
      scaleY: 0,
      duration: 0.8,
      ease: 'power4.inOut',
      delay: 0.1,
    })
  })
}

function navigateTo(href) {
  const overlay = document.getElementById('page-transition')

  // Curtain wipes up
  gsap.set(overlay, { scaleY: 0, transformOrigin: 'bottom' })
  gsap.to(overlay, {
    scaleY: 1,
    duration: 0.7,
    ease: 'power4.inOut',
    onComplete() {
      window.location.href = href
    },
  })
}