
angular.module('geckoTracker', [])

.controller('GeckoListController', function($scope) {
	$scope.geckos = [
		{
			name: "Locke",
			sex: 'male',
			status: 'normal',
			morph: 'Lavender Jungle Bandit',
			birthdate: new Date('5/1/2015'),
			weight: 57
		},
		{
			name: "Sabetha",
			sex: 'female',
			status: 'gravid',
			morph: 'Lavender Jungle Bandit',
			birthdate: new Date('5/1/2015'),
			weight: 63
		}
	];
});
