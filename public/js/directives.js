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

			ele.on('keydown', function(evt) {
				scope.$apply(function() {
					ctrl.$setValidity('invalidEmail', true);
				});
			});

			ele.on('blur', function(evt) {
				scope.$apply(function() {
					if (!ctrl.$modelValue) {
						ctrl.$setValidity('invalidEmail', true);
					} else {
						ctrl.$setValidity('invalidEmail', regexp.test(ctrl.$viewValue));
					}
				});
			});
		}
	}
});

Directives.directive('flightgame', function() {
	var FlightGame = function(length, times) {
		this.myRect = [];
		this.myTri = [];
		this.color = {"yellow": "#ffff00", "blue": "#0000ff", "red": "#ff0000", "green": "#00ff00", "grey": "#c0c0c0"};
		this.length = length;
		this.times = times;
		return this;
	}

	FlightGame.prototype.drawRect = function(x, y, w, h, fill) {
		var obj = {};
		obj.x = x;
		obj.y = y;
		obj.w = w;
		obj.h = h;
		obj.fill = fill;

		this.myRect.push(obj);
	}

	FlightGame.prototype.drawSmallRect = function(data, size, fill, vertical) {
		var l = this.length;
		for(var i=0; i<fill.length; i++) {
			var obj = {};
			if (vertical) {
				obj.x = data[0] * l;
				obj.y = (data[1] + i) * l;
			} else {
				obj.x = (data[0] + i) * l;
				obj.y = data[1] * l;
			}
			
			obj.w = size[0] * l;
			obj.h = size[1] * l;
		
			
			obj.fill = fill[i];

			this.myRect.push(obj);
		}
	}

	FlightGame.prototype.drawTriangle = function (data, fill) {
		var times = this.times
		  , l = this.length
		;

		for(var i=0; i<fill.length; i++) {
			var obj = {};
			obj.x1 = data[0] * l;
			obj.y1 = data[1] * l;
			obj.x2 = data[2] * l;
			obj.y2 = data[3] * l;
			obj.x3 = data[4] * l;
			obj.y3 = data[5] * l;
			if ( i ==1 ) {
				obj.x1 = (times - data[0]) * l;
				obj.x2 = (times - data[2]) * l;
				obj.x3 = (times - data[4]) * l;
			} else if (i == 2) {
				obj.y1 = (times - data[1]) * l;
				obj.y2 = (times - data[3]) * l;
				obj.y3 = (times - data[5]) * l;
			} else if (i == 3) {
				obj.x1 = (times - data[0]) * l;
				obj.y1 = (times - data[1]) * l;
				obj.x2 = (times - data[2]) * l;
				obj.y2 = (times - data[3]) * l;
				obj.x3 = (times - data[4]) * l;
				obj.y3 = (times - data[5]) * l;
			}
			
			obj.fill = fill[i];

			this.myTri.push(obj);
		}
	}

	FlightGame.prototype.drawMiddle = function (data, fill) {
		var times = this.times
		  , l = this.length
		;

		for(var i=0; i<fill.length; i++) {
			var obj = {};
			obj.x1 = data[0] * l;
			obj.y1 = data[1] * l;
			obj.x2 = data[2] * l;
			obj.y2 = data[3] * l;
			obj.x3 = data[4] * l;
			obj.y3 = data[5] * l;
			if ( i ==1 ) {
				obj.x3 = (times - data[4]) * l;
				obj.y3 = (times - data[5]) * l;
			} else if (i == 2) {
				obj.x1 = (times-data[0]) * l;
				obj.x3 = (times - data[4]) * l;
			} else if (i == 3) {
				obj.y1 = (times - data[1]) * l;
				obj.x3 = (times - data[4]) * l;
			}
			
			obj.fill = fill[i];

			this.myTri.push(obj);
		}
	}

	return {
		restrict: "A",
		controller: function($scope, $element) {
			$scope.draw = function() {
				var ctx = $element[0].getContext('2d')
				  , l = 40
				  , fg = new FlightGame(l, $element[0].offsetWidth/l)
				  , color = fg.color
				;

				//draw the four players starting area
				fg.drawRect(0, 0, l*4, l*4, color.yellow);
				fg.drawRect(l*13, 0, l*4, l*4, color.blue);
				fg.drawRect(0, l*13, l*4, l*4, color.red);
				fg.drawRect(l*13, l*13, l*4, l*4, color.green);

				//draw the main four path to the end
				fg.drawRect(l*8, l*2, l, l*5, color.blue);
				fg.drawRect(l*8, l*10, l, l*5, color.red);
				fg.drawRect(l*10, l*8, l*5, l, color.green);
				fg.drawRect(l*2, l*8, l*5, l, color.yellow);

				//draw all the rest rectangles line by line
				fg.drawSmallRect([6, 0], [1, 2], [color.red, color.yellow, color.blue, color.green, color.red]);
				fg.drawSmallRect([6, 0], [1, 2], [color.red, color.yellow, color.blue, color.green, color.red]);
				
				fg.drawSmallRect([4, 2], [2, 1], [color.blue, color.yellow], true);
				fg.drawSmallRect([11, 2], [2, 1], [color.blue, color.green], true);

				fg.drawSmallRect([2, 4], [1, 2], [color.yellow, color.blue]);
				fg.drawSmallRect([13, 4], [1, 2], [color.blue, color.green]);

				fg.drawSmallRect([0, 6], [2, 1], [color.green, color.blue, color.yellow, color.red, color.green], true);
				fg.drawSmallRect([15, 6], [2, 1], [color.yellow, color.blue, color.green, color.red, color.yellow], true);

				fg.drawSmallRect([2, 11], [1, 2], [color.yellow, color.red]);
				fg.drawSmallRect([13, 11], [1, 2], [color.red, color.green]);

				fg.drawSmallRect([4, 13], [2, 1], [color.yellow, color.red], true);
				fg.drawSmallRect([11, 13], [2, 1], [color.green, color.red], true);

				fg.drawSmallRect([6, 15], [1, 2], [color.blue, color.yellow, color.red, color.green, color.blue]);

				//draw all the triangles
				fg.drawMiddle([7, 7, 8.5, 8.5, 7, 10], [color.yellow, color.blue, color.green, color.red]);	// 64 70 76 58
				fg.drawTriangle([4, 2, 6, 2, 6, 0], [color.green, color.yellow, color.green, color.yellow]);	// 21 27 1 47
				fg.drawTriangle([0, 6, 2, 6, 2, 4], [color.red, color.red, color.blue, color.blue]);	// 14 34 8 40
				fg.drawTriangle([4, 4, 6, 4, 6, 6], [color.red, color.red, color.blue, color.blue]);	// 18 30 4 44
				fg.drawTriangle([4, 4, 6, 6, 4, 6], [color.green, color.yellow, color.green, color.yellow]);	// 18 30 4 44

				for (var i in fg.myRect) {
					var oRec = fg.myRect[i];
					ctx.fillStyle = oRec.fill;
					ctx.fillRect(oRec.x, oRec.y, oRec.w, oRec.h);
				}
				
				for (var i in fg.myTri) {
					var oTri = fg.myTri[i];
					ctx.beginPath();
					ctx.moveTo(oTri.x1, oTri.y1);
					ctx.lineTo(oTri.x2, oTri.y2);
					ctx.lineTo(oTri.x3, oTri.y3);
					ctx.closePath();
					ctx.strokeStyle = oTri.fill;
					ctx.fillStyle = oTri.fill;
					ctx.stroke();
					ctx.fill();
				}
			}

			$scope.reset = function() {
				var ctx = $element[0].getContext('2d');
				ctx.clearRect(0, 0, $element[0].offsetWidth, $element[0].offsetHeight);	
			}
		}
	}
});

