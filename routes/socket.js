// export function for server socket event
module.exports = function (socket) {
	socket.on('adduser', function(data, username, userId) {
		socket.username = data.username;
		socket.room = 'room1';
		app.usernames[data.username] = data;
		socket.join('room1');
		socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		socket.emit('updateuser', app.usernames);
		socket.broadcast.to('room1').emit('updatechat', 'SERVER', socket.username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');
	});

	socket.on('sendchat', function(message) {
		app.io.sockets.in(socket.room).emit('updatechat', socket.username, message);
	});

	socket.on('switchRoom', function(newroom) {
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has left this room');
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});

	socket.on('disconnect', function() {
		delete app.usernames[socket.username];
		app.io.sockets.emit('updateusers', app.usernames);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
};