'use strict';

// Declare app level module which depends on filters, factories and services

var myApp = angular.module('myApp', [
	'ngRoute',
	'myApp.factory',
	'myApp.controllers',
	'myApp.filters',
	'myApp.services',
	'myApp.directives'
]);

myApp.config(function ($routeProvider, $locationProvider, $httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');

	$routeProvider
		.when('/', {
			templateUrl: '/partials/login.ejs',
			controller: 'LoginCtrl',
			access: { requiredLogin: false }
		})
		.when('/login', {
			templateUrl: '/partials/login.ejs',
			controller: 'LoginCtrl',
			access: { requiredLogin: false }
		})
		.when('/home', {
			templateUrl: '/partials/index.ejs',
			controller: 'IndexCtrl',
			access: { requiredLogin: true }
		})
		.when('/user', {
			templateUrl: 'partials/userIndex.ejs',
			controller: 'UserIndexCtrl',
			access: { requiredLogin: true }
		})
		.when('/user/:userId', {
			templateUrl: '/partials/userEdit.ejs',
			controller: 'UserEditCtrl',
			access: { requiredLogin: true }
		})
		.when('/flightGame', {
			templateUrl: '/partials/flightGame.ejs',
			controller: 'FlightGameCtrl',
			access: { requiredLogin: true }
		})
		.otherwise({
			redirectTo: '/login'
		});

	$locationProvider.html5Mode(true);
});

myApp.run(function($rootScope, $location, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
		console.log(AuthenticationService);
		console.log(nextRoute.access);
        if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged) {
            $location.path("/login");
        }
    });
});