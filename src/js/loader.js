import gsap from 'gsap'

export function initLoader(onComplete) {
  const loader      = document.getElementById('loader')
  const bar         = document.getElementById('loader__bar')
  const number      = document.getElementById('loader__number')
  const countWrap   = document.getElementById('loader__count')

  let progress = { val: 0 }

  // Fade in the counter first
  gsap.to(countWrap, {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
  })

  // Count 0 → 100 and drive the bar
  gsap.to(progress, {
    val: 100,
    duration: 2.2,
    ease: 'power3.inOut',
    onUpdate() {
      const v = Math.round(progress.val)
      number.textContent = v
      bar.style.width = v + '%'
    },
    onComplete() {
      playOutro(loader, onComplete)
    },
  })
}

function playOutro(loader, onComplete) {
  const tl = gsap.timeline({
    onComplete,
  })

  // Slide bar to 100%, hold a beat
  tl.to('#loader__bar', {
    width: '100%',
    duration: 0.3,
    ease: 'power2.out',
  })

  // Flash the count out
  .to('#loader__count', {
    opacity: 0,
    y: -20,
    duration: 0.4,
    ease: 'power2.in',
  }, '-=0.1')

  // Wipe the loader up off screen
  .to(loader, {
    yPercent: -100,
    duration: 0.9,
    ease: 'power4.inOut',
  }, '-=0.1')
}