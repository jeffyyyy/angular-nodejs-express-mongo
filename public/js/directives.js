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

Directives.directive('ngEnsureUnique', function($http) {
	return {
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl) {
			 scope.$watch(attrs.ngModel, function() {
				if (ctrl.$modelValue) {
					$http({
						method: 'POST',
						url: '/api/check/' + attrs.ensureUnique,
						data: {'username': ctrl.$modelValue}
					})
					.success(function(data, status, header, config) {
						ctrl.$setValidity('unique', data.isUnique);
					})
					.error(function(data, status, headers, config) {
						ctrl.$setValidity('unique', false);
					});
				}
			});
		}
	}
});

Directives.directive('ngValidateEmail', function() {
	return {
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl) {
			var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			scope.$watch(attrs.ngModel, function() {
				ctrl.$setValidity('invalidEmail', regexp.test(ctrl.$viewValue));

				var BLUR_CLASS = "ng-blurred";
				ctrl.$blurred = false;
				ele.on('keydown', function(evt) {
					ele.removeClass(BLUR_CLASS);
					scope.$apply(function() {
						ctrl.$blurred = false;
					});
				});
				ele.on('blur', function(evt) {
					ele.addClass(BLUR_CLASS);
					scope.$apply(function() {
						ctrl.$blurred = true;
					});
				});
			});
		}
	}
});