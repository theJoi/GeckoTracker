angular.module('geckoTracker')
.directive('eggTable', function() {
	return {
		restrict: 'E',
        scope: {
            id: '@geckoId'
        },
		templateUrl: "components/EggTable/EggTableTemplate.htm",
		controller: function($scope, $http, $log, geckoService) {
			$scope.geckos = [];
			$scope.isLoaded = false; // use to trigger loading spinner

			$log.debug("EggTable directive's controller instantiated");
			
			geckoService.getGeckos().then(function(geckos) {
                $log.debug("EggTable - received geckos list", geckos);
				$scope.geckos = geckos;
                $scope.$apply();
			});
            
            $scope.estimateExpectedHatchDate = function(gecko) {
                var d = moment(gecko.dateLaid);
                d.add('days', 35);
                return d.toString();
            }
		}
	};
})
.filter('expectedHatchDate', function(n) {
    
});

