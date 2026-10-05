import { createFileRoute } from '@tanstack/react-router'
import { SplashScreen } from '../../features/application'

export const Route = createFileRoute('/app/splash')({
  component: SplashScreen,
})
