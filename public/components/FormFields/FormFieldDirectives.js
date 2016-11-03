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
				$scope.selected = date;
				$scope.showCalendar = false;
			}
			
			$scope.hideCalendar = function() {
				$scope.showCalendar = false;
			}
			$scope.getSelectedText = function() {
				if($scope.selected)
					return $scope.selected.format("dddd, MMMM Do, YYYY");
				else
					return $scope.placeholder;
			}
			
			window.calendar_selected = $scope.selected;
			
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
});
