import React, { useState, useEffect, createContext, useMemo, useCallback } from "react"
import { X_TILE_NUMBERS, Y_TILE_NUMBERS } from './constant'
import isEqual from 'lodash/isEqual'
import findLast from 'lodash/findLast'
import ioClient from 'socket.io-client'

export const GameContext = createContext({
  socket: null,
  roomId: '',
  setRoomId: () => null,
  coord1: null,
  coord2: null,
  // setCoord2: () => null,
  isFirstPlayer: false,
  isSecondPlayer: false,
  joinedIds: [],
})

export const GameContextProvider = (props) => {
  const [socket, setSocket] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [joinedIds, setJoinedIds] = useState([])
  // const [paths, setPaths] = useState([])
  const [coordArr, setCoordArr] = useState([])
  // const [winnerIds, setWinnerIds] = useState([])
  const [shouldReset, setShouldReset] = useState(true)

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

  const initCoord = useCallback(() => {
    if (!roomId || !socket) return
    let coord = []
    if (isFirstPlayer) {
      coord = [0, 0]
    } else if (isSecondPlayer) {
      coord = [X_TILE_NUMBERS - 1, Y_TILE_NUMBERS - 1]
    }
    socket.emit('move', {
      roomId: roomId,
      coord,
      id: socket.id,
    })
  }, [isFirstPlayer, isSecondPlayer, socket, roomId])

  const reset = useCallback(() => {
    setCoordArr([])
  }, [])

  // init socket
  useEffect(() => {
    const socket = ioClient('http://localhost:3001')
    socket.on('connect', () => {
      setSocket(socket)
    })
    return () => socket.disconnect()
  }, [])

  useEffect(() => {
    if (!socket) return
    console.log(shouldReset)
    if (joinedIds.length === 2 && shouldReset) {
      console.log('init')
      initCoord()
    }
  }, [
    joinedIds,
    initCoord,
    socket,
    shouldReset,
  ])

  // handle keyboard event
  // top 38, left 37, bottom 40, right 39
  useEffect(() => {
    const keydownHandler = (e) => {
      if (
        e.which !== 37 &&
        e.which !== 38 &&
        e.which !== 39 &&
        e.which !== 40 
      ) {
        return
      }

      if (
        (isFirstPlayer && coordArr.length % 2 === 0) ||
        (isSecondPlayer && coordArr.length % 2 === 1)
      ) {
        const myCoord = findLast(coordArr, (coordMsg) => {
          return coordMsg.id === socket.id
        }).coord
        e.preventDefault()
        const currentX = myCoord[0]
        const currentY = myCoord[1]
        let nextX = myCoord[0]
        let nextY = myCoord[1]
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
  
        const isNextCoordInPath = coordArr.findIndex((coordMsg) => {
          return (
            socket.id === coordMsg.id &&
            isEqual([nextX, nextY], coordMsg.coord)
          ) 
        }) >= 0
  
        if (isNextCoordInPath) {
          console.log('You can not undo your moves!')
        }
  
        if (
          !isNextCoordInPath &&
          nextX <= X_TILE_NUMBERS - 1 &&
          nextY <= Y_TILE_NUMBERS - 1 &&
          nextX >= 0 &&
          nextY >= 0
        ) {
        !shouldReset && socket.emit('move', {
          id: socket.id,
          roomId: roomId,
          coord: [nextX, nextY],
        })
        }
      }
    }
    window.addEventListener('keydown', keydownHandler)

    return () => window.removeEventListener('keydown', keydownHandler)
  }, [roomId, socket, isSecondPlayer, isFirstPlayer, coordArr, shouldReset])

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
    socket.once('move', (msg) => {
      const { coord, id } = msg
      setShouldReset(false)
      console.log('coordArr',coordArr)
      console.log('move', msg, socket.id)
      if (coordArr.findIndex((coordMsg) => {
          return (
            msg.id === coordMsg.id &&
            isEqual(msg.coord, coordMsg.coord)
          ) 
        }) === -1) {
          setCoordArr([...coordArr, msg])
        }

        if (
          coordArr.length > 2 &&
          isEqual(coord, coordArr[coordArr.length - 1].coord)
        ) {
          console.log('winner', { id, roomId })
          socket.emit('winner', { id, roomId })
        }
      }
    )
  }, [socket, coordArr, roomId])

  useEffect(() => {
    if (!socket) return
    socket.once('winner', (id) => {
      console.log('receive winner')
      setShouldReset(true)
      setCoordArr([])
      if (socket.id === id) {
        alert('You win this round')
      } else {
        alert('Your opponent win this round')
      }
      // setWinnerIds([...winnerIds, id])
    })
  }, [socket, reset])

  const coord1 = useMemo(() => {
    if (!coordArr.length) return null
    const firstMsg = findLast(coordArr, (coordMsg) => {
      return coordMsg.id === joinedIds[0]
    })

    return firstMsg ? firstMsg.coord : null
  }, [coordArr, joinedIds])

  const coord2 = useMemo(() => {
    if (!coordArr.length) return null
    const secondMsg = findLast(coordArr, (coordMsg) => {
      return coordMsg.id === joinedIds[1]
    })

    return secondMsg ? secondMsg.coord : null
  }, [coordArr, joinedIds])

  const value = {
    // resetGame,
    // round,
    socket,
    roomId,
    setRoomId,
    coord1,
    coord2,
    // setCoord2,
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