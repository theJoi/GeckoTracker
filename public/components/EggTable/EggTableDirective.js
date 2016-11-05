angular.module('geckoTracker')
.directive('eggTable', function() {
	return {
		restrict: 'E',
        scope: {
            gecko: '=?'
        },
		templateUrl: "components/EggTable/EggTableTemplate.htm",
		controller: function($scope, $http, $log, geckoService) {
			$log.debug("EggTable directive's controller instantiated");

			$scope.geckos = [];
			
			geckoService.getGeckos().then(function(geckos) {
                $log.debug("EggTable - received geckos list", geckos);
				$scope.geckos = geckos;
                $scope.$apply();
			});
            
            $scope.estimateExpectedHatchDate = function(gecko) {
                var d = moment(gecko.dateLaid);
                d.add('days', 35);
                return d.toDate();
            }
		}
	};
})
.filter('expectedHatchDate', function(n) {
    
});

