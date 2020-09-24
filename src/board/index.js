import React, { useEffect, useRef } from 'react'
import { X_TILE_NUMBERS, Y_TILE_NUMBERS, TILE_WIDTH } from '../constant'
import './board.css'


export const Board = () => {
  const boardRef = useRef(null)
  useEffect(() => {
    if (boardRef && boardRef.current)  {
      console.log(X_TILE_NUMBERS)
      console.log(Y_TILE_NUMBERS)
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

  return (
    <div className='board' ref={ boardRef }>
    </div>
  )
}