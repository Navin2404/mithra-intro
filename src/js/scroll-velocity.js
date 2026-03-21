import gsap from 'gsap'

export function initScrollVelocity(lenis) {
  let lastScrollY  = window.scrollY
  let velocity     = 0
  let currentSkew  = 0
  const maxSkew    = 6 // degrees
  const smoothing  = 0.08

  const skewTargets = document.querySelectorAll(
    '.project, .hero__line, .hero__sub'
  )

  function tick() {
    const scrollY = window.scrollY
    const delta   = scrollY - lastScrollY
    lastScrollY   = scrollY

    velocity     = delta
    const target = Math.max(-maxSkew, Math.min(maxSkew, velocity * 0.12))
    currentSkew += (target - currentSkew) * smoothing

    skewTargets.forEach((el) => {
      el.style.transform = `skewY(${currentSkew}deg)`
    })

    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}