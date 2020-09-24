import React, { useState, useEffect, createContext } from "react"
import ioClient from 'socket.io-client'
import { usePrevious } from "./hooks/usePrevious"

export const GameContext = createContext({
  socket: null,
  roomId: '',
  setRoomId: () => null,
  coord2: [],
  setCoord2: () => null
})

export const GameContextProvider = (props) => {
  const [socket, setSocket] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [joinedTimes, setJoinedTimes] = useState(0)
  const prevJoinedTimes = usePrevious(joinedTimes)
  // const [coord1, setCoord1] = useState([])
  const [coord2, setCoord2] = useState([])

  useEffect(() => {
    setSocket(ioClient('http://192.168.1.9:3000'))
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('connect', () => {
      socket.on('opponent move', (message) => {
        const { coord }= message
      })

      socket.on('rooms', (msg) => {
        console.log(msg)
        console.log('my', socket.id)
      })

      socket.on('joined', () => {
        setJoinedTimes(prevJoinedTimes + 1)
        socket.emit('getRooms')
      })

      socket.on('component move', (msg) => {
        const { coord2 } = msg
        setCoord2(coord2)
      })
    })
  }, [socket])
  // const [round, setRound] = useState(0)

  // const resetGame = () => {
  //   setRound(0)
  // }

  const value = {
    // resetGame,
    // round,
    socket,
    roomId,
    setRoomId,
    coord2,
    setCoord2
  }

  return (
    <GameContext.Provider value={value}>
      { props.children }
    </GameContext.Provider>
  )
}