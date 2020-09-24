import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'
import { Status } from './status';
import { Board } from './board'
import { GameContext } from './context';

export function Game () {
  const { socket, setRoomId, joinedIds } = useContext(GameContext)
  const { id } = useParams()
  useEffect(() => {
    if (socket) {
      console.log('a')
      socket.emit('join', id)
      setRoomId(id)
    }
  }, [socket, id, setRoomId])

  if (!socket) {
    return null
  }

  if (joinedIds.length < 2) {
    return (
      <div>
        Please wait for another player...
      </div>
    )
  }
  return (
    <div className='game-wrapper'>
      <Status score1={0} score2={0} round={1} />
      { joinedIds.length >= 2 && <Board /> }
    </div>
  )
}