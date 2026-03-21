export function initNoise() {
  const canvas = document.createElement('canvas')
  canvas.id    = 'noise-canvas'

  Object.assign(canvas.style, {
    position:      'fixed',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    zIndex:        '9998',
    pointerEvents: 'none',
    opacity:       '0.035',
    mixBlendMode:  'screen',
  })

  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  let   w, h, frame

  function resize() {
    w = canvas.width  = window.innerWidth
    h = canvas.height = window.innerHeight
  }

  function render() {
    const imageData = ctx.createImageData(w, h)
    const buffer    = imageData.data

    for (let i = 0; i < buffer.length; i += 4) {
      const v = (Math.random() * 255) | 0
      buffer[i]     = v
      buffer[i + 1] = v
      buffer[i + 2] = v
      buffer[i + 3] = 255
    }

    ctx.putImageData(imageData, 0, 0)
    frame = requestAnimationFrame(render)
  }

  window.addEventListener('resize', resize)
  resize()
  render()
}