/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
    .directive('geckoTable', function () {
        return {
            restrict: 'E',
            templateUrl: "components/GeckoTable/GeckoTableTemplate.htm",
            controller: function ($scope, $http, $log, geckoService) {
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

                $scope.confirmDelete = function (id, name) {
                    if (window.confirm("Are you sure you want to delete the gecko named " + name + "?")) {
                        $scope.deleteGecko(id, name);
                    }
                };
                // TODO[X] Modify deleteGecko to utilize service
                $scope.deleteGecko = function (id, name) {
                    geckoService.removeGecko(id).then(function () {
                        // Find index of gecko to delete
                        for (var i = 0; i < $scope.geckos.length; i++) {
                            if ($scope.geckos[i]._id === id) {
                                $scope.geckos.splice(i, 1);
                                break;
                            }
                        }
                        $scope.statusMsg = "The gecko named '" + name + "' has successfully been deleted.";
                    });
                };
            }
        };
    });
