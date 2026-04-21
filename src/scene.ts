import * as THREE from 'three'
import type { FaceState } from './types'

type LayerConfig = {
  texture: THREE.Texture
  width: number
  height: number
  z: number
  transparent?: boolean
}

export class ParallaxScene {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer

  private targetX = 0
  private targetY = 0
  private targetZ = 5

  private currentX = 0
  private currentY = 0
  private currentZ = 5

  constructor(container: HTMLElement, textures: THREE.Texture[]) {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    this.camera.position.z = 5

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    container.appendChild(this.renderer.domElement)

    this.createLights()
    this.createLayers(textures)

    window.addEventListener('resize', this.onResize)
  }

  private createLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 1)
    this.scene.add(ambient)
  }

  private createLayers(textures: THREE.Texture[]) {
    const [backgroundTexture, middleTexture, foregroundTexture] = textures

    const layers: LayerConfig[] = [
      {
        texture: backgroundTexture,
        width: 14,
        height: 8,
        z: -4
      },
      {
        texture: middleTexture,
        width: 10,
        height: 6,
        z: -1,
        transparent: true
      },
      {
        texture: foregroundTexture,
        width: 8,
        height: 5,
        z: 2,
        transparent: true
      }
    ]

    for (const layer of layers) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(layer.width, layer.height),
        new THREE.MeshBasicMaterial({
          map: layer.texture,
          transparent: layer.transparent ?? false
        })
      )

      mesh.position.z = layer.z
      this.scene.add(mesh)
    }
  }

  update(face: FaceState) {
    if (face.detected) {
      this.targetX = face.x * 1.1
      this.targetY = face.y * 0.7

      const normalizedDepth = THREE.MathUtils.clamp((face.z - 0.18) * 8, -0.6, 0.6)
      this.targetZ = 5 - normalizedDepth
    } else {
      this.targetX = 0
      this.targetY = 0
      this.targetZ = 5
    }

    this.currentX += (this.targetX - this.currentX) * 0.08
    this.currentY += (this.targetY - this.currentY) * 0.08
    this.currentZ += (this.targetZ - this.currentZ) * 0.08

    this.camera.position.x = this.currentX
    this.camera.position.y = -this.currentY
    this.camera.position.z = this.currentZ
    this.camera.lookAt(0, 0, 0)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}