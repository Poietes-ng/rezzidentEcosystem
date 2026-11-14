import { createFileRoute } from '@tanstack/react-router'
import { CreateAliasPage } from '#/features/alias'

export const Route = createFileRoute('/_authenticated/alias/create')({
  component: CreateAliasPage,
})
