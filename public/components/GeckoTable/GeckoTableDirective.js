angular.module('geckoTracker')
.directive('geckoTable', function() {
	return {
		restrict: 'E',
		templateUrl: "components/GeckoTable/GeckoTableTemplate.htm",
		controller: function($scope, $http, $log, geckoService) {
			$scope.geckos = [];
			$scope.isLoaded = false; // use to trigger loading spinner

			$log.debug("GeckoTable directive's controller instantiated");
			
			geckoService.getGeckos().then(function(geckos) {
				$scope.geckos = geckos;
				$scope.$apply();
			});
			
			$scope.confirmDelete = function (id, name) {
				if(window.confirm("Are you sure you want to delete the gecko named " + name + "?")){
				   $scope.deleteGecko(id, name);
				}
			};
		
			$scope.deleteGecko = function (id, name) {
				$log.debug("delete gecko button clicked");
				$http({
					method: 'DELETE',
					url: "/api/geckos/" + id
				}).then(function success(response) {
					if (response.data.error) {
						$log.error("Server side error");
						return;
					}
					// Find index of gecko to delete
					for (var i = 0; i < $scope.geckos.length; i++) {
						if ($scope.geckos[i]._id === id) {
							$scope.geckos.splice(i, 1);
							break;
						}
					}
					$scope.statusMsg = "The gecko named '" + name + "' has successfully been deleted.";
				}, function error(response) {
					$scope.statusMsg = "Uh oh. Error occured, gecko not added. Please try again.";
					$log.error("boo boo happened.");
				});
			};
		}
	};
});
