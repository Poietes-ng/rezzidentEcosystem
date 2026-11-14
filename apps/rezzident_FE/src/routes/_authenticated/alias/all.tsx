import { createFileRoute } from '@tanstack/react-router'
import { AliasViewAllPage } from '#/features/alias'

export const Route = createFileRoute('/_authenticated/alias/all')({
  component: AliasViewAllPage,
})
