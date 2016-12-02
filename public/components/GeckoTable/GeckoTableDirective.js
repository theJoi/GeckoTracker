/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
    .directive('geckoTable', function () {
        return {
            restrict: 'E',
            templateUrl: "components/GeckoTable/GeckoTableTemplate.htm",
            controller: function ($scope, $http, $log, geckoService, ModalService, toastr) {
                $scope.geckos = [];
                $scope.isLoaded = false;    // use to trigger loading spinner

                $log.debug("GeckoTable directive's controller instantiated");

                /* Variables used for search and filter */
                $scope.sortType = 'name';   // set the default sort type
                $scope.sortReverse = false; // set the default sort order
                $scope.searchTerm = '';     // set the default search/filter term

				geckoService.getGeckos().then(function (geckos) {
                    $scope.geckos = geckos;
                    $scope.$apply();
                });

                $scope.confirmDelete = function (gecko) {
                    ModalService.showModal({
                        templateUrl: "components/Modal/YesNoModalTemplate.htm",
                        controller: "YesNoModalController",
                        inputs: {
                            title: "Are You Sure?",
                            icon: "delete_forever",
                            message: "Gecko " + gecko.name + " (#" + gecko.userId + ") will be permanently deleted."
                        }
                    }).then(function(modal) {
                        modal.close.then(function(result) {
                            if(result)
                                $scope.deleteGecko(gecko._id, gecko.name);
                        });
                    });
                };
                
                $scope.deleteGecko = function (id, name) {
                    geckoService.removeGecko(id).then(function () {
                        // Find index of gecko to delete
                        for (var i = 0; i < $scope.geckos.length; i++) {
                            if ($scope.geckos[i]._id === id) {
                                $scope.geckos.splice(i, 1);
                                break;
                            }
                        }
						toastr.success(name + " has been deleted.", "Success");
                    });
                };
				
				$scope.showAddGeckoModal = function() {
					ModalService.showModal({
						templateUrl: "components/AddGeckoForm/AddGeckoFormTemplate.htm",
						controller: "AddGeckoFormController",
					});
				}
				
				$scope.getAge = function(gecko) {
					if(!gecko.hatchDate) return "";
					var m = moment(gecko.hatchDate);
					return m.fromNow(true);
				}
            }
        };
    });
