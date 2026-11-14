import { createFileRoute } from '@tanstack/react-router'
import { AliasListPage } from '#/features/alias'

export const Route = createFileRoute('/_authenticated/alias/')({
  component: AliasListPage,
})
