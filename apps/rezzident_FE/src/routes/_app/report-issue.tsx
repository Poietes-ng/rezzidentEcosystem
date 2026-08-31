import { createFileRoute } from '@tanstack/react-router'
import { ReportAnIssueScreen } from '#/features/auth'

export const Route = createFileRoute('/_app/report-issue')({
  component: ReportAnIssueScreen,
})
