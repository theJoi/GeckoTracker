/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.directive('photoGallery', function() {
	return {
		restrict: 'E',
		templateUrl: "components/PhotoGallery/PhotoGalleryTemplate.htm",
		controller: function($scope, $http, $log, geckoService, Upload, ModalService, toastr) {
			$log = $log.getInstance("PhotoGallery");
			$log.log("GeckoPhotos directive controller instantiated");
			
			geckoService.getGeckoPhotos($scope.geckoId).then(function success(photos) {
				$log.log("Loaded photos");
				$scope.photos = photos;
				
				$log.log("PHOTOS", $scope.photos);
				$log.log("PRIMARY PHOTO", $scope.geckoDetail.primaryPhoto);
				
				$scope.curPhoto = 0;
				
				$scope.$apply();
			});
			
			$scope.bumpCurrentPhoto = function(n) {
				$scope.curPhoto += n;
				if($scope.curPhoto < 0) $scope.curPhoto = $scope.photos.length - 1;
				$scope.curPhoto = $scope.curPhoto % $scope.photos.length;
			}
			
			$scope.setCurrentPhoto = function(n) {
				$scope.curPhoto = n;
			}
			
			$scope.showLightbox = function(photo) {
				$scope.options = { caption: photo.caption };
				$scope.selectedPhoto = photo;
				var index = $scope.photos.indexOf($scope.selectedPhoto);
				$scope.selectedPhotoNumber = index + 1;
			}
			
			$scope.hideLightbox = function() {
				$scope.selectedPhoto = undefined;
			}
			
			$scope.deletePhoto = function(photo) {
				ModalService.showModal({
					templateUrl: "components/Modal/YesNoModalTemplate.htm",
					controller: "YesNoModalController",
					inputs: {
						title: "Are You Sure?",
						icon: "delete_forever",
						message: "This will permanently delete the photo."
					}
				}).then(function(modal) {
					return modal.close;
				}).then(function(yesOrNo) {
					$log.debug("YES OR NO IS", yesOrNo);
					if(!yesOrNo)
						return false;
					$log.log(photo);
					return geckoService.deleteGeckoPhoto(photo._id);
				}).then(function(result) {
					$log.debug("ABORT IS", result);
					if(!result)
						return;
					for(var i=0;i < $scope.photos.length;i++) {
						if($scope.photos[i]._id == photo._id)
							$scope.photos.splice(i, 1);
					}
					toastr.success("Photo deleted.", "Success");
				});
			}

			$scope.rotatePhoto = function(dir) {
				var index = $scope.photos.indexOf($scope.selectedPhoto);
				if(dir && dir < 0) {
					index -= 1;
					if(index < 0) index = $scope.photos.length - 1;
				}
				else
					index = (index + 1) % $scope.photos.length;
				$log.log(index);
				$scope.selectedPhotoNumber = index + 1;
				$scope.selectedPhoto = $scope.photos[index];
			}
			
			$scope.setPrimaryPhoto = function(photo) {
				console.error("SET PRIMARY PHOTO", photo);
				geckoService.setPrimaryPhoto($scope.geckoId, photo._id).then(function success() {
					for(var i=0;i < $scope.photos.length;i++) {
						if($scope.photos[i]._id == photo._id) {
							$scope.geckoDetail.primaryPhoto = {
								id: photo._id,
								path: photo.path
							};
//							$scope.$apply();
						}
					}
				}, function error() {
					$log.error("Failed to set primary photo");
				});
			}
			
			$scope.setCaption = function() {
				$log.log('setCaption');
				geckoService.setPhotoCaption($scope.selectedPhoto._id, $scope.options.caption).then(
					function success(caption) {
						$log.log("Set caption worked");
						$scope.selectedPhoto.caption = caption;
					},
					function error(err) {
						$log.error("Set caption error");
					});
			}
			
			$scope.uploadFiles = function(file, errFiles) {
				if(!file)
					return;
				$log.log('uploadFiles', file);
				$log.log(Upload);
				Upload.upload({
					url: 'api/geckos/' + $scope.geckoDetail._id + '/photos',
					method: 'POST',
					file: file,
					fileFormDataName: 'photo'
				}).then(function success(response) {
					$log.log("Success", response.data);
					if($scope.photos.length == 0) {
						$scope.geckoDetail.primaryPhoto = {
							id: response.data._id,
							path: response.data.path
						};
					}
					$scope.photos.push(response.data);
				}, function error(response) {
					$log.log("Error");
				}, function progress(evt) {
					$log.log("Progress", evt);
				});
			}
			
			$scope.getAgeWhenTaken = function(photo) {
				if(photo === undefined || photo.taken == undefined)
					return "";
				var taken = moment(photo.taken);
				$log.warn($scope.geckoDetail);
				var birth = moment($scope.geckoDetail.hatchDate);
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
