/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */
/*
|--------------------------------------------------------------------------
| public/view/GeckoList/GeckoListController.js
|--------------------------------------------------------------------------
| Angular controller to display list of geckos.
|
| Created June 2016 by Joi W.
|__________________________________________________________________________
*/
angular.module('geckoTracker').controller('GeckoListController', function ($scope, $http) {
    $scope.geckos = [];
    $scope.isLoaded = false;  // use to trigger loading spinner
    $scope.statusMsg = "Welcome to Gecko Tracker";

    // Function to populate list of geckos
    $scope.refreshGeckos = function () {
        $http({
            method: 'GET',
            url: '/api/geckos'
        }).then(function success(response) {
            if (response.data.error) {
                console.log("Server side error! " + response.data.error);
                return;
            }
            $scope.geckos = response.data;
            $scope.isLoaded = true;
        }, function error(response) {
            var msg = "Error occurred: unable to get list of geckos " + response;
            console.log(msg);
            $scope.statusMsg(msg);
        });
    };
    $scope.refreshGeckos();

    $scope.confirmDelete = function (id, name) {
        // well dialog box invocation will be
    };

    $scope.deleteGecko = function (id, name) {
        console.log("delete gecko button clicked");
        $http({
            method: 'DELETE',
            url: "/api/geckos/" + id
        }).then(function success(response) {
            if(response.data.error){
			     console.log("Server side error");
			     return;
            }
		   // Find index of gecko to delete
            for(var i = 0; i < $scope.geckos.length; i++){
                if($scope.geckos[i]._id === id){
                    $scope.geckos.splice(i, 1);
                    break;
                }
            }
            $scope.statusMsg = "The gecko named '" + $scope.form.name + "' has successfully been deleted.";
            $scope.refreshGeckos();
        }, function error(response) {
            $scope.statusMsg = "Uh oh. Error occured, gecko not added. Please try again.";
        });
    };
});
