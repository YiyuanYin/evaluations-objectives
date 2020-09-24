import React, { useRef, useEffect, useState, useMemo } from 'react'
import { TILE_WIDTH, X_TILE_NUMBERS, Y_TILE_NUMBERS } from '../constant'
import './player.css'

// keycode
// top 38, left 37, bottom 40, right 39

export const Player = () => {
  const playerRef = useRef()
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  // const [currentCoord, setCurrentCoord] = useState([0, 0])
  // const [nextCoord, setNextCoord] = useState([0, 0])
  const [paths, setPaths] = useState([[0, 0]])

  useEffect(() => {
    const keydownHandler = (e) => {
      if (e.which !== 37 && e.which !== 38 && e.which !== 39 && e.which !== 40) {
        return
      }
      let nextX = currentX
      let nextY = currentY
      e.preventDefault()
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

      if (isNextCoordInPath) {
        alert('You can not undo your moves')
      }

      if (
        !isNextCoordInPath &&
        nextX <= X_TILE_NUMBERS - 1 &&
        nextY <= Y_TILE_NUMBERS - 1 &&
        nextX >= 0 &&
        nextY >= 0
      ) {
        setPaths(paths.concat([[nextX, nextY]]))
        currentX !== nextX && setCurrentX(nextX)
        currentY !== nextY && setCurrentY(nextY)
      }
    }
    window.addEventListener('keydown', keydownHandler)

    return () => window.removeEventListener('keydown', keydownHandler)
  }, [currentX, currentY, paths])

  const style = useMemo(() => {
    return {
      left: `${ (TILE_WIDTH / 2) + (TILE_WIDTH + 2) * currentX - 10 }px`,
      bottom: `${ (TILE_WIDTH / 2) + (TILE_WIDTH + 2) * currentY - 10}px`
    }
  }, [currentX, currentY])

  return (
    <div className='player' ref={ playerRef } style={ style }/>
  )
}