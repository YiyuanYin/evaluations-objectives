import React, { useEffect, useRef, useState, useContext } from 'react'
import { X_TILE_NUMBERS, Y_TILE_NUMBERS, TILE_WIDTH, LINE_WIDTH } from '../constant'
import { Player } from '../player'
import { GameContext } from '../context'
import './board.css'


export const Board = () => {
  const boardRef = useRef(null)
  const { socket, roomId, coord2 } = useContext(GameContext)
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [paths, setPaths] = useState([[0, 0]])
  const width = X_TILE_NUMBERS * TILE_WIDTH + (X_TILE_NUMBERS - 1) * LINE_WIDTH
  const height = Y_TILE_NUMBERS * TILE_WIDTH + (Y_TILE_NUMBERS - 1) * LINE_WIDTH
  useEffect(() => {
    if (boardRef && boardRef.current)  {
      for (let x = 1; x <= Y_TILE_NUMBERS; x++) {
        const lineX = document.createElement('div')
        lineX.className = 'grid-line-x'
        lineX.style.top = `${ x * TILE_WIDTH + (x - 1) * 2}px`
        boardRef.current.appendChild(lineX)
      }

      for (let y = 1; y <= X_TILE_NUMBERS; y++) {
        const lineY = document.createElement('div')
        lineY.className = 'grid-line-y'
        lineY.style.left = `${ y * TILE_WIDTH + (y - 1) * 2}px`
        boardRef.current.appendChild(lineY)
      }
    }
  }, [])

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
        alert('You can not undo your moves!')
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
        socket.emit('move', {
          room: roomId,
          op: [nextX, nextY]
        })
      }
    }
    window.addEventListener('keydown', keydownHandler)

    return () => window.removeEventListener('keydown', keydownHandler)
  }, [currentX, currentY, paths, roomId, socket])

  const style = {
    width, height
  }

  return (
    <div className='board' ref={ boardRef } style={ style }>
      <Player x={currentX} y={currentY}/>
      <Player x={coord2[0]} y={coord2[1]} />
    </div>
  )
}