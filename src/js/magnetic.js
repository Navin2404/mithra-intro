export function initMagnetic() {
  // Apply to project titles and nav links
  const targets = document.querySelectorAll(
    '.project__title, .nav__logo, .nav__link, .next-project__title'
  )

  targets.forEach((el) => {
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
  })

  function onMove(e) {
    const el   = e.currentTarget
    const rect = el.getBoundingClientRect()

    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2

    const dx = (e.clientX - cx) * 0.28
    const dy = (e.clientY - cy) * 0.28

    el.style.transition = 'transform 0.15s ease'
    el.style.transform  = `translate(${dx}px, ${dy}px)`
  }

  function onLeave(e) {
    const el = e.currentTarget
    el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.transform  = 'translate(0px, 0px)'
  }
}