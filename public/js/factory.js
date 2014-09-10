'use strict';

/* Factories */

var Factories = angular.module('myApp.factory', []);

Factories.factory('User', function($http, Config) {
	return {
		createUser: function() {
			var user =  {
							name: { first: '', last: '' },
							username: '',
							email: '',
							phone: ''
						};
			return user;
		},

		login: function(username, password) {
			return $http.post('/authenticate', {username: username, password: password});
		},

		logout: function() {
			return $http.post('/api/logout');
		},

		getCurrentUser: function() {
			return $http.get('/api/getCurrentUser');
		},

		getUser: function(id) {
			return $http.get('/api/getUser/' + id);
		},

		getUsers: function() {
			return $http.get('/api/getUsers');
		},

		removeUser: function(id) {
			return $http.delete('/api/removeUser/' + id);
		},

		updateUser: function(id, data) {
			return $http({
				method: 'POST',
				url: '/api/updateUser/' + id,
				headers: {'Content-Type': 'application/json'},
				transformRequest: function(obj) {
					return angular.toJson(obj)
				},
				data: data
			});
		}
	}
});

Factories.factory('authInterceptor', function($q, $window, AuthenticationService) {
	return {
		request: function (config) {
			config.headers = config.headers || {};
			if ($window.sessionStorage.token) {
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			}
			return config;
		},
		response: function (response) {
			if (response.status === 401) {
				// handle the case where the user is not authenticated
			}

			return response || $q.when(response);
		}
	};
});

Factories.factory('AuthenticationService', function($window) {
	var userInfo;
	
	function init() {
		if ($window.sessionStorage.token) {
			userInfo = $window.sessionStorage.token;
		}
	}

 	function getUserInfo() {
		return userInfo;
	}

	return {
		getUserInfo: getUserInfo,
		init: init
	}
});

Factories.factory('socket', function($rootScope) {
	var socket = io.connect();
	return {
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
			var args = arguments;
			$rootScope.$apply(function() {
				if (callback) {
					callback.apply(socket, args);
					}
				});
			});
		},
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				})
			});
		}
	}
});