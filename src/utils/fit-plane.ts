import * as THREE from 'three'

export function fitPlaneToView(
  mesh: THREE.Mesh,
  camera: THREE.PerspectiveCamera,
  distance: number,
  texture: THREE.Texture
) {
  const vFov = (camera.fov * Math.PI) / 180

  const viewHeight = 2 * Math.tan(vFov / 2) * distance
  const viewWidth = viewHeight * camera.aspect

  const imageAspect = texture.image.width / texture.image.height
  const viewAspect = viewWidth / viewHeight

  let width: number
  let height: number

  if (imageAspect > viewAspect) {
    height = viewHeight
    width = height * imageAspect
  } else {
    width = viewWidth
    height = width / imageAspect
  }

  mesh.scale.set(width, height, 1)
}