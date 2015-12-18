angular.module('starter.directive' , [])
.directive('supplierRelease', ['$timeout',function($timeout){
	return {
		restrict: "E",
		link: function($scope, $element){
			
			// var addKey = document.getElementsByClassName("j-add-keywords"),
			// 	releaseButton = document.getElementsByClassName('j-release-keywords');
			// angular.element(addKey).on('click', function(){
			// 	$timeout(function(){
			// 		$scope.keywords.push("")
			// 	},10)
			// });
			// angular.element(releaseButton).on('click',function(){})
		}
	}
}])
.directive('repeat',[function(){
	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ctrl){
			if(ctrl) {
				var otherInput = element.inheritedData("$formController")[attrs.repeat];
				var repeatValidator = function(value){
					var validity = value === otherInput.$viewValue;
					ctrl.$setValidity('repeat', validity);
					return validity ? value : undefined;
				}
				ctrl.$parsers.push(repeatValidator);
				ctrl.$formatters.push(repeatValidator);
				otherInput.$parsers.push(function (value) {
					ctrl.$setValidity("repeat", value === ctrl.$viewValue);
					return value;
				});
			}
		}
	}
}])
.directive('selectImg', ['$ionicActionSheet', 
						'$cordovaCamera',
						function($ionicActionSheet, $cordovaCamera){
	return {
		restrict: 'A',
		link: function(scope, element){
			element.bind('click', function(){
				var hideSheet = $ionicActionSheet.show({
					buttons: [
						{text: '拍照'},
						{text: '从图库选择'}
					],
					buttonClicked: function(index){
						if(index == 0){
							var options = {
								quality: 50, 
								destinationType: 1, 
								sourceType: 1,
								targetHeight: 200,
								targetWidth: 200,
							};
							$cordovaCamera
							.getPicture(options)
							.then(function(imageURI){
								scope.userRegisInfo.myCredentials.push(imageURI);
								hideSheet();
							}, function(err){
								alert(err);
							})
						}else if(index == 1){
							window.imagePicker.getPictures(
								function(results) {
									hideSheet();
									for (var i = 0; i < results.length; i++) {
										// console.log('Image URI: ' + results[i]);
										scope.userRegisInfo.myCredentials.push(results[i]);
									}
								}, function (error) {
									// console.log('Error: ' + error);
									alert('imagePicker.getPictures:  '+error)
								}
							);
						}
					}
				})
			})
		}
	}							
}])