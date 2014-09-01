'use strict';

/* Services */

var Factories = angular.module('myApp.factory', []);

Factories.factory('User', function() {
		return {
			createUser: function() {
				var user = {
								name: { first: '', last: '' },
								email: '',
								phone: ''
						};
				return user;
			}
		}
});

Factories.factory('authInterceptor', function($rootScope, $q, $window) {
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