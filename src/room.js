import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { GameContext } from './context'

export function Room () {
  const { socket, roomId, setRoomId } = useContext(GameContext)
  const history = useHistory()
  

  const onChangeRoomId = (event) => {
    const value = event.target.value
    setRoomId(value)
  }

  const onClickJoin = () => {
    if (Number.isInteger(Number(roomId))) {
    socket.emit('join', roomId)
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

// export class Room extends React.Component {
//   constructor (props) {
//     super()
//     this.socket = ioClient('http://192.168.1.9:3000')
//     this.state = {
//       roomId: null
//     }
//   }

//   componentDidMount () {
//     this.socket.on('connect', () => {
//       this.socket.on('opponent move', (message) => {
//         const { coord }= message
//       })

//       this.socket.on('joined', () => {
//         console.log('joined successfully')
//       })
//     })
//   }

//   onChangeRoomId 

//   onClickJoin = () => {
    
//   }

//   render () {

//   }
// }