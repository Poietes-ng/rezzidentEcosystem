import { createFileRoute } from '@tanstack/react-router'

function ProfileComponent() {
  return <div>Profile</div>
}

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfileComponent,
})
