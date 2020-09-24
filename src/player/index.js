import React, { useRef, useEffect, useState, useMemo, useContext } from 'react'
import { TILE_WIDTH, X_TILE_NUMBERS, Y_TILE_NUMBERS } from '../constant'
import './player.css'
import { GameContext } from '../context'

// keycode
// top 38, left 37, bottom 40, right 39

export const Player = ({x, y}) => {
  // const playerRef = useRef()
  // const { socket, roomId } = useContext(GameContext)
  // const [currentX, setCurrentX] = useState(initX)
  // const [currentY, setCurrentY] = useState(initY)
  // // const [currentCoord, setCurrentCoord] = useState([0, 0])
  // // const [nextCoord, setNextCoord] = useState([0, 0])
  // const [paths, setPaths] = useState([[initX, initY]])

  // useEffect(() => {
  //   const keydownHandler = (e) => {
  //     if (e.which !== 37 && e.which !== 38 && e.which !== 39 && e.which !== 40) {
  //       return
  //     }
  //     let nextX = currentX
  //     let nextY = currentY
  //     e.preventDefault()
  //     switch (e.which) {
  //       case 37: {
  //         nextX = currentX - 1
  //         break
  //       }
  //       case 38: {
  //         nextY = currentY + 1
  //         break
  //       }
  //       case 39: {
  //         nextX = currentX + 1
  //         break
  //       }
  //       case 40: {
  //         nextY = currentY - 1
  //         break
  //       }
  //       default:
  //     }

  //     console.log('paths', paths)
  //     const isNextCoordInPath = paths.findIndex((path) => {
  //       return path[0] === nextX && path[1] === nextY
  //     }) >= 0

  //     if (isNextCoordInPath) {
  //       alert('You can not undo your moves!')
  //     }

  //     if (
  //       !isNextCoordInPath &&
  //       nextX <= X_TILE_NUMBERS - 1 &&
  //       nextY <= Y_TILE_NUMBERS - 1 &&
  //       nextX >= 0 &&
  //       nextY >= 0
  //     ) {
  //       setPaths(paths.concat([[nextX, nextY]]))
  //       currentX !== nextX && setCurrentX(nextX)
  //       currentY !== nextY && setCurrentY(nextY)
  //       socket.emit('move', {
  //         room: roomId,
  //         op: [nextX, nextY]
  //       })
  //     }
  //   }
  //   window.addEventListener('keydown', keydownHandler)

  //   return () => window.removeEventListener('keydown', keydownHandler)
  // }, [currentX, currentY, paths, roomId, socket])

  const style = useMemo(() => {
    return {
      left: `${ (TILE_WIDTH / 2) + (TILE_WIDTH + 2) * x - 10 }px`,
      bottom: `${ (TILE_WIDTH / 2) + (TILE_WIDTH + 2) * y - 10}px`
    }
  }, [x, y])

  return (
    <div className='player' style={ style }/>
  )
}