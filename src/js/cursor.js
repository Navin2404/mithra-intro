export function initCursor() {
  const dot  = document.getElementById('cursor__dot')
  const ring = document.getElementById('cursor__ring')

  if (!dot || !ring) return

  // Cursor is hidden until first mouse move
  dot.style.opacity  = '0'
  ring.style.opacity = '0'

  let mouse  = { x: 0, y: 0 }
  let ringPos = { x: 0, y: 0 }
  let raf

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY

    // Dot snaps immediately
    dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`

    // Show on first move
    dot.style.opacity  = '1'
    ring.style.opacity = '0.5'

    if (!raf) raf = requestAnimationFrame(loop)
  })

  function loop() {
    // Ring lerps toward cursor — creates the lag
    ringPos.x += (mouse.x - ringPos.x) * 0.12
    ringPos.y += (mouse.y - ringPos.y) * 0.12

    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`

    raf = requestAnimationFrame(loop)
  }

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0'
    ring.style.opacity = '0'
  })

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1'
    ring.style.opacity = '0.5'
  })

  // Click pulse
  document.addEventListener('mousedown', () => {
    dot.style.transform  = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%) scale(0.6)`
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(1.4)`
  })

  document.addEventListener('mouseup', () => {
    dot.style.transform  = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%) scale(1)`
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(1)`
  })
}