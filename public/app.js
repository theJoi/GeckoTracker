
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
