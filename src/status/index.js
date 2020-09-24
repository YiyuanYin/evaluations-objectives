import React from 'react'

export function Status ({score1, score2, round}) {
  return (
    <div className='status-wrapper'>
      <div className='round'>{ `ROUND ${ round }`}</div>
      <div className='scores'>{ `${ score1 } : ${ score2 }`}</div>
      { round === 5 && (
       <div className='reset-button'>RESET</div> 
      )}
    </div>
  )
}