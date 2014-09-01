'use strict';

/* Controllers */

var Controllers = angular.module('myApp.controllers', []);

Controllers.controller('AppCtrl', function ($scope, $location) {
	if (['/','/login'].indexOf($location.$$path) > -1) $scope.hideHeader = true;
});

Controllers.controller('LoginCtrl', function ($scope, $http) {
	$scope.submit = function() {
		$http({
			method: 'POST',
			url: '/api/login',
			data: {'username':this.username, 'password':this.password}
		})
		.success(function(data, status, headers, config){

		})
		.error(function(data, status, headers, config){

		});
	}
});

Controllers.controller('IndexCtrl', function ($scope, $http, $location) {
	$http({
		method: 'GET',
		url: '/api/getUsers'
	})
	.success(function (data, status, headers, config) {
		$scope.users = data;
	})
	.error(function (data, status, headers, config) {
		$scope.data = [];
	});

	$scope.removeUser = function(event, id) {
		event.preventDefault();
		$http({
			method: 'DELETE',
			url: '/api/removeUser/' + id,
		})
		.success(function (data, status, headers, config) {
			$scope.users = data;
		})
		.error(function (data, status, headers, config) {
			alert(data.message);
		});
	}
});

Controllers.controller('UserIndexCtrl', function ($scope, $http, $location) {
	$http({
		method: 'GET',
		url: '/api/getUsers'
	})
	.success(function (data, status, headers, config) {
		$scope.users = data;
	})
	.error(function (data, status, headers, config) {
		$scope.data = [];
	});

	$scope.removeUser = function(event, id) {
		event.preventDefault();
		$http({
			method: 'DELETE',
			url: '/api/removeUser/' + id,
		})
		.success(function (data, status, headers, config) {
			$scope.users = data;
		})
		.error(function (data, status, headers, config) {
			alert(data.message);
		});
	}
});

Controllers.controller('UserEditCtrl', function ($scope, $http, $location, $routeParams, User) {
	$scope.formCopy = User.createUser();

	$scope.update = function(form) {
		$scope.formCopy = angular.copy(form);
		if (form) {
			$http({
				method: 'POST',
				url: '/api/updateUser/' + $routeParams.userId,
				headers: {'Content-Type': 'application/json'},
				transformRequest: function(obj) {
					return angular.toJson(obj)
				},
				data: form
			})
			.success(function (data, status, headers, config) {
				$location.path('/');
			})
			.error(function (data, status, headers, config) {
				
			});
		}
	}

	$scope.reset = function() {
		$scope.form = angular.copy($scope.formCopy);
	}

	if ($routeParams.userId && $routeParams.userId.match(/^[0-9a-fA-F]{24}$/)) {
		$scope.userAction = 'Update User';
		$http({
			method: 'GET',
			url: '/api/getUser/' + $routeParams.userId
		})
		.success(function (data, status, headers, config) {
			$scope.form = data;
		})
		.error(function (data, status, headers, config) {
			alert(data.message);
			$location.path('/');
		});
	} else if ($routeParams.userId == 'new') {
		$scope.userAction = 'Create User';
	}
});

Controllers.controller('FlightGameCtrl', function($scope, $http) {

});
