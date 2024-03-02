import type { PageInstance, Part } from '../types'
import { globalKey } from './globalKey'

type CreatePageInstanceArgs = Part<Omit<PageInstance, 'key'>, 'visible'>
export function createPageInstance(instance: CreatePageInstanceArgs): PageInstance {
  return {
    ...instance,
    visible: instance.visible || false,
    key: globalKey.new(),
  }
}
