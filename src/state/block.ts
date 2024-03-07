import type { Blocker, BlockerArgs } from '../types'

export function createBlock() {
  const blockerFunctions = new Set<Blocker>()

  let block = false

  return {
    get isBlock() {
      return block
    },
    block(blocker: Blocker) {
      blockerFunctions.add(blocker)
      block = true
      return () => {
        blockerFunctions.delete(blocker)
        block = blockerFunctions.size > 0
      }
    },
    shouldBlock(args: BlockerArgs) {
      if (!block) return false
      const result = blockerFunctions.size > 0
      blockerFunctions.forEach((fn) => {
        fn({
          proceed() {
            block = false
            args.proceed()
          },
          to: args.to,
          from: args.from,
        })
      })
      return result
    },
  }
}
