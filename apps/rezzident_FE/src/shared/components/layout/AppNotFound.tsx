import { ErrorStateComponent } from '../ui/ErrorStateComponent'

export function AppNotFound() {
  return (
    <ErrorStateComponent
      statusCode="404"
      title="Page Not Found"
      description="The screen you're looking for doesn't exist."
      icon="search_off"
      actionText="Go to Welcome"
      actionLink="/app/welcome"
    />
  )
}
