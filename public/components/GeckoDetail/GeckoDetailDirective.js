/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.directive('geckoDetail', function() {
	return {
		restrict: 'E',
		templateUrl: "components/GeckoDetail/GeckoDetailTemplate.htm",
		controller: function($scope, $http, $log, geckoService) {
			$scope.geckos = [];
			$scope.isLoaded = false; // use to trigger loading spinner
			$log.debug("GeckoDetail directive's controller instantiated");

			geckoService.getGeckoDetails($scope.geckoId).then(function(gecko) {
				$scope.gecko = gecko;
                $scope.editform = gecko;
				$scope.$apply();
			});

            $scope.editGeckoTop = function () {
                $scope.editGeckoTop = true;
            };

             $scope.submitEditForm = function () {
                    console.log("submit form called");
                    console.log($scope.topform);
                    geckoService.addGecko($scope.form).then(function success(response) {
                        $scope.validationMsg = "The gecko named '" + $scope.form.name + "' has successfully been added.";
                        console.log("The gecko named '" + $scope.form.name + "' has successfully been added.");
                        $scope.showForm = false;
                        $scope.$apply();
                    }, function error(response) {
                        $scope.validationMsg = "Uh oh. Error occured, gecko not added. Please try again.";
                        console.log("Uh oh. Error occured, gecko not added. Please try again.");
                        console.log(response);
                    });
                };
		}
	};
});
