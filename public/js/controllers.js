'use strict';

/* Controllers */

var Controllers = angular.module('myApp.controllers', []);

Controllers.controller('AppCtrl', function ($scope, $location, Config, $window, AuthenticationService, User) {
	$scope.AuthenticationService = AuthenticationService;
	$scope.$watch('AuthenticationService.userInfo', function(newVal, oldVal, scope){
		if (newVal) {
			Config.getConfig().success(function(data) {
				$scope.config = data;
			});
		}
	});
	$scope.login = function(username, password) {
		if (username !== undefined && password !== undefined) {
			User.login(username, password).success(function(data) {
				AuthenticationService.userInfo = data.token;
				$window.sessionStorage.token = data.token;
				$location.path('/home');
			});
		}
	}

	$scope.logout = function() {
		if (AuthenticationService.getUserInfo()) {
			User.logout().success(function(data) {
				AuthenticationService.userInfo = null;
				delete $window.sessionStorage.token;
				$location.path('/login');
			}).error(function(status, data) {

			});
		}
	}
});

// Home page
Controllers.controller('IndexCtrl', function ($scope, $http, $location, $anchorScroll, User, AuthenticationService, socket) {
	User.getCurrentUser().success(function(data) {
		var username = data.name.first + ' ' + data.name.last;
		
		$scope.messages = [];
		$scope.users = [];

		socket.emit('adduser', data);
		socket.on('updatechat', function(username, message) {
			var mes = {};
			if (username == 'SERVER') {
				mes = {user: username, text:message, class: 'alert-success'};
			} else {
				mes = {user: username, text:message};
			}
			$scope.messages.push({
				user: username,
				text: message
			});
			$scope.stopFlash();
		});

		socket.on('updateuser', function(data) {
			$scope.users = data;
		})

		$scope.sendMessage = function() {
			socket.emit('sendchat', $scope.message);
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
		$scope.edit_form.submitted = false;
		if($scope.edit_form.$valid) {
			$scope.formCopy = angular.copy(form);
			
				User.updateUser($routeParams.userId, form).success(function (data, status, headers, config) {
					$location.path('/user');
				}).error(function (data, status, headers, config) {
					//todo
				});
			
		} else {
			$scope.edit_form.submitted = true;
		}
	}

	$scope.reset = function(form) {
		$scope.form = angular.copy($scope.formCopy);
		$scope.form.username = form.username ? form.username : '';
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
		$scope.userId = 'new';
	}

});

Controllers.controller('VisualCtrl', function($scope) {
	$scope.data1 = {};
	$scope.data1.dataTable = new google.visualization.DataTable();
	$scope.data1.dataTable.addColumn('string', 'Name');
	$scope.data1.dataTable.addColumn('number', 'Qty');
	$scope.data1.dataTable.addRow(['Test', 1]);
	$scope.data1.dataTable.addRow(['Test2', 2]);
	$scope.data1.dataTable.addRow(['Test3', 3]);
	$scope.data1.title = 'My pie';

	$scope.data2 = {};
	$scope.data2.dataTable = new google.visualization.DataTable();
	$scope.data2.dataTable.addColumn('string', 'Name');
	$scope.data2.dataTable.addColumn('number', 'Qty');
	$scope.data2.dataTable.addRow(['Test', 1]);
	$scope.data2.dataTable.addRow(['Test2', 2]);
	$scope.data2.dataTable.addRow(['Test3', 3]);
	$scope.data2.title = 'My pie';

	$scope.data3 = {};
	$scope.data3.dataTable = new google.visualization.DataTable();
	$scope.data3.dataTable.addColumn('string', 'Name');
	$scope.data3.dataTable.addColumn('number', 'Qty');
	$scope.data3.dataTable.addRow(['Test', 1]);
	$scope.data3.dataTable.addRow(['Test2', 2]);
	$scope.data3.dataTable.addRow(['Test3', 3]);
	$scope.data3.title = 'My pie';
});

