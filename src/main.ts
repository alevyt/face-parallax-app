import './style.css'
import { setupCamera } from './camera'

async function bootstrap() {
  const app = document.querySelector<HTMLDivElement>('#app')

  if (!app) {
    throw new Error('App root not found')
  }

  const title = document.createElement('h1')
  title.textContent = 'Face Parallax App'

  const status = document.createElement('p')
  status.textContent = 'Requesting camera access...'

  app.append(title, status)

  try {
    const video = await setupCamera()
    video.style.width = '100%'
    video.style.maxWidth = '480px'
    video.style.borderRadius = '12px'

    status.textContent = 'Camera is active'
    app.append(video)
  } catch (error) {
    status.textContent = 'Failed to access camera'
    console.error(error)
  }
}

bootstrap()