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

.directive('formFieldBigText', function () {
	return {
		restrict: 'E',
		scope: {
			label: "@",
			placeholder: "@?",
			value: "="
		},
		templateUrl: "components/FormFields/BigTextFieldTemplate.htm",
		link: function(scope, element, attrs, controller, transcludeFn) {
			var ta = element.find('textarea');
			console.debug('ta', ta);
			var hiddenDiv = element.children().children().eq(2)[0];
			console.debug("!!!!", hiddenDiv);
			
			ta.on('keypress', function() { console.debug('keypress'); });
			ta.on('change', function() { console.debug('change'); });
			ta.on('input', function() {
				console.debug('input', ta, parseInt(ta.attr('rows')));
				console.debug(ta.val().length, scope.value.length);
				console.debug('clientHeight', hiddenDiv.clientHeight);
				console.debug(hiddenDiv.offsetHeight);
				
				if(hiddenDiv.offsetHeight+1 != ta[0].offsetHeight)
					ta[0].style.height = hiddenDiv.offsetHeight+1;
				
				return;
				
				for(x in hiddenDiv)
					if(x.indexOf('eight') != -1)
						console.debug(x, hiddenDiv[x]);
				var rows = parseInt(ta.attr('rows'));
				var tmp = scope.value.split('\n').length;
				var last = tmp[tmp.length-1];
				//console.debug(scope.value.length);
				
				if(tmp != rows)
					ta.attr('rows', tmp);
				return;
				
				var content = scope.value;
				content = content.replace(/\n/g, '<br>');
				
				console.log('hidden', ta[0].clientHeight, hiddenDiv[0].clientHeight);
				ta[0].style.height = hiddenDiv[0].clientHeight;
				
				
//				var t = ta[0];
//				for(x in t)
//					if(x.indexOf('eight') != -1)
//						console.debug(x, t[x]);
//				if(t.scrollHeight > t.clientHeight)
//					t.style.height = t.scrollHeight;
//				else if(t.scrollHeight < t.clientHeight)
//					t.style.height = t.clientHeight;
			});
		},
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
