import gsap from 'gsap'

export function initLoader(onComplete) {
  const loader    = document.getElementById('loader')
  const number    = document.getElementById('loader__number')
  const countWrap = document.getElementById('loader__count')
  const bar       = document.getElementById('loader__bar')

  let progress = { val: 0 }

  gsap.to(countWrap, { opacity: 1, duration: 0.3 })

  gsap.to(progress, {
    val: 100,
    duration: 2.0,
    ease: 'power2.inOut',
    onUpdate() {
      number.textContent = Math.round(progress.val)
      bar.style.width    = progress.val + '%'
    },
    onComplete() {
      gsap.to(countWrap, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete() {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete() {
              loader.style.display = 'none'
              onComplete()
            }
          })
        }
      })
    }
  })
}