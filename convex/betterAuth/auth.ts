import { createAuth } from '../auth'
import { getStaticAuth } from '@convex-dev/better-auth'

export const auth = getStaticAuth(createAuth)