Directives.directive('paintboard', function() {
	var drawing = false;
	return {
		restrict: "A",
		controller: function($scope, $element) {
			$scope.reset = function() {
				var ctx = $element[0].getContext('2d');
				ctx.clearRect(0, 0, $element[0].offsetWidth, $element[0].offsetHeight);	
				drawing = false;
			}
		},
		link: function(scope, element) {
			var ctx = element[0].getContext('2d')
			  , lastX
			  , lastY
			  , currentX
			  , currentY
			;
			
			element.bind('mousedown', function(event) {
				if(event.offsetX !== undefined) {
					lastX = event.offsetX;
					lastY = event.offsetY;
				} else {
					lastX = event.layerX - event.currentTarget.offsetLeft;
					lastY = event.layerY - event.currentTarget.offsetTop;
				}
			
				ctx.beginPath();
			
				drawing = true;
			});

			element.bind('mousemove', function(event) {
				if(drawing) {
					if(event.offsetX !== undefined) {
						currentX = event.offsetX;
						currentY = event.offsetY;
					} else {
						currentX = event.layerX - event.currentTarget.offsetLeft;
						currentY = event.layerY - event.currentTarget.offsetTop;
					}
					
					draw(lastX, lastY, currentX, currentY);
					
					lastX = currentX;
					lastY = currentY;
				}
			});

			element.bind('mouseup', function(event) {
				drawing = false;
			});
			
			function draw(lx, ly, cx, cy) {
				ctx.moveTo(lx,ly);
				ctx.lineTo(cx,cy);
				ctx.strokeStyle = "#5bf";
				ctx.stroke();
			}
		}
	};
});

Directives.directive('setLoginHeight', function($timeout) {
	return {
		restrict: "A",
		link: function(scope, element) {
			var resizeTimer;
			var setLoginHeight = function() {
				var midHeight = ($(window).height() - element.height() - $('.header').height() - $('.footer').height()) / 2;
				element.css('margin-top', midHeight);
			}
			
			$(window).resize(function() {
				if(resizeTimer) $timeout.cancel(resizeTimer);
				resizeTimer = $timeout(setLoginHeight, 100);
			});

			setLoginHeight();
		}
	}
});

Directives.directive('chart', function() {
	return {
		restrict: 'E',
		// replace: true,
		scope: {
			data: '='
		},
		// template: '<div class="chart"</div>',
		link: function(scope, element, attrs) {
			var chart = new google.visualization.LineChart(element[0]);
			var options = {
				width: 700,
				height:300
			};
			var data = google.visualization.arrayToDataTable(scope.data);
			chart.draw(data, options);
		}
	}
});

Directives.directive('googleChart', function() {
	return {
		restrict: "A",
		link: function(scope, element, attr) {
			var dt = scope[attr.ngModel].dataTable;
			var options = {};
			if (scope[attr.ngModel].title)
				options.title = scope[attr.ngModel].title;
			var googleChart = new google.visualization[attr.googleChart](element[0]);
			googleChart.draw(dt, options);
		}
	}
});