import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader   from '../glsl/vertex.glsl'
import fragmentShader from '../glsl/fragment.glsl'

export function initWebGL() {
  const canvas   = document.getElementById('webgl-canvas')
  const projects = document.querySelectorAll('.project')
  if (!canvas || !projects.length) return

  // ─── RENDERER ───────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)

  // ─── SCENE / CAMERA ─────────────────────────────────
  const scene  = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(
    window.innerWidth  / -2,
    window.innerWidth  /  2,
    window.innerHeight /  2,
    window.innerHeight / -2,
    0.1,
    1000
  )
  camera.position.z = 1

  // ─── TEXTURE LOADER ─────────────────────────────────
  const loader   = new THREE.TextureLoader()
  const meshes   = []
  let   activeIndex = -1
  const mouse    = new THREE.Vector2(0.5, 0.5)
  const clock    = new THREE.Clock()

  // Build one mesh per project
  projects.forEach((el, i) => {
    const img = el.querySelector('img')
    if (!img) return

    const texture = loader.load(img.src)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format    = THREE.RGBAFormat

    const geo = new THREE.PlaneGeometry(1, 1)
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture:    { value: texture },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uImageSize:  { value: new THREE.Vector2(1600, 900) },
        uHover:      { value: 0 },
        uTime:       { value: 0 },
        uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
      },
      transparent: true,
    })

    const mesh = new THREE.Mesh(geo, mat)
    mesh.visible = false
    scene.add(mesh)
    meshes.push({ mesh, mat, el, index: i })

    // ─── HOVER EVENTS ──────────────────────────────
    el.addEventListener('mouseenter', () => {
      activeIndex = i
      canvas.classList.add('is-visible')
      updateMeshBounds(meshes[i])
      mesh.visible = true

      gsap.to(mat.uniforms.uHover, {
        value: 1,
        duration: 0.9,
        ease: 'power3.out',
      })
    })

    el.addEventListener('mouseleave', () => {
      activeIndex = -1

      gsap.to(mat.uniforms.uHover, {
        value: 0,
        duration: 0.6,
        ease: 'power3.out',
        onComplete() {
          mesh.visible = false
          // Hide canvas if no project is hovered
          const anyActive = meshes.some(m => m.mesh.visible)
          if (!anyActive) canvas.classList.remove('is-visible')
        },
      })
    })

    // Mouse position within the card
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect()
      mat.uniforms.uMouse.value.set(
        (e.clientX - rect.left)  / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      )
    })
  })

  // ─── FIT MESH TO DOM ELEMENT ──────────────────────
  function updateMeshBounds({ mesh, mat, el }) {
    const rect = el.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    const x = rect.left + w / 2 - window.innerWidth  / 2
    const y = -(rect.top  + h / 2 - window.innerHeight / 2)

    mesh.position.set(x, y, 0)
    mesh.scale.set(w, h, 1)

    mat.uniforms.uResolution.value.set(w, h)
  }

  // ─── SCROLL: keep mesh pinned to card ─────────────
  function updateAllVisible() {
    meshes.forEach((item) => {
      if (item.mesh.visible) updateMeshBounds(item)
    })
  }

  window.addEventListener('scroll', updateAllVisible, { passive: true })

  // ─── RESIZE ───────────────────────────────────────
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.left   = window.innerWidth  / -2
    camera.right  = window.innerWidth  /  2
    camera.top    = window.innerHeight /  2
    camera.bottom = window.innerHeight / -2
    camera.updateProjectionMatrix()
    updateAllVisible()
  })

  // ─── RENDER LOOP ──────────────────────────────────
  function tick() {
    const elapsed = clock.getElapsedTime()

    meshes.forEach(({ mesh, mat }) => {
      if (!mesh.visible) return
      mat.uniforms.uTime.value = elapsed
    })

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }

  tick()
}