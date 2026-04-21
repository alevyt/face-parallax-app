export async function setupCamera(): Promise<HTMLVideoElement> {
  const video = document.createElement('video')
  video.autoplay = true
  video.muted = true
  video.playsInline = true

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user'
    },
    audio: false
  })

  video.srcObject = stream

  await new Promise<void>((resolve) => {
    video.onloadedmetadata = () => resolve()
  })

  await video.play()

  return video
}