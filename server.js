var express = require('express');
var socket = require('socket.io');

//store the express functions to var app
var app = express();
//Create a server on localhost:3000
var server = app.listen(5000);
//host content as static on public
app.use(express.static('public'));

console.log("Node is running on port 5000...");

//assign the server to the socket
var io = socket(server);
//dealing with server events / connection
io.sockets.on('connection', newConnection); //callback

//function that serves the new connection
function newConnection(socket){
	console.log('New connection: ' + socket.id);
	socket.on('clickEvent', mouseMsg);

	function mouseMsg(data){
		socket.broadcast.emit('clickEvent', data);
		//following line refers to sending data to all
		//io.sockets.emit('mouse', data);
		console.log(data);
	}
}