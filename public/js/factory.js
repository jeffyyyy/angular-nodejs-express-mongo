'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.factory', [])
	.factory('User', function() {
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
