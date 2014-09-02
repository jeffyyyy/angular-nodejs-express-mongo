// export function for server socket event
module.exports = function (socket) {
	socket.on('init', function(data) {
		// notify other clients that a new user has joined
		socket.broadcast.emit('user:join', {
			name: data.name
		});

		// broadcast a user's message to other clients
		socket.on('send:message', function (data) {
			socket.broadcast.emit('send:message', {
				user: data.name,
				text: data.message
			});
		});
	   
		// broadcast it to other users when a user leaves
		socket.on('disconnect', function () {
			socket.broadcast.emit('user:left', {
				name: data.name
			});
		});
    });
};