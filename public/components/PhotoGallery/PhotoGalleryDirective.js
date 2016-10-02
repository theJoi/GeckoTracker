/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.directive('photoGallery', function() {
	return {
		restrict: 'E',
		templateUrl: "components/PhotoGallery/PhotoGalleryTemplate.htm",
		controller: function($scope, $http, $log, geckoService, Upload) {
			console.log("GeckoPhotos directive controller instantiated");
			
			geckoService.getGeckoPhotos($scope.geckoId).then(function success(photos) {
				console.log("Loaded photos");
				$scope.photos = photos;
				
				$scope.$apply();
			});
			
			$scope.showLightbox = function(photo) {
				$scope.options = { caption: photo.caption };
				$scope.selectedPhoto = photo;
				var index = $scope.photos.indexOf($scope.selectedPhoto);
				$scope.selectedPhotoNumber = index + 1;
			}
			
			$scope.hideLightbox = function() {
				$scope.selectedPhoto = undefined;
			}
			
			$scope.rotatePhoto = function(dir) {
				var index = $scope.photos.indexOf($scope.selectedPhoto);
				if(dir && dir < 0) {
					index -= 1;
					if(index < 0) index = $scope.photos.length - 1;
				}
				else
					index = (index + 1) % $scope.photos.length;
				console.log(index);
				$scope.selectedPhotoNumber = index + 1;
				$scope.selectedPhoto = $scope.photos[index];
			}
			
			$scope.setPrimaryPhoto = function(photo) {
				geckoService.setPrimaryPhoto($scope.geckoId, photo._id).then(function success() {
					console.log("Successfully set primary photo");
				}, function error() {
					console.error("Failed to set primary photo");
				});
			}
			
			$scope.setCaption = function() {
				console.log('setCaption');
				geckoService.setPhotoCaption($scope.selectedPhoto._id, $scope.options.caption).then(
					function success(caption) {
						console.log("Set caption worked");
						$scope.selectedPhoto.caption = caption;
					},
					function error(err) {
						console.error("Set caption error");
					});
			}
			
			$scope.uploadFiles = function(file, errFiles) {
				if(!file)
					return;
				console.log('uploadFiles', file);
				console.log(Upload);
				Upload.upload({
					url: 'api/geckos/' + $scope.geckoDetail._id + '/photos',
					method: 'POST',
					file: file,
					fileFormDataName: 'photo'
				}).then(function success(response) {
					console.log("Success", response.data);
					$scope.photos.push(response.data);
				}, function error(response) {
					console.log("Error");
				}, function progress(evt) {
					console.log("Progress", evt);
				});
			}
			
			$scope.getAgeWhenTaken = function(photo) {
				var taken = moment(photo.taken);
				console.warn($scope.geckoDetail);
				var birth = moment($scope.geckoDetail.birthdate);
				return moment.duration(taken.diff(birth)).humanize();
			}
			/*
            geckoService.getMetrics().then(function(metrics) {
                $scope.metrics = metrics;
                $scope.$apply();
            });
			*/
		}
	};
})

.filter('geckoAge', function () {
	return function (val) {
		if(typeof(val) == 'string') {
			return moment(val).toNow(true);
		} else if(typeof(val) == 'object' && val.getDate) {
			return moment(val).toNow(true);
		}
		return val;
	};
});
