/*jshint globals: true, undef: true, browser: false, node: true*/
/* globals angular */

angular.module('geckoTracker', []).controller('GeckoListController', function($scope, $http){
        $scope.geckos = [];
        $scope.isLoaded = false;

        $http({
            method: 'GET',
            url: '/geckos'
        }).then(function success(response) {
            if(response.data.error) {
                console.log("Server side error! " + response.data.error);
                return;
            }
            $scope.geckos = response.data;
            $scope.isLoaded = true;
        }, function error(response) {
            console.log("Error occurred: unable to get list of geckos " + response);
        });
});
/*
.controller('GeckoListController', function($scope) {
	$scope.geckos = [
		{
			name: "Locke",
			sex: 'male',
			status: 'normal',
			morph: 'Lavender Jungle Bandit',
			birthdate: new Date('5/1/2015'),
			weight: 57
		},{
			name: "Sabetha",
			sex: 'female',
			status: 'gravid',
			morph: 'Lavender Jungle Bandit',
			birthdate: new Date('5/1/2015'),
			weight: 63
		},{
			name: "Eggbert",
			sex: 'unknown',
			status: 'egg',
			morph: 'unknown',
			weight: 20
		},{
			name: "Locke Jr.",
			sex: 'male',
			status: 'egg',
			morph: 'Lavender Jungle Bandit',
			birthdate: 'unknown',
			weight: 21
        },{
			name: "Mystery Girl",
			sex: 'female',
			status: 'normal',
			morph: 'unknown',
			birthdate: new Date('6/21/2016'),
			weight: 29
		}
	];
});
*/
