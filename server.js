//
// This server will start a bash shell and expose it
// over socket.io to a browser. See ./term.html for the 
// client side.
// 
// You should probably:
//
//   npm install socket.io
//   curl -O https://github.com/LearnBoost/Socket.IO/raw/master/socket.io.min.js
//
// To get socket.io in the node_modules directory and
// the socket.io.min.js file needed for the client.
//
// To start the server:
//
//   node server.js
//
// And then load up your term!
//
//   open http://`hostname`:8080/term.html
//
// You can even share the url with a friend on your
// local network. Be sure they're a friend though :-)
//

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const sys   = require('sys');
const util  = require('util');
const spawn = require('child_process').spawn;
const sh = spawn('bash');

app.use(express.static('./'))

sh.stdout.on('data', function(data) {
  io.emit('message', data);
});

sh.stderr.on('data', function(data) {
  io.emit('message', data);
});

sh.on('exit', function (code) {
  io.emit('exit', '** Shell exited: '+code+' **');
});


io.on('connection', function(client){
  client.on('message', function(data){
    sh.stdin.write(data+"\n");
    console.log('data')
    console.log(data)
    io.emit('message', new Buffer("> "+data));
  });
});

server.listen(8080, function(){
  console.log('server started');
})