// export function for server socket event
module.exports = function (socket) {
	socket.on('adduser', function(data, username, userId) {
		socket.username = data.username;
		socket.room = 'chatroom';
		socket.join('chatroom');
		app.usernames[data.username] = data;
		socket.emit('updatechat', 'SERVER', 'you have connected to chatroom');
		socket.emit('updateuser', app.usernames);
		socket.broadcast.to('chatroom').emit('updateuser', app.usernames);
		socket.broadcast.to('chatroom').emit('updatechat', 'SERVER', socket.username + ' has connected to this room');
	});

	socket.on('sendchat', function(message) {
		app.io.sockets.in(socket.room).emit('updatechat', socket.username, message);
	});

	socket.on('disconnect', function() {
		delete app.usernames[socket.username];
		app.io.sockets.emit('updateusers', app.usernames);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
};