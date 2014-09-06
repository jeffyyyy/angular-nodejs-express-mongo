'use strict';

/* Directives */
var Directives = angular.module('myApp.directives', []);

Directives.directive('appVersion', function (version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
});


Directives.directive('slash', function($interval) {
	return {
		restrict: "E",
		controller: function($scope) {
			$scope.showDash = true;
			var showDash = $interval(function() {
				$scope.showDash = !$scope.showDash;
			}, 500);

			$scope.stop = function() {
				$interval.cancel(showDash);
				$scope.showDash = false;
				showDash = undefined;
			}
		}
	}
});

Directives.directive('ngBlur', function() {
	return {
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl) {
			ctrl.$blurred = false;
			ele.on('keydown', function(evt) {
				scope.$apply(function() {
					ctrl.$blurred = false;
				});
			});
			ele.on('blur', function(evt) {
				scope.$apply(function() {
					ctrl.$blurred = true;
				});
			});
		}
	}
});

Directives.directive('ngCheckExist', function($http, $routeParams) {
	return {
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl) {
			ctrl.$setValidity('userExist', true);
			if ($routeParams.userId == 'new') {
				scope.$watch(attrs.ngModel, function() {
					if (ctrl.$viewValue) {
						$http({
							method: 'POST',
							url: '/api/check/' + attrs.ngCheckExist,
							data: {'username': ctrl.$modelValue}
						})
						.success(function(data, status, header, config) {
								ctrl.$setValidity('userExist', !data.userExist);
						})
						.error(function(data, status, headers, config) {
								ctrl.$setValidity('userExist', false);
						});
					}
				});
			}
		}
	}
});


Directives.directive('ngValidateEmail', function() {
	return {
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl) {
			ctrl.$setValidity('invalidEmail', true);
			var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			scope.$watch(attrs.ngModel, function() {
				if (!ctrl.$modelValue) {
					ctrl.$setValidity('invalidEmail', true);
				} else {
					ctrl.$setValidity('invalidEmail', regexp.test(ctrl.$viewValue));
				}
			});
		}
	}
});