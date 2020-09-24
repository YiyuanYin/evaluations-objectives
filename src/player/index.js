import React, { useMemo, useContext } from 'react'
import { TILE_WIDTH } from '../constant'
import { GameContext } from '../context'
import './player.css'

export const Player = ({ x, y, coordNumber }) => {
  const { isFirstPlayer, isSecondPlayer } = useContext(GameContext)
  const isMyMove= (isFirstPlayer && coordNumber === 1) ||
    (isSecondPlayer && coordNumber === 2)
  const style = useMemo(() => {
    return {
      left: `${ (TILE_WIDTH / 2) + (TILE_WIDTH + 2) * x - 10 }px`,
      bottom: `${ (TILE_WIDTH / 2) + (TILE_WIDTH + 2) * y - 10}px`
    }
  }, [x, y])

  return (
    <div className='player' style={ style }>
      { isMyMove ? 'me' : 'opponent' }
    </div>
  )
}