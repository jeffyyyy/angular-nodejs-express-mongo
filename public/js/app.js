'use strict';

// Declare app level module which depends on filters, factories and services

var myApp = angular.module('myApp', [
	'ngRoute',
	'myApp.controllers',
	'myApp.factory',
	'myApp.filters',
	'myApp.services',
	'myApp.directives'
]);

myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/partials/login.ejs',
			controller: 'LoginCtrl'
		})
		.when('/home', {
			templateUrl: '/partials/index.ejs',
			controller: 'IndexCtrl'
		})
		.when('/user', {
			templateUrl: 'partials/userIndex.ejs',
			controller: 'UserIndexCtrl'
		})
		.when('/user/:userId', {
			templateUrl: '/partials/userEdit.ejs',
			controller: 'UserEditCtrl'
		})
		.when('/flightGame', {
			templateUrl: '/partials/flightGame.ejs',
			controller: 'FlightGameCtrl'
		})
		.otherwise({
			redirectTo: '/home'
		});

	$locationProvider.html5Mode(true);
}]);
