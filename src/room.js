import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { GameContext } from './context'

export function Room () {
  const { roomId, setRoomId } = useContext(GameContext)
  const history = useHistory()
  

  const onChangeRoomId = (event) => {
    const value = event.target.value
    setRoomId(value)
  }

  const onClickJoin = () => {
    if (Number.isInteger(Number(roomId))) {
    history.replace(`${roomId}`)
    } else {
      alert('Please input an integer')
    }
  }

  return (
    <div>
      <input type='text' value={ roomId } onChange={ onChangeRoomId } />
      <div className='button' onClick={ onClickJoin }>JOIN</div>
    </div>
  )
}