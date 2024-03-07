import { createContext, useContext } from 'react'

import type LookRouter from '../state'
import type { LookStackPage } from '../types'

export interface RouterViewCtxState {
  router: LookRouter
}

export const RouterViewCtx = createContext<RouterViewCtxState | null>(null)

if (__DEV__) {
  RouterViewCtx.displayName = 'RouterViewCtx'
}

export function useRouterCtx(hookName: string) {
  const ctx = useContext(RouterViewCtx)
  if (ctx === null) {
    throw TypeError(`Cannot use ${hookName} outside <RouterView /> scope`)
  }
  return ctx
}

export interface LookPageCtxState {
  instance: LookStackPage
}

export const LookPageCtx = createContext<LookPageCtxState | null>(null)

if (__DEV__) {
  LookPageCtx.displayName = 'LookPageCtx'
}

export function useLookPageCtx(hookName: string) {
  const ctx = useContext(LookPageCtx)
  if (ctx === null) {
    throw TypeError(`Cannot use ${hookName} outside <LookPage /> scope`)
  }
  return ctx
}

export const OutletContext = createContext<LookStackPage[] | null>(null)

if (__DEV__) {
  OutletContext.displayName = 'OutletContext'
}

export function useOutletCtx() {
  const ctx = useContext(OutletContext)
  return ctx
}

export const LookPageVisible = createContext<boolean | null>(null)

if (__DEV__) {
  LookPageVisible.displayName = 'LookPageVisible'
}

export function useLookPageVisible() {
  const ctx = useContext(LookPageVisible)
  if (ctx === null) {
    throw TypeError(`Cannot use useLookPageVisible outside <RouterView /> scope`)
  }
  return ctx
}
