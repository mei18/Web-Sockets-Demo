//NodeJS server
var http = require('http');
var server = http.createServer(function(){	
});

server.listen(1234, function(){
	console.log('Server is runing on port 1234.');
});

//Web sockets server
var WebSocketServer = require('websocket').server;
var wsServer = new WebSocketServer({
	httpServer: server
});

var count = 0;
var clients = {};

wsServer.on('request', function(req){
	//aceptar la conexion
	//origin contiene toda la información del cliente que se está conectando
	var connection = req.accept('echo-protocol', req.origin);
	
	var id = count ++;
	clients[id] = connection;
	console.log('New connection accepted: '+ id);
	//recibir un mensaje
	connection.on('message', function(message){
		var msString = message.utf8Data;
		// Broadcasting
		for(var client in clients){
			clients[client].sendUTF(msString);
		}
	});
	//cliente existe
	connection.on('close', function(reasonCode, description){
		delete clients[id];
		console.log('Client disconnected. Id: '+ id +', Address: '+ connection.remoteAddress +'\n'+ description);
	});
});