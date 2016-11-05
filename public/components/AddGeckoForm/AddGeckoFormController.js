/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.controller("AddGeckoFormController", function($scope, geckoService, ModalService, toastr, close) {
	$scope.form = {
		name: "",
		userId: "",
		stage: "unknown",
		status: "unknown",
		sex: "unknown",
		morph: "",
		purchaseDate: "",
		hatchDate: "",
		location: "",
		currWeight: "",
		mother: "",
		father: ""
	};

	$scope.submitForm = function () {
		geckoService.addGecko($scope.form).then(function success(response) {
			console.log("ADD GECKO FORM SUCCESS");
			toastr.success($scope.form.name + " added.", "Success");
			$scope.$apply();
			close();
		}, function error(response) {
			console.log("ADD GECKO FORM ERROR");
			toastr.error("Something went wrong!", "Error");
			close();
		});
	};
	
	$scope.close = close;
	
	$scope.showParentModal = function (gender) {
		ModalService.showModal({
			templateUrl: "components/GeckoPicker/GeckoPickerTemplate.htm",
			controller: "GeckoPickerController",
			inputs: {
				gender: gender
			}
		}).then(function(modal) {
			modal.close.then(function(gecko) {
				if(gecko != null) {
					if(gender == 'female') {
						$scope.form.mother = {
							_id: gecko._id,
							name: gecko.name,
							userId: gecko.userId
						};
					} else {
						$scope.form.father = {
							_id: gecko._id,
							name: gecko.name,
							userId: gecko.userId
						};
					}
				}
			});
		});
	};
});

