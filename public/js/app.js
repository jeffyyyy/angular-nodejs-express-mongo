'use strict';

google.load('visualization', '1', {packages: ['corechart', 'timeline']});

// Declare app level module which depends on filters, factories and services

var myApp = angular.module('myApp', [
	'ngRoute',
	'ngAnimate',
	'myApp.services',
	'myApp.factory',
	'myApp.controllers',
	'myApp.filters',
	'myApp.directives'
]);

myApp.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/public/partials/login.ejs',
			controller: 'AppCtrl',
			access: { requiredLogin: false }
		})
		.when('/login', {
			templateUrl: '/public/partials/login.ejs',
			controller: 'AppCtrl',
			access: { requiredLogin: false }
		})
		.when('/home', {
			templateUrl: '/public/partials/index.ejs',
			controller: 'IndexCtrl',
			access: { requiredLogin: true }
		})
		.when('/user', {
			templateUrl: '/public/partials/userIndex.ejs',
			controller: 'UserIndexCtrl',
			access: { requiredLogin: true }
		})
		.when('/user/:userId', {
			templateUrl: '/public/partials/userEdit.ejs',
			controller: 'UserEditCtrl',
			access: { requiredLogin: true }
		})
		.when('/flightGame', {
			templateUrl: '/public/partials/flightGame.ejs',
			access: { requiredLogin: true }
		})
		.when('/paintBoard', {
			templateUrl: '/public/partials/paintBoard.ejs',
			access: { requiredLogin: true }
		})
		.when('/visual', {
			templateUrl: '/public/partials/visual.ejs',
			controller: 'VisualCtrl',
			access: { requiredLogin: true}
		})
		.otherwise({
			redirectTo: '/login'
		});

	$locationProvider.html5Mode(true);
});

myApp.config(function($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
});

myApp.run(function($rootScope, $location, $window, AuthenticationService) {
	$rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
		AuthenticationService.init();
		if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredLogin && 
			!AuthenticationService.userInfo && !$window.sessionStorage.token) {
			$location.path('/login');
		}
	});
});

