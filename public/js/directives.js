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
})