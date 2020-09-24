import React from 'react';
import './App.css';
import ioClient from 'socket.io-client'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import { Room } from './room'
import { Game } from './game'
import { GameContextProvider } from './context';

class App extends React.Component {
  // constructor() {
  //   super()
  //   this.socket = ioClient('http://192.168.1.9:3000')
  // }

  // componentDidMount () {

  // }

  // renderRoom () {
  //   return <Room socket={this.socket} />
  // }

  render () {
    return (
      <Router>
        <div className="App">
          <GameContextProvider>
            <Switch>
              <Route path='/' component={ Room } exact/>
              <Route path='/:id' component={ Game } />
            </Switch>  
          </GameContextProvider>
        </div>
      </Router>
    );
  }
}

export default App;
