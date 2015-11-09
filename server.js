express = require('express'); // Web Server
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server); // Web Socket Server
var port = 3000;  // Desired port, Default is 3000
server.listen(port); // Start the server on port, Default is 3000
app.use(express.static('public')); // Folder for the static html pages

var messages = []; // Array to store previous messages
var users = []; // Array to store previous users
var newMessage = "";

// Function to get the local ip addresses
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('Server started on '+ add + ':' + port);
})

// On client connection
io.sockets.on('connection', function(socket){
  console.log("Client Connected");

// Send all previous messages
  for(i = 0; i<messages.length; i++){
    socket.emit('message', {value : messages[i]}, {value: users[i]});
  }

// When a message is recieved
  socket.on('message', function(data,userName){
    console.log("Message Recieved from " + userName.value);
    newMessage = data.value;
    newUserName = userName.value;

    // var buf = new Buffer(1);
    // buf.writeUInt8(newMessage,0);
    messages.push(newMessage); // Add the message to the messages array
    users.push(newUserName);
    io.sockets.emit('message', {value: newMessage},{value: newUserName}); // Send the message to all the other clients

  })

  // When a client disconnects
  socket.on("disconnect", function() {
    // request closed unexpectedly
    console.log("Client Disconnect");
  });

});
