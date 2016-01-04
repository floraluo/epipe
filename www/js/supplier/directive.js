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
.directive('hideTabs', ['$rootScope',function($rootScope){
	return {
		restrict: "A",
		scope: {},
		link: function(scope, element, attr){
			scope.$watch(attr.hideTabs, function(value){
				$rootScope.main.hideTabs = value;
			});
			scope.$on('$destroy', function() {
				$rootScope.main.hideTabs = false;
			});
			// if(element[0].nodeName == "INPUT"){
				// element.bind('click', function(){
				// 	$rootScope.hideTabs = true;
				// 	// console.log(attr.index + "focus  "+ $rootScope.hideTabs)
				// });
				// element.bind('blur', function(){
				// 	$rootScope.hideTabs = false;
				// 	// console.log(attr.index + "blur  "+ $rootScope.hideTabs)
				// })
			// }else{
				// scope.$watch(attr.hideTabs, function(value){
				// 	$rootScope.hideTabs = value;
				// });
				// scope.$on('$destroy', function() {
				// 	$rootScope.hideTabs = false;
				// });
			// }
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
						'$ionicPopup',
						function($ionicActionSheet, $cordovaCamera,$ionicPopup){
	return {
		restrict: 'A',
		link: function(scope, element){
			element.bind('click', function(){
				var hideSheet = $ionicActionSheet.show({
					buttons: [
						{text: '<i class="icon ion-android-camera positive"></i>拍照'},
						{text: '<i class="icon ion-android-image royal"></i>从图库选择'}
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
								},{
									// maximumImagesCount: 3,
									width: 260,
									height: 260,
									quality: 70
								}
							);
						}
					}
				})
			})
			scope.onHoldImg = function(index) {
				var confirmPopup = $ionicPopup.confirm({
					okText: '确认',
					okType: 'button-balanced',
					cancelText: '取消',
					template: '确认要删除这张图片吗？'
				});
				confirmPopup.then(function(res) {
					if(res) {
						scope.userRegisInfo.myCredentials.splice(index,1)
					}
				});
			}
		}
	}							
}])