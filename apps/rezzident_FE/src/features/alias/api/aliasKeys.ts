export const aliasKeys = {
  all: ['aliases'] as const,
  lists: () => [...aliasKeys.all, 'list'] as const,
  list: (fetchAll: boolean = false) => [...aliasKeys.lists(), { fetchAll }] as const,
  details: () => [...aliasKeys.all, 'detail'] as const,
  detail: (id: string) => [...aliasKeys.details(), id] as const,
}
