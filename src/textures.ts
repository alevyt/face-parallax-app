import * as THREE from 'three'
import backgroundUrl from './assets/background.png'
import midgroundUrl from './assets/midground.png'
import foregroundUrl from './assets/foreground.png'

function createBackgroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to create background texture')
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#08111f')
  gradient.addColorStop(0.5, '#13233f')
  gradient.addColorStop(1, '#1c355e')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < 160; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = Math.random() * 2 + 1

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createMiddleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to create middle texture')
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < 9; i++) {
    const baseX = 80 + i * 110
    const width = 80 + Math.random() * 60
    const height = 220 + Math.random() * 240
    const y = canvas.height - height - 80

    ctx.fillStyle = `rgba(20, 30, 50, ${0.65 + Math.random() * 0.25})`
    ctx.fillRect(baseX, y, width, height)

    ctx.fillStyle = 'rgba(255, 220, 120, 0.18)'
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.fillRect(baseX + 10 + col * 20, y + 15 + row * 28, 10, 14)
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createForegroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to create foreground texture')
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'rgba(18, 18, 28, 0.95)'
  ctx.fillRect(0, 760, canvas.width, 264)

  for (let i = 0; i < 7; i++) {
    const x = 70 + i * 140
    const trunkWidth = 18 + Math.random() * 10
    const trunkHeight = 180 + Math.random() * 100

    ctx.fillStyle = 'rgba(35, 24, 18, 0.95)'
    ctx.fillRect(x, 760 - trunkHeight, trunkWidth, trunkHeight)

    ctx.beginPath()
    ctx.arc(x + trunkWidth / 2, 760 - trunkHeight, 55 + Math.random() * 18, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(25, 45, 30, 0.95)'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(x + trunkWidth / 2 - 25, 760 - trunkHeight + 15, 42 + Math.random() * 16, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(x + trunkWidth / 2 + 28, 760 - trunkHeight + 18, 38 + Math.random() * 14, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export async function loadImageTextures(): Promise<THREE.Texture[]> {
  const loader = new THREE.TextureLoader()

  const loadTexture = (url: string) =>
    new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace
          resolve(texture)
        },
        undefined,
        reject
      )
    })

  return Promise.all([
    loadTexture(backgroundUrl),
    loadTexture(midgroundUrl),
    loadTexture(foregroundUrl)
  ])
}

export function createFallbackTextures(): THREE.Texture[] {
  return [
    createBackgroundTexture(),
    createMiddleTexture(),
    createForegroundTexture()
  ]
}