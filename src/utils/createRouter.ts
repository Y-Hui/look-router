import type { LookRouterArgs } from '../state'
import LookRouter from '../state'

export type CreateRouterArgs = LookRouterArgs

export function createRouter(args: CreateRouterArgs): LookRouter {
  return new LookRouter(args)
}
