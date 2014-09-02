'use strict';

/* Factories */

var Factories = angular.module('myApp.factory', []);

Factories.factory('User', function($http, Config) {
	return {
		createUser: function() {
			var user =  {
							name: { first: '', last: '' },
							email: '',
							phone: ''
						};
			return user;
		},

		login: function(username, password) {
			return $http.post('/authenticate', {username: username, password: password});
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

Factories.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false
    }
 
    return auth;
});