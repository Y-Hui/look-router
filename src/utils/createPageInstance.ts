import type { PageInstance, Part } from '../types'
import { PageInstanceType } from '../types'
import { globalKey } from './globalKey'

type CreatePageInstanceArgs = Part<
  Omit<PageInstance, 'key'>,
  'visible' | 'type' | 'reference'
>
export function createPageInstance(instance: CreatePageInstanceArgs): PageInstance {
  return {
    ...instance,
    visible: instance.visible || false,
    key: globalKey.new(),
    type: instance.type === undefined ? PageInstanceType.Route : instance.type,
    reference: 1,
  }
}
