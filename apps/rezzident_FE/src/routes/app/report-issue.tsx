import { createFileRoute } from '@tanstack/react-router'
import { ReportAnIssueScreen } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/app/report-issue')({
  component: ReportAnIssueScreen,
})
