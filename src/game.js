import React from 'react';
import { Status } from './status';
import { Board } from './board'

export function Game () {
  return (
    <div className='game-wrapper'>
      <Status score1={0} score2={0} round={1} />
      <Board />
    </div>
  )
}