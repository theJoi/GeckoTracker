angular.module('geckoTracker')
.factory('GeckoDataService', function($http) {
	var geckos = [];
	return {
		getGeckos: function() {
			return geckos;
		},

		refreshGeckos: function() {
			return new Promise(function(fulfill, reject) {
				$http({
					method: 'GET',
					url: '/api/geckos'
				}).then(function success(response) {
					if (response.data.error) {
						console.log("Server side error! " + response.data.error);
						reject(reponse.data.error);
					} else {
						geckos = response.data;
						fulfill(geckos);
					}
				}, function error(response) {
					reject("Failed to contact server");
				});
			})
		},

		addGecko: function(properties) {
			return new Promise(function(fulfill, reject) {
				$http({
					method: 'POST',
					url: '/api/geckos',
					data: properties
				}).then(function success(response) {
					if (response.data.error)
						reject(response.data.error);
					else {
						geckos.push(response.data);
						fulfill(response.data);
					}
				}, function error(response) {
					reject("Failed to contact server");
				});
			});
		},

		removeGecko: function(_id) {
			return new Promise(function(fulfill, reject) {
				$http({
					method: 'DELETE',
					url: "/api/geckos/" + _id
				}).then(function success(response) {
					if(response.data.error){
						reject(response.data.error);
					} else {
						// Find gecko object in list and remove
						for(var i=0; i < geckos.length; i++) {
							if(geckos[i]._id === id){
								geckos.splice(i, 1);
								break;
							}
						}
						fulfill(_id);
					}
				}, function error(response) {
					reject("Failed to contact server");
				});
			});
		},

		updateGecko: function(properties) {
			return new Promise(function(fulfill, reject) {
				if (!properties._id) {
					reject("No _id specified");
					return;
				}

				var _id = properties._id;

				$http({
					method: 'PUT',
					url: "/api/geckos/" + properties._id,
					data: properties
				}).then(function success(response) {
					if(response.data.error){
						reject(response.data.error);
					} else {
						// Find gecko object in list and remove
						for(var i=0; i < geckos.length; i++) {
							if(geckos[i]._id === _id){
								geckos.splice(i, 1, response.data);
								break;
							}
						}
						fulfill(response.data);
					}
				}, function error(response) {
					reject("Failed to contact server");
				});
			});
		},
		
		getGeckoEvents: function(_id) {
		},
		
		createGeckoEvent: function(_id, event) {
		},
		
		deleteGeckoEvent: function(_id, event) {
		},

		updateGeckoEvent: function(_id, event) {
		}
	};
});
