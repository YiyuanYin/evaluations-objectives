import React from 'react';
import { Board } from './board'
import './App.css';

function App() {
  return (
    <div className="App">
      <div className='status'>You win</div>
      <Board />
    </div>
  );
}

export default App;
