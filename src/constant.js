export const TILE_WIDTH = 100

const MARGIN = 20

export const LINE_WIDTH = 2

export const X_TILE_NUMBERS = Math.floor(((window.innerWidth - 2 * MARGIN) + LINE_WIDTH) / (TILE_WIDTH + 2))
export const Y_TILE_NUMBERS = Math.floor(((0.8 * window.innerHeight - 2 * MARGIN) + LINE_WIDTH) / (TILE_WIDTH + 2))
