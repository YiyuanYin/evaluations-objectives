import React from 'react'

export function Status ({score1, score2, round}) {
  return (
    <div className='status-wrapper'>
      <div className='scores'>{ `${ score1 } : ${ score2 }`}</div>
    </div>
  )
}