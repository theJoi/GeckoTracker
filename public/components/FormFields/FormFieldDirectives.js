/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.directive('formFieldText', function () {
	return {
		restrict: 'E',
		scope: {
			label: "@",
			placeholder: "@?",
			value: "="
		},
		templateUrl: "components/FormFields/TextFieldTemplate.htm",
		controller: function ($scope, $log) {
			if(!$scope.placeholder)
				$scope.placeholder = $scope.label;
		}
	};
})

.directive('formFieldNumber', function () {
	return {
		restrict: 'E',
		scope: {
			label: "@",
			placeholder: "@?",
			value: "="
		},
		templateUrl: "components/FormFields/NumberFieldTemplate.htm",
		controller: function ($scope, $log) {
			if(!$scope.placeholder)
				$scope.placeholder = $scope.label;
		}
	};
})

.directive('formFieldSelect', function () {
	return {
		restrict: 'E',
		scope: {
			label: "@",
			placeholder: "@?",
			value: "=",
			options: "="
		},
		templateUrl: "components/FormFields/SelectFieldTemplate.htm",
		controller: function ($scope, $log) {
			if(!$scope.placeholder)
				$scope.placeholder = $scope.label;
			
			$scope.getSelectedText = function() {
				return $scope.value ? $scope.value : $scope.placeholder;
			}
			
			$scope.select = function(value) {
				$scope.value = value;
				$scope.showDropdown = false;
			}
			
			$scope.hideDropdown = function() {
				$scope.showDropdown = false;
			}
		}
	};
})

.directive('formFieldDate', function () {
	return {
		restrict: 'E',
		scope: {
			label: "@",
			placeholder: "@?",
			value: "="
		},
		templateUrl: "components/FormFields/DateFieldTemplate.htm",
		controller: function ($scope, $log) {
			if(!$scope.placeholder)
				$scope.placeholder = $scope.label;
			
			$scope.month = moment().month();
			$scope.year = moment().year();
			$scope.today = moment().startOf('day');
			
			if($scope.value)
				$scope.firstDay = $scope.value.startOf('month');
			else
				$scope.firstDay = moment().startOf('month');
			
			$scope.enteredText = "fdsa";
			
			$scope.bumpMonthUp = function() {
				$scope.firstDay = $scope.firstDay.add(1, 'M');
				$scope.calendar = buildCalendarArray();
			}
			$scope.bumpMonthDown = function() {
				$scope.firstDay = $scope.firstDay.add(-1, 'M');
				$scope.calendar = buildCalendarArray();
			}
			
			$scope.setSelected = function(date) {
				$scope.value = date;
				$scope.showCalendar = false;
			}
			
			$scope.hideCalendar = function() {
				$scope.showCalendar = false;
			}
			$scope.getSelectedText = function() {
				if($scope.value)
					return $scope.value.format("dddd, MMMM Do, YYYY");
				else
					return $scope.placeholder;
			}
			
			window.calendar_selected = $scope.value;
			
			function buildCalendarArray() {
				var a = [];
				var d = $scope.firstDay;
				dt = moment(d).startOf('week');
				var c;
				var n = 0;
				while(true) {
					if(n % 7 == 0) {
						c = [];
						a.push(c);
					}
					c.push({
						dayOfWeek: n % 7,
						dayOfMonth: dt.date(),
						isMonth: dt.month() == d.month(),
						date: moment(dt)
					});
					dt.add(1, 'd');
					if(dt.day() == 0 && n > 31 && dt.month() != d.month() || n > 50)
						break;
					n++;
				}
				console.log("CALENDAR", a);
				window.calendar = a;
				return a;
			}
			
			$scope.calendar = buildCalendarArray();
		}
	};
})

.filter('capitalize', function() {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
})
