'use strict';

/* Services */

var Services = angular.module('myApp.services', []);

Services.service('Config', function($http) {
	return {
		getConfig: function(callback) {
			return $http.get('/api/getConfig');
		}
	}
});