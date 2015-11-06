express = require('express'); // Web Server
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server); // Web Socket Server

server.listen(3000); // Start the server on port 3000
app.use(express.static('public'));

var messages = [];
var newMessage = "";

console.log("Server Started on port 3000")

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('Server started on '+ add + ':3000');
})

io.sockets.on('connection', function(socket){
  console.log("Client Connected");

  socket.emit('message', {value : newMessage});

  socket.on('message', function(data){
    console.log("Message recieved " + data.value);
    newMessage = data.value;

    var buf = new Buffer(1);
    buf.writeUInt8(newMessage,0);

    io.sockets.emit('message', {value: newMessage});

  })
  socket.on("disconnect", function() {
    // request closed unexpectedly
    console.log("CLient Disconnect");
  });

});
