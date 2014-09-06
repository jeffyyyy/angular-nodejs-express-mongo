'use strict';

/* Controllers */

var Controllers = angular.module('myApp.controllers', []);

Controllers.controller('AppCtrl', function ($scope, $location, Config, $window, AuthenticationService, User) {
	$scope.AuthenticationService = AuthenticationService;
	$scope.$watch('AuthenticationService.isLogged', function(newVal, oldVal, scope){
		if (newVal) {
			Config.getConfig().success(function(data) {
				$scope.config = data;
			});
		}
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
Controllers.controller('IndexCtrl', function ($scope, $http, $location, $anchorScroll, User, AuthenticationService, socket) {
	User.getCurrentUser().success(function(data) {
		$scope.name = data.name.first + ' ' + data.name.last;
		socket.emit('init', {
			name: data.name.first + ' ' + data.name.last
		});

		socket.on('send:message', function(message) {
			$scope.messages.push(message);
			$scope.stopFlash();
		});

		socket.on('user:join', function(data) {
			$scope.messages.push({
				user: 'Chatroom',
				text: 'User ' + data.name + ' has joined.',
				class: 'alert-success'
			});
			$scope.stopFlash();
			$location.hash('bottom');
	        $anchorScroll();
		});

		socket.on('user:left', function(data) {
			$scope.messages.push({
				user: 'Chatroom',
				text: 'User ' + data.name + ' has left.',
				class: 'alert-danger'
			});
			$scope.stopFlash();
			$location.hash('bottom');
	        $anchorScroll();
		});

		$scope.messages = [];
		$scope.sendMessage = function() {
			socket.emit('send:message', {
				name: $scope.name,
				message: $scope.message
			});
		
			$scope.messages.push({
				user: $scope.name,
				text: $scope.message
			});
			
			$scope.stopFlash();

			$location.hash('bottom');
	        $anchorScroll();
			$scope.message = '';
			
		}

		$scope.stopFlash = function() {
			if(angular.isDefined(stop)) {
				$scope.stop();
			}
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
		if($scope.edit_form.$valid) {
			$scope.formCopy = angular.copy(form);
			if (form) {
				User.updateUser($routeParams.userId, form).success(function (data, status, headers, config) {
					$location.path('/user');
				}).error(function (data, status, headers, config) {
					//todo
				});
			}
		}
	}

	$scope.reset = function() {
		$scope.form = angular.copy($scope.formCopy);
	}

	if ($routeParams.userId && $routeParams.userId.match(/^[0-9a-fA-F]{24}$/)) {
		$scope.userAction = 'Update User';
		User.getUser($routeParams.userId).success(function (data, status, headers, config) {
			$scope.form = data;
			$scope.userId = $routeParams.userId;
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
