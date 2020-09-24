var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var rooms = {}

io.on('connection', (socket) => {
  socket.on('join', (roomid) => {
    socket.join(roomid, () => {
      if (rooms[roomid]) {
        rooms[roomid] = rooms[roomid].concat(socket.id)
      } else {
        rooms[roomid] = [socket.id]
      }
      io.to(roomid).emit('joined', rooms[roomid])
    })
  })
  socket.on('getRooms', () => {
    socket.emit('rooms', rooms)
  })
  socket.on('move', (msg) => {
    io.to(msg.roomId).emit('move', msg)
  })

  socket.on('winner', (msg) => {
    io.to(msg.roomId).emit('winner', msg.id)
  })
  console.log('a user connected');
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});
