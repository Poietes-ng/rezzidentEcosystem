import { createFileRoute } from '@tanstack/react-router'
import { AliasDetailsPage } from '#/features/alias'

export const Route = createFileRoute('/_authenticated/alias/$aliasId')({
  component: AliasDetailsPage,
})
