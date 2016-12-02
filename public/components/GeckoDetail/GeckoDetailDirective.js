/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.directive('geckoDetail', function () {
	return {
		restrict: 'E',
		scope: true,
		templateUrl: "components/GeckoDetail/GeckoDetailTemplate.htm",
		controller: function ($scope, $http, $log, geckoService, $location, $timeout, toastr, ModalService) {
			$log = $log.getInstance("GeckoDetail");
			
			var detailFields = ['userId', 'status', 'morph', 'sex', 'stage', 'weight', 'location', 'mother', 'father', 'hatched', 'purchased'];
			var modifiableFields = ['userId', 'morph', 'status', 'sex', 'stage', 'location'];
			$scope.details = {};

			//var gecko = geckoService.getGeckos;
			geckoService.getGecko($scope.geckoId, function(gecko) {
				$scope.gecko = gecko;
				
				Object.assign($scope.details, $scope.gecko);
				
//				$scope.details.userId = $scope.gecko.userId;
//				$scope.details.morph = $scope.gecko.morph;
//				$scope.details.sex = $scope.gecko.sex;
//				$scope.details.location = $scope.gecko.location;
//				$scope.details.status = $scope.gecko.status;
//				$scope.details.stage = $scope.gecko.stage;
//				$scope.details.weight = $scope.gecko.currWeight;
				$scope.$watchGroup(["gecko"], function() {
					Object.assign($scope.details, $scope.gecko);
//					console.log("GECKO CHANGED");
//					$scope.details.userId = $scope.gecko.userId;
//					$scope.details.morph = $scope.gecko.morph;
//					$scope.details.sex = $scope.gecko.sex;
//					$scope.details.location = $scope.gecko.location;
//					$scope.details.status = $scope.gecko.status;
//					$scope.details.stage = $scope.gecko.stage;
				});
			});
			
			
			$scope.testIt = function() {
				alert('here');
			}
			
			$scope.stages = {
				"hatchling": "Hatchling",
				"juvenile": "Juvenile",
				"adult": "Adult",
				"egg": "Egg"
			}
			
			$scope.statuses = {
				"normal": "Normal",
				"gravid": "Gravid",
				"egg": "Egg",
				"sold": "Sold",
				"dead": "Dead"
			}
			
			$scope.sexes = {
				"male": "Male",
				"female": "Female",
				"unknown": "Unknown"
			}
			
			
			$scope.resetDetails = function() {
				for(var i=0;i < modifiableFields.length;i++) {
					var field = modifiableFields[i];
					$scope.details[field] = $scope.gecko[field];
				}
				$scope.$apply();
			}
			
			$scope.save = function() {
				// Collect modified fields
				var modified = {};
				for(var i=0;i < modifiableFields.length;i++) {
					var field = modifiableFields[i];
					if($scope.details[field] != $scope.gecko[field]) {
						modified[field] = $scope.details[field];
					}
				}
				
				modified._id = $scope.geckoId;
				console.log("UPDATING", modified);
				
				geckoService.updateGecko(modified).then(
					function(){
						console.log("MODIFIED!", $scope.gecko);
						$scope.resetDetails();
					},
					function error(err) {
						console.error("ERROR", err);
					}
				);
			}
			
			$scope.isModified = function() {
				var fields = ['userId', 'morph', 'status', 'sex'];
				if($scope.details === undefined || $scope.gecko === undefined)
					return false;
				for(var i=0;i < modifiableFields.length;i++) {
					var field = modifiableFields[i];
					if($scope.details[field] != $scope.gecko[field]) {
						//console.log("isModified", field, $scope.details[field], $scope.gecko[field]);
						return true;
					}
				}
				//console.log("isModified", "nope");
				return false;
			}
			
			geckoService.getGeckoEvents($scope.geckoId).then(function(events) {
				$scope.events = events;
				
				var lastWeight = null;
				
				for(var i=0;i < events.length;i++) {
					if(events[i].type == 'hatch') {
						$scope.details.hatched = events[i].date;
						console.log(events[i]);
						console.error(Object.assign({}, $scope));
/*					} else if(events[i].type == 'weight') {
						if(lastWeight == null || lastWeight < events[i].date) {
							lastWeight = events[i].date;
							$scope.details.weight = events[i].info.weight;
						}*/
					} else if(events[i].type === 'purchase') {
						$scope.details.purchased = events[i].date;
					}
				}
			});
			
			$scope.addWeight = function() {
				// Create a new hatched event
				ModalService.showModal({
					templateUrl: "components/AddEventForm/AddEventFormTemplate.htm",
					controller: "AddEventFormController",
					inputs: {
						event: "weight",
						geckoId: $scope.geckoId
					}
				});
			}
			
			$scope.modifyHatched = function() {
				// Look for an existing hatched event
				for(var i=0;i < $scope.events.length;i++) {
					var event = $scope.events[i];
					console.log(event.type);
					if(event.type == 'hatch') {
						// Create a new hatched event
						ModalService.showModal({
							templateUrl: "components/AddEventForm/AddEventFormTemplate.htm",
							controller: "AddEventFormController",
							inputs: {
								event: event,
								geckoId: $scope.geckoId
							}
						});
						return;
					}
				}
				// Create a new hatched event
				ModalService.showModal({
					templateUrl: "components/AddEventForm/AddEventFormTemplate.htm",
					controller: "AddEventFormController",
					inputs: {
						event: "hatch",
						geckoId: $scope.geckoId
					}
				});
			}
			
			$scope.modifyPurchased = function() {
				geckoService.getEvent($scope.geckoId, "purchase").then(function(event) {
					if(event == null)
						event = "purchase";
					ModalService.showModal({
						templateUrl: "components/AddEventForm/AddEventFormTemplate.htm",
						controller: "AddEventFormController",
						inputs: {
							event: event,
							geckoId: $scope.geckoId
						}
					});
				});
			}
			
//			// $scope.geckos = [];
//			$scope.isLoaded = false; // use to trigger loading spinner
//			$log.debug("GeckoDetail directive's controller instantiated");
//			$scope.geckos = [];
//			$log.log($scope.geckoDetail);
//			$scope.parentModal = {
//				shown: false
//			};
//
//			$scope.resetForm = function () {
//				$scope.editform = angular.copy($scope.geckoDetail);
//				$scope.edit.$setPristine();
//			};
//
//			$scope.submitEditForm = function () {
//				$log.log("submit form called");
//				$log.log($scope.editform);
//
//				// remove unchanged properties
//				for (var property in $scope.editform) {
//					if ($scope.editform.hasOwnProperty(property)) {
//						if (property !== "_id" && $scope.editform[property] === $scope.geckoDetail[property]) {
//							delete $scope.editform[property];
//							$log.log("Deleting " + property + " from update");
//						} else {
//							$scope.geckoDetail[property] = $scope.editform[property];
//						}
//					}
//				}
//				$log.log("Updating...", $scope.editform);
//				geckoService.updateGecko($scope.editform).then(function success(response) {
//					$scope.validationMsg = "The gecko named '" + $scope.editform.name + "' has successfully been updated.";
//					$log.log("The gecko named '" + $scope.editform.name + "' has successfully been updated.");
//					$scope.showEditMode = false;
//					$scope.$apply();
//				}, function error(response) {
//					//TODO: Change this to toastr message
//					$scope.validationMsg = "Uh oh. Error occured, gecko not updated. Please try again.";
//					$log.log("Uh oh. Error occured, gecko not updated. Please try again.");
//					$log.log(response);
//					toastr.error("Error updating gecko details");
//				});
//
//				$scope.showEditMode = false;
//				$scope.resetForm();
//			};
//
//			$scope.undo = function (attribute) {
//				$log.log(attribute);
//				$log.log("original value: " + $scope.geckoDetail[attribute]);
//				$scope.editform[attribute] = $scope.geckoDetail[attribute];
//				$scope.edit[attribute].$setPristine();
//			};
//
//			$scope.triggerEditMode = function () {
//				if ($scope.showEditMode) {
//					$scope.showEditMode = false;
//				} else {
//					$scope.resetForm();
//					$scope.showEditMode = true;
//				}
//				$log.log("copy birthdate: " + $scope.editform.hatchDate);
//			};
//
//			$scope.deleteGecko = function (gecko) {
//				ModalService.showModal({
//					templateUrl: "components/Modal/YesNoModalTemplate.htm",
//					controller: "YesNoModalController",
//					inputs: {
//						title: "Are You Sure?",
//						icon: "delete_forever",
//						message: "Gecko " + gecko.name + " (#" + gecko.userId + ") will be permanently deleted."
//					}
//				}).then(function(modal) {
//					modal.close.then(function(result) {
//						if(result) {
//							geckoService.removeGecko(gecko._id).then(function () {
//								$scope.statusMsg = "The gecko named '" + gecko.name + "' has successfully been deleted.";
//								$timeout(function() {
//									$location.path('/');
//								}, 0);
//								toastr.success(gecko.name + " was successfully deleted!");
//							});
//						}
//					});
//				});
//			};
//
//			$scope.showParentModal = function (gender) {
//				$log.log("show parent modal triggered.");
//				geckoService.getGeckos().then(function (geckos) {
//					$scope.geckos = geckos;
//					$scope.$apply();
//				});
//				$scope.genderFilter = gender;
//				$scope.parentModal.shown = true;
//			};
//
//			$scope.setParent = function (gender, gecko) {
//				if (gender === "female") {
//					$log.log("Mother => " + gecko._id);
//					$scope.editform.mother = {
//						_id: gecko._id,
//						name: gecko.name,
//						userId: gecko.userID
//					};
//				} else {
//					$log.log("Father => " + gecko._id);
//					$scope.editform.father = {
//						_id: gecko._id,
//						name: gecko.name,
//						userId: gecko.userID
//					};
//				}
//				$scope.parentModal.shown = false;
//			};

		}
	};
});
