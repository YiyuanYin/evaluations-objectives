# Overview

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8ea5e911-927a-4bf5-8879-2ba3e3249798/overview.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8ea5e911-927a-4bf5-8879-2ba3e3249798/overview.png)

1. There is a **context** to maintain and provide the state of the whole game. The context also deals with the data transfer with websocket and processes logic about players' movement.
2. When player enters the main page, he can create a room by enter the room number he wants and share the link with friends. 
3. The game page is located by Id, there is a Status component showing the current score and a Board component for players to move their chess.
4. When player1 enters a room, the game won't start until there are two players in the same room.

# Data Transfer

Websocket for data transfer.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/be2928a7-77b0-40a5-a210-cc8090aea8a8/server.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/be2928a7-77b0-40a5-a210-cc8090aea8a8/server.png)

Player 1 and Player 2 are both in the same room, and Player 1 will  wait for Player 2 to begin the game. 

When a player joins the room, makes movements or win the game, he will send message to the server, and once the server receives the message, it will emits the message data to the room where players are in.

# UI

## Board

Just draw a few lines.

## Player

Player1 is placed on the left bottom and Player2 is placed on the opposite.

The movement status is maintained in an array called **coordArr**. CoordArr is used to record the coordinate of each player so that we know where each player is placed in.

When there are two players in the room, each player will send their initial coord to the server, the first player is placed on the left bottom, [0 ,0], and the second player  is placed on the opposite [7, 7].

After the server receives message from clients like 'move', it will emit the movement to the room, so that every player will get a message of the movement. When a client receives a message about movement, it will **update the coordArr** by putting the new movement with id in the array.

There is a function listening and reacting to the keyboard event. When play press the key, it will calculate the next coordinate the player wants to go, if the coord is already in the coordArr, it will not do anything. If the length of the array is odd, it means play1 has already moved, and it's time for player2 to take action. Therefore if this time player1 press the key, it will not do anything neither.

Whenever some of the player hits the other play's coordinate, he will win this round and send a message of winning to the room. After receiving the winning message, the board will be reset and a new round will begin.

# What's missing?

## Collecting and release empty room

Use a setInterval function to check from time to time whether the rooms is still active, if not empty the room's id array.

## Canvas for the board

Use canvas to draw the board, so that is will be more convenient to show the tracking details of the player.

## Encryption of data exchange

Use CryptoJS to encrypt and decrypt messages.

## Store of tracking details

Store the coord array in a json file

## Test