export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = getRouterParam(event, 'path')
  const query = getQuery(event)

  const params = new URLSearchParams({
    api_key: config.tmdbApiKey as string,
    ...Object.fromEntries(Object.entries(query).map(([k, v]) => [k, String(v)])),
  })

  return $fetch(`https://api.themoviedb.org/3/${path}?${params}`, {
    headers: { Accept: 'application/json' },
  })
})
