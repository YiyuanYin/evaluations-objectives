import React, { useState, useEffect, createContext, useMemo } from "react"
import { X_TILE_NUMBERS, Y_TILE_NUMBERS, TILE_WIDTH, LINE_WIDTH } from './constant'
import ioClient from 'socket.io-client'
import { usePrevious } from "./hooks/usePrevious"

export const GameContext = createContext({
  socket: null,
  roomId: '',
  setRoomId: () => null,
  coord1: null,
  coord2: null,
  setCoord2: () => null,
  isFirstPlayer: false,
  isSecondPlayer: false,
  joinedIds: [],
})

export const GameContextProvider = (props) => {
  const [socket, setSocket] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [joinedIds, setJoinedIds] = useState([])
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [paths, setPaths] = useState([[0, 0]])
  // my coordinate
  const [coord1, setCoord1] = useState(null)
  // opponent's coordinate
  const [coord2, setCoord2] = useState(null)

  const isFirstPlayer = useMemo(() => {
    if (joinedIds.length >= 2 && socket) {
      return joinedIds[0] === socket.id
    }
    return false
  }, [joinedIds, socket])

  const isSecondPlayer = useMemo(() => {
    if (joinedIds.length >= 2 && socket) {
      return joinedIds[1] === socket.id
    }
    return false
  }, [joinedIds, socket])

  // init socket
  useEffect(() => {
    const socket = ioClient('http://192.168.1.9:3000')
    socket.on('connect', () => {
      setSocket(socket)
    })
    return () => socket.disconnect()
  }, [])

  // when both joined, emit my coord
  useEffect(() => {
    if (socket && roomId && joinedIds.length === 2) {
      let coord = [currentX, currentY]
      // if there's no coord, init it
      if (!coord1 || !coord2) {
        if (isFirstPlayer) {
          coord = [0, 0]
        } else if (isSecondPlayer) {
          coord = [X_TILE_NUMBERS - 1, Y_TILE_NUMBERS - 1]
        }
      }
      socket.emit('move', {
        roomId: roomId,
        coord,
        id: socket.id,
      })
    }
  }, [
    socket,
    roomId,
    isFirstPlayer,
    isSecondPlayer,
    joinedIds,
    currentY,
    currentX,
    coord1,
    coord2,
  ])

  // handle keyboard event
  // top 38, left 37, bottom 40, right 39
  useEffect(() => {
    const keydownHandler = (e) => {
      if (e.which !== 37 && e.which !== 38 && e.which !== 39 && e.which !== 40) {
        return
      }
      console.log(currentY)
      console.log(currentX)

      e.preventDefault()
      let nextX = currentX
      let nextY = currentY
      switch (e.which) {
        case 37: {
          nextX = currentX - 1
          break
        }
        case 38: {
          nextY = currentY + 1
          break
        }
        case 39: {
          nextX = currentX + 1
          break
        }
        case 40: {
          nextY = currentY - 1
          break
        }
        default:
      }

      console.log('paths', paths)
      const isNextCoordInPath = paths.findIndex((path) => {
        return path[0] === nextX && path[1] === nextY
      }) >= 0

      console.log(isNextCoordInPath)

      if (isNextCoordInPath) {
        alert('You can not undo your moves!')
      }

      if (
        !isNextCoordInPath &&
        nextX <= X_TILE_NUMBERS - 1 &&
        nextY <= Y_TILE_NUMBERS - 1 &&
        nextX >= 0 &&
        nextY >= 0
      ) {
        console.log(paths.concat([[nextX, nextY]]))
        setPaths(paths.concat([[nextX, nextY]]))
        currentX !== nextX && setCurrentX(nextX)
        currentY !== nextY && setCurrentY(nextY)
      }
    }
    window.addEventListener('keydown', keydownHandler)

    return () => window.removeEventListener('keydown', keydownHandler)
  }, [currentX, currentY, paths, roomId, socket])

  // register socket event
  useEffect(() => {
    if (!socket) return
      socket.on('rooms', (msg) => {
        console.log(msg)
        console.log('my', socket.id)
      })

      socket.on('joined', (msg) => {
        setJoinedIds(msg)
        console.log('joined', msg)
      })
  }, [socket])

  useEffect(() => {
    if (!socket) return
    console.log('joinid changes')
    socket.on('move', (msg) => {
      const { coord, id } = msg
      console.log('move', msg)
      if (id === socket.id) {
        setCurrentX(coord[0])
        setCurrentY(coord[1])
      }
      if (id === joinedIds[0]) {
        setCoord1(coord)
      } else if (id === joinedIds[1]) {
        console.log('set 2', coord)
        setCoord2(coord)
      }
    })
  }, [socket, joinedIds])
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
    coord1,
    coord2,
    setCoord2,
    isFirstPlayer,
    isSecondPlayer,
    joinedIds,
  }

  return (
    <GameContext.Provider value={value}>
      { props.children }
    </GameContext.Provider>
  )
}