import type { RuneClient } from "rune-games-sdk/multiplayer"

const bigStateObj = Array.from({ length: 10_000_000 }, () => Math.random())

export interface GameState {
  count: number
}

type GameActions = {
  increment: (params: { amount: number }) => void
  set: (params: { amount: number }) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

export function getCount(game: GameState) {
  return game.count
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (): GameState => {
    return { count: bigStateObj[123] }
  },
  actions: {
    increment: ({ amount }, { game }) => {
      // this is bad because incrementing is not idempotent
      // eslint-disable-next-line rune/no-global-scope-mutation
      bigStateObj[123] += amount
      game.count = bigStateObj[123]
    },
    set: ({ amount }, { game }) => {
      // this is fine because the mutation is both deterministic and idempotent
      // eslint-disable-next-line rune/no-global-scope-mutation
      bigStateObj[123] = Math.random() * amount
      game.count = bigStateObj[123]
    },
  },
})
