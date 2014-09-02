'use strict';

/* Controllers */

var Controllers = angular.module('myApp.controllers', []);

Controllers.controller('AppCtrl', function ($scope, $location, Config, $window, AuthenticationService, User) {
	Config.getConfig().success(function(data) {
		$scope.config = data;
	});
	
	$scope.login = function(username, password) {
		if (username !== undefined && password !== undefined) {
			User.login(username, password).success(function(data) {
				AuthenticationService.isLogged = true;
				$window.sessionStorage.token = data.token;
				$location.path('/home');
			});
		}
	}

	$scope.logout = function() {
		if (AuthenticationService.isLogged) {
			User.logout().success(function(data) {
				AuthenticationService.isLogged = false;
				delete $window.sessionStorage.token;
				$location.path('/login');
			}).error(function(status, data) {

			});
		}
	}
});

//login page
Controllers.controller('LoginCtrl', function ($scope, $http, $window, $location, AuthenticationService, User) {

});

// Home page
Controllers.controller('IndexCtrl', function ($scope, $http, $location, User, AuthenticationService, socket) {
	User.getCurrentUser().success(function(data) {
		// $scope.currentUser = data;
		socket.on('init', function(data) {
			$scope.name = data.name.first + ' ' + data.name.last;
			// $scope.users = 
		});

		socket.on('send:message', function(message) {
			$scope.messages.push(message);
		});

		socket.on('user:join', function(data) {
			$scope.messages.push({
				user: 'chatroom',
				text: 'User ' + data.name + ' has joined.'
			})
		});

		socket.on('user:left', function(data) {
			$scope.messages.push({
				user: 'chatroom',
				text: 'User ' + data.name + ' has left.'
			});
			var i, user;
			for (i = 0; i<$scope.users.length; i++) {
				user = $scope.users[i];
				if (user === data.name) {
					$scope.users.splice(i, 1);
					break;
				}
			}
		});

		$scope.messages = [];

		$scope.sendMessage = function() {
			socket.emit('send:message', {
				message: $scope.message
			});

			$scope.messages.push({
				user: $scope.name,
				text: $scope.message
			});

			$scope.message = '';
		}
	});

});

// User management page
Controllers.controller('UserIndexCtrl', function ($scope, $http, $location, User) {
	User.getUsers().success(function (data, status, headers, config) {
		$scope.users = data;

	}).error(function (data, status, headers, config) {
		$scope.data = [];
	});

	$scope.removeUser = function(event, id) {
		event.preventDefault();
		User.removeUser(id).success(function (data, status, headers, config) {
			$scope.users = data;

		}).error(function (data, status, headers, config) {
			alert(data.message);
		});
	}
});

// User edit page
Controllers.controller('UserEditCtrl', function ($scope, $http, $location, $routeParams, User) {
	$scope.formCopy = User.createUser();

	$scope.update = function(form) {
		$scope.formCopy = angular.copy(form);
		if (form) {
			User.updateUser($routeParams.userId, form).success(function (data, status, headers, config) {
				$location.path('/user');
			}).error(function (data, status, headers, config) {
				//todo
			});
		}
	}

	$scope.reset = function() {
		$scope.form = angular.copy($scope.formCopy);
	}

	if ($routeParams.userId && $routeParams.userId.match(/^[0-9a-fA-F]{24}$/)) {
		$scope.userAction = 'Update User';
		User.getUser($routeParams.userId).success(function (data, status, headers, config) {
			$scope.form = data;

		}).error(function (data, status, headers, config) {
			alert(data.message);
			$location.path('/user');
		});
	} else if ($routeParams.userId == 'new') {
		$scope.userAction = 'Create User';
	}
});

Controllers.controller('FlightGameCtrl', function($scope, $http) {

});
