import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initParallax() {

  // ─── PROJECT IMAGE PARALLAX ────────────────────────
  // Images scroll slower than the page — creates depth
  document.querySelectorAll('.project__media').forEach((media) => {
    const img = media.querySelector('img')
    if (!img) return

    gsap.fromTo(img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: media,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      }
    )
  })

  // ─── HERO TITLE PARALLAX ──────────────────────────
  // Hero lines drift upward as you scroll away
  document.querySelectorAll('.hero__line').forEach((line, i) => {
    gsap.to(line, {
      yPercent: -15 - i * 5,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
  })

  // ─── HERO SUBTITLE FADE ───────────────────────────
  gsap.to('.hero__sub', {
    opacity: 0,
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '40% top',
      scrub: 1,
    },
  })

  // ─── PROJECT INFO STAGGER ─────────────────────────
  // Info column slides in from the right as the card enters
  document.querySelectorAll('.project__info').forEach((info) => {
    gsap.fromTo(info,
      { x: 30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: info,
          start: 'top 80%',
          once: true,
        },
      }
    )
  })
}