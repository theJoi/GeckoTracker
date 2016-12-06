angular.module('geckoTracker')
.directive('geckoTimeline', function () {
	return {
		restrict: 'E',
		scope: {
			geckoId: "="
		},
		templateUrl: "components/GeckoTimeline/GeckoTimelineTemplate.htm",
		link: function(scope, element, attrs, controller, transcludeFn) {
			element = $(element);
			console.debug("!!!!!!!!!!!!!!!!!", element, element.find('h1'), element.find('.timeline-container').children());
			
			scope.$watch('events', function() {
				var earliest=null, latest=null;
				var labels = element.find('label');
				
				labels.each(function(i, label) {
					label = $(label);
					console.log("@@@@@", label.attr('id'));
				});
//				
//				for(var i=0;i < labels.length;i++) {
//					var label = labels.get(i);
//					console.log("@@@@@@@@@@@@@@", label);
//					var id = label.attr('id');
//					console.log("IDDDDDDDDDDDDDDD", id);
//				}
//				
//				element.find('label').each(function(i, label) {
//					console.log("@@@@@@@@@@", label);
//					
//				});
			});
//			
//			element.find("label").each(function(a) {
//				console.log("@@@@@@@@@@@@", a);
//			})
		},
		controller: function ($scope, $log, geckoService) {
			//$log = $log.getInstance("GeckoTimeline");
			$log.error("GeckoTimeline", $scope.geckoId);
			
			geckoService.getGeckoEvents($scope.geckoId).then(function(events) {
				$scope.events = events;
				
				$scope.earliest = null;
				$scope.latest = null;
				for(var i=0;i < events.length;i++) {
					var m = moment(events[i].date);
					if($scope.earliest === null || $scope.earliest > m)
						$scope.earliest = m;
					if($scope.latest === null || $scope.latest < m)
						$scope.latest = m;
				}
			});
			
			$scope.getMarkers = function() {
				var start = $scope.earliest;
				start = moment(start).add(1, 'M').startOf('month');
				var markers = [];
				while(start < $scope.latest) {
					markers.push(start.format("MMM YYYY"));
					//console.log(start.toString());
					start = start.add(1, 'M');
				}
				return markers;
			}
			
			$scope.calcTimelineSize = function() {
					return {};
				if(!$scope.earliest || !$scope.latest)
					return {};
				var early = $scope.earliest;
				var late = $scope.latest;
				var diff = late.diff(early, 'days');
				console.log("diffffffffffffffffff", diff);
				return {
					width: (diff * 10) + 'px'
				}
			}
			
			$scope.positionDate = function(m) {
				var early = $scope.earliest.unix();
				var late = $scope.latest.unix();
				m = moment(m).unix();
				var p = 100.0 * (m - early) / (late - early);
				p *= 0.9;
				return {left: p + "%"};
			}
			
			$scope.eventStyle = function(i, event) {
				var early = $scope.earliest.unix();
				var late = $scope.latest.unix();
				var m = moment(event.date).unix();
				var p = 100.0 * (m - early) / (late - early);
				p *= 0.9;
				//var h = (31 - moment(event.date).date());
				var h = (i % 5) * 20 + 15;
//				console.log(moment(event.date).date());
				return {
					left: p + "%",
					bottom: h + 'px'
				}
			}
		}
	}
});

