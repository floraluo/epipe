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
						'$cordovaFileTransfer',
						'$ionicPopup',
						"CONFIG",
						function($ionicActionSheet, $cordovaCamera, $cordovaFileTransfer,$ionicPopup,CONFIG){
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
						var host = '',
							appVersion = window.localStorage.appVersion,
							uploadOptions = {
								headers: {
									'x-app-version': appVersion
								}
							};
						if(CONFIG.serveHost){
							host = CONFIG.serveHost;
						}else {
							host = CONFIG.host;
						}
						if(index == 0){
							// 拍照
							var picOptions = {
								quality: 70, 
								destinationType: 1, 
								sourceType: 1,
								targetHeight: 300,
								targetWidth: 300,
							};
							$cordovaCamera.getPicture(picOptions)
							.then(function(imageURI){
								$cordovaFileTransfer.upload(host+"/upload/image", imageURI, uploadOptions)
								.then(function(result) {
									console.log("success")
									var response = JSON.parse(result.response);
									if(response.status){
										credentials.push(host+"/public/uploaded/"+response.data.fileName);
										hideSheet();
										$ionicPopup.alert({
											template: "上传成功",
											okText: "确认",
											okType: "button-my-balanced"
										})
									}
								}, function(err) {
									// Error
									console.log(err);
								});
							}, function(err){
								// alert(err);
								console.log(err)
							})
						}else if(index == 1){
							// 图库选择
							window.imagePicker.getPictures(
								function(results) {
									hideSheet();
									// var cre = [];
									
									for (var i = 0; i < results.length; i++) {
										// console.log('Image URI: ' + results[i]);
										// credentials.push(results[i]);
										$cordovaFileTransfer.upload(host+"/upload/image", results[i], uploadOptions)
										.then(function(result) {
											var response = JSON.parse(result.response);
											if(response.status){
												// alert(host+"/public/uploaded/"+response.data.fileName)
												alert(typeof credentials);
												// cre.push(host+"/public/uploaded/"+response.data.fileName);
												// credentials=cre;
												credentials.push(host+"/public/uploaded/"+response.data.fileName)
												// credentials.push(host+"/public/uploaded/"+response.data.fileName);
												// hideSheet();										
											}
										});
									}
								}, function (error) {
									// console.log('Error: ' + error);
									alert('imagePicker.getPictures:  '+error)
								},{
									maximumImagesCount: 3,
									width: 300,
									height: 300,
									quality: 70
								}
							);
						}
					}
				})
			})
			// scope.onHoldImg = function(index) {
			// 	var confirmPopup = $ionicPopup.confirm({
			// 		okText: '确认',
			// 		okType: 'button-balanced',
			// 		cancelText: '取消',
			// 		template: '确认要删除这张图片吗？'
			// 	});
			// 	confirmPopup.then(function(res) {
			// 		if(res) {
			// 			credentials.splice(index,1)
			// 		}
			// 	});
			// }
		}
	}							
}])