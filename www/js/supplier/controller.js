angular.module('starter.controller' , [])

.controller('SupplierCtrl', ['$rootScope', '$scope', '$state','$ionicHistory', '$ionicTabsDelegate',
			 function($rootScope, $scope, $state,$ionicHistory, $ionicTabsDelegate){

	$rootScope.myGoBack = function(){
		var backViewName = $ionicHistory.viewHistory().backView.stateName;
		if( backViewName == 'supplier.quotation'){
			// $rootScope.$ionicGoBack (-2)
			$ionicHistory.goBack(-2);
			window.location.reload();
		}

		if(backViewName != 'supplier.logisticsTracking'){
			$ionicTabsDelegate.showBar(true);
		}
		// $rootScope.$ionicGoBack (-1)
		$ionicHistory.goBack();
	}
	// $rootScope.sideMunus = true;
	$rootScope.main = {};
	// 是否滑动内容区域打开side menu
	$rootScope.main.dragContent = true;
	// 是否隐藏tabs
	$rootScope.main.hideTabs = false;
}])
    .controller('homeCtrl', ['$scope','$ionicHistory','$rootScope', function($scope, $ionicHistory, $rootScope) {
    	// 禁用登录、注册页滑动打开侧边栏
    	$rootScope.main.dragContent = false;

    	// 禁用下一个页面返回按钮
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
    }])
    // 登录
	.controller('loginCtrl', ['$scope', '$rootScope', '$ionicPopup', 'httpService', '$state', 
		function($scope, $rootScope, $ionicPopup, httpService, $state) {
		// 禁止滑动打开侧边栏
		$rootScope.main.dragContent = false;

	    $scope.user = {
	        name: '',
	        password: ''
	    };

	    $scope.supplier = {
	    	show_error: false
	    	// ,
	     //    noRegiste: false,
	     //    validPassword: true
	    }
	    // $scope.changeValidPassword = function() {
	    //     $scope.validPassword = false;
	    // }
	    $scope.supplierLogin = function(myform) {
	    	$scope.supplier.show_error = true;

	        if (myform.$valid) {
	            httpService.post('/user/login', {
	                phone: $scope.user.name,
	                password: $scope.user.password,
	                userType: "供应商"
	            }).success(function(data) {
	                if (data.status) {
	                    console.log('success');
	                    window.localStorage.token = data.token;
	                    $state.go("supplier.release");
	                } else {
	                    // if(data.user == null){
	                    // 	$scope.supplier.noRegiste = true;
	                    // }
	                    $ionicPopup.alert({
	                        template: "用户名或密码错误"
	                    })
	                }
	            });
	        }
	    }
	}])
	// 注册
    .controller('registerCtrl', ['$scope','$interval', '$rootScope', '$state', '$cordovaCamera', '$ionicActionSheet','httpService','$ionicPopup',
        function($scope, $interval, $rootScope, $state, $cordovaCamera, $ionicActionSheet,httpService,$ionicPopup) {

            $scope.userRegisInfo = {
            	userType: '供应商',
                phone: '',
                code: '',
                password: '',
                // repassword: '',
                userProfile: {
                	company: ''
                	// ,
                	// myCredentials: []
                }
            }
            $scope.show_error = false;
            $scope.code_is_error = false;
            $scope.captcha = {
            	text: "获取验证码",
            	disabled: false
            };
            $scope.interval = 40;

            // $scope.ready = false;
            // $rootScope.$watch('appReady.status', function() {
            //     if ($rootScope.appReady.status) $scope.ready = true;
            // });

            // 检查手机号是否已注册
            $scope.supplierCheckPhone = function(phone){
            	httpService.get("/user/checkPhone/" + phone).success(function(data){
            		if(!data.status) {
            			console.log('success');
            		}else {
            			$ionicPopup.alert({
            				template: "电话号码已存在"
            			})
            		}
            	})
            }

            // 获取验证码
            $scope.fetchCaptcha = function(){
            	httpService.post("/user/sendPhoneToken",{
            		phone: $scope.userRegisInfo.phone
            	}).success(function(data){
            		console.log(data)
            		$scope.code = 201601;
            		$scope.captcha = {
        				disabled: true,
        				text: $scope.interval+" 秒之后重新获取"
        			}
            		$scope.timer();
            	})
            }

            // 验证验证码
            $scope.verifyCode = function(code){
            	console.log("userRegisInfo.code: "+ $scope.userRegisInfo.code +"     $scope.code: "+$scope.code )
            	// 判断验证码是否正确
                if($scope.userRegisInfo.code != $scope.code){
                	$scope.code_is_error = true;
                }else{
                	$scope.code_is_error = false;
                }
            }

            // 计时器
            $scope.timer = function(){
            	var time=$scope.interval,stopTime;
            	function updateTime () {
            		time--;
            		$scope.captcha.text = time+" 秒之后重新获取";
            		if(time == 0){
            			$scope.captcha = {
            				disabled: false,
            				text: "获取验证码"
            			}
            			$interval.cancel(stopTime);
            		}
            	}
            	stopTime = $interval(updateTime, 1000);
            }
            $scope.supplierRegiste = function(myform) {
                $scope.show_error = true;
                if (myform.$dirty) {
                    if (myform.$valid) {                      

                        httpService.post("/user/regist", $scope.userRegisInfo).success(function(data) {
                            if (data.status) {
                                $state.go("supplier.login");
                            } else {                                
                                $ionicPopup.alert({
                                    template: data.errMsg
                                })
                            }
                        });
                    }
                }
            }
        }
    ])
	// 个人中心
	.controller('personalCtrl',['$scope','$ionicPopup', '$rootScope', 'httpService','$state' ,
		function($scope, $ionicPopup, $rootScope, httpService, $state){

		$rootScope.$watch('appReady.status', function() {
		    if ($rootScope.appReady.status) $scope.ready = true;
		});

		$scope.supplier = {
	    	userType: '供应商',
	        userProfile: {
	        	company: ''
	        }
	    }
	    $scope.$on('$ionicView.beforeEnter', function() {
			httpService.get("/user/getProfile")
			.success(function(data){
				var profile = data.data;
				$scope.supplier = {
					company: profile.company,
					phone: profile.phone
				}
			})
		});

		$scope.show_error = false;

		$scope.supplierModPerInfo = function(myform){		
			$scope.show_error = true;
			if(myform.$valid){

				if(myform.$dirty){
					httpService.post("/user/changeProfile",$scope.supplier)
					.success(function(data){
						if(data.status){
							var promise = $ionicPopup.alert({
								template: "修改成功！",
								okText: "确认"
							})
							promise.then(function(data){
								if(data){
									$state.go("supplier.personal");				
								}
							})
						}
					})
				}

				// window.location.reload();
			}
		}
	}])
	// 修改密码
	.controller('ModifyPasswordCtrl', ['$scope', '$ionicPopup', "httpService" , '$state',
		function($scope, $ionicPopup, httpService, $state){
		$scope.supplier = {
			userType: '供应商',
			oldPassword: '',
			newPassword: ''
		}
		$scope.show_error = false;
		$scope.supplierModPassword = function(myform){
			$scope.show_error = true;
			if(myform.$valid){
				if(myform.$dirty){
					httpService.post("/user/changePassword",{
						oldPassword: $scope.supplier.oldPassword,
						newPassword: $scope.supplier.newPassword
					})
					.success(function(data){
						if(data.status){
							var promise = $ionicPopup.alert({
								template: "密码修改成功！",
								okText: "确认"
							})
							promise.then(function(data){
								if(data){
									$state.go("supplier.personal");
								}
							})
						}else {
							$ionicPopup.alert({
								template: data.errMsg,
								okText: "确认"
							})
						}
					})
				}
			}
		}
	}])
	// 发布关键字
	.controller('releaseCtrl', ['$scope','$ionicPopup', 'httpService', '$rootScope', '$timeout', function($scope, $ionicPopup, httpService, $rootScope, $timeout){
		$rootScope.main.dragContent = true;

		$scope.keywords=["", "", ""];
		$scope.addKeywords = function(){
			$timeout(function(){
				$scope.keywords.push("")
			},10)
		};
		$scope.cleanArray = function(array){
			var newArray = [];
			for(var i=0; i<array.length; i++){
				if(array[i]){
					newArray.push(array[i]);
				}
			}
			return newArray;
		}
		$scope.releaseKeywords = function(){
			var cleanArray = $scope.cleanArray($scope.keywords);
			httpService.post("/keywords/setKeywords",{
				keywords: cleanArray
			})
			.success(function(data){
				if(data.status){
					var keywordsStr = cleanArray.toString();
					$ionicPopup.alert({
						title: "发布成功",
						template:keywordsStr
					});
					$scope.keywords=["", "", ""];
				}
			})
		}
	}])

	// 订单列表
	.controller('orderListCtrl', ['$scope','httpService', '$state', '$stateParams', '$ionicPopup','$http',
		function($scope, httpService, $state, $stateParams,$ionicPopup, $http){
		$scope.order = {
			canBeLoaded: false,
			content: [],
			startTime: '',
			endTime: '',
			date: new Date().toISOString(),
			count: 10
		};

		httpService.get("/order/getMyOldOrders/" + $scope.order.date +"/" +$scope.order.count)
		.success(function(order){
			if(order.status){
				$scope.order.content = order.data;
				$scope.order.endTime = order.data[0].createdOn;
				$scope.order.startTime = order.data[$scope.order.count-1].createdOn;
				$scope.order.canBeLoaded = true;
			}
		})
		// $http
		// .get("../data/orderList.json")
		// .success(function(data){
		// 	$scope.order.content = data;
		// })
		// .error(function(){

		// })
		$scope.amount = 0;//测试数据

		// 刷新订单列表
		$scope.loadNewOrderList = function(){
			httpService.get("/order/getMyNewOrders/" + $scope.order.endTime)
			.success(function(order){
				console.log("length"+order.data.length)
				if(order.status && order.data.length >0 ){
					// $scope.order.content.unshift(order.data);
					$scope.order.content = order.data.concat($scope.order.content)
					$scope.order.endTime = order.data[0].createdOn;
				}
			})
			.finally(function() {
				// Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
		// 加载更多订单数据
		$scope.loadMoreOrder = function(){
			// if($scope.order.canBeLoaded){			
				httpService.get("/order/getMyOldOrders/" + $scope.order.startTime +"/" +$scope.order.count)
				.success(function(order){
					var len = order.data.length;
					if(order.status && len >0 ){
						// $scope.order.content.unshift(order.data);
						$scope.order.content = $scope.order.content.concat(order.data)
						$scope.order.startTime = order.data[len-1].createdOn;
					}else {
						$scope.order.canBeLoaded = false;
						$ionicPopup.alert({
							template: "没有更多数据了！"
						})					
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				})
			// }else {
			// }
		}
	}])
	// 报价
	.controller('quotationCtrl', ['$scope', '$ionicPopup', 'httpService', '$state', '$stateParams','$ionicHistory', '$ionicTabsDelegate', 
		function($scope, $ionicPopup, httpService, $state, $stateParams, $ionicHistory, $ionicTabsDelegate){

		// 隐藏tabs
		$ionicTabsDelegate.showBar(false);

		// show_error：是否显示错误提示
		$scope.show_error = false;
		$scope.quo = {
			btnText: "报价",
			isFirst: false
		}
		$scope.productQuo = {
			unitPrice: '',
			totalPrice: ''
		}
		// 订单信息
		httpService.get('/order/getByOrderName/'+$stateParams.orderId)
		.success(function(data){
			$scope.order = data.data;
		})
		// 报价记录
		httpService.get('/order/getSupQuotation/'+$stateParams.orderId)
		.success(function(data){
			if(data.status){
				var quotation = data.data;
				$scope.productQuo = {
					unitPrice: quotation.unitPrice,
					totalPrice: quotation.sumPrice
				}
				$scope.quo.btnText = "修改报价";
			}else {
				$scope.quo.isFirst = true;
			}
		})

		// 计算总价
		$scope.canlTotalPrice = function(orderNum){
			$scope.productQuo.unitPrice = parseInt($scope.productQuo.unitPrice) > 0 ? $scope.productQuo.unitPrice : '';
			$scope.productQuo.totalPrice = $scope.productQuo.unitPrice*orderNum !=0 ? $scope.productQuo.unitPrice*orderNum : ''
		}

		// 报价
		$scope.quotation = function(myform){
			if(myform.$dirty){
				$scope.show_error = true;
				if(myform.$valid){
					httpService.post("/order/setQuotation", {
						unitPrice: $scope.productQuo.unitPrice,
						sumPrice: $scope.productQuo.totalPrice,
						orderName: $stateParams.orderId
					})
					.success(function(data){
						if(data.status){
							var promise = $ionicPopup.alert({
								template: "报价完成，返回订单列表",
								okText: "确认"
							});
							promise.then(function(data){
								if(data){
									$state.go("supplier.orderList");								
								}
							})
						}
					})
				}
			}
		}
	}])
	// 订单详情
	.controller('orderDetailCtrl', ['$scope','httpService','$stateParams', '$ionicHistory', '$ionicTabsDelegate', 
			function($scope, httpService, $stateParams, $ionicHistory, $ionicTabsDelegate){
		// 隐藏tabs
		$ionicTabsDelegate.showBar(false);
		// $scope.order = order[$stateParams.orderId]
		// $ionicHistory.goBack(-1);
		// $scope.$on("$ionicView.enter", function () {
		//    $ionicHistory.clearCache();
		//    $ionicHistory.clearHistory();
		// });

		// 订单信息
		httpService.get('/order/getByOrderName/'+$stateParams.orderId)
		.success(function(data){
			$scope.order = data.data;
		})
	}])
// 物流跟踪
.controller('LogisTrackCtrl', ['$scope','$http','$stateParams', '$ionicTabsDelegate', function($scope, $http,$stateParams, $ionicTabsDelegate){
	// 隐藏tabs
	$ionicTabsDelegate.showBar(false);

	$http.get("../data/transit_step.json")
	.success(function(data){
		$scope.transit = data;
		$scope.thisOrder = data.orderInfo;	
	})
	// $http.get("../data/orderDetail"+$stateParams.orderId+".json")
	// .success(function(data){
	// 	$scope.thisOrder = data;
	// })
}])
.controller('tabsCtrl', function($scope, $rootScope, $state) {
	$rootScope.$on('$ionicView.beforeEnter', function() {

		// $rootScope.hideTabs = false;

		// if ($state.current.name === 'tabs.events-create') {
		// 	$rootScope.hideTabs = true;
  //   	}
	});
})
.controller('LogoutCtrl', ['$scope','$ionicHistory', 'supplier', function($scope, $ionicHistory, supplier){
	var promise = supplier.getSupplierInfo();
	$scope.logout = function(){
		promise.then(function(data){
			data.login = false;
			// $state.go("supplier.home");
			$ionicHistory.clearHistory()
			$ionicHistory.clearCache()
			// window.location.reload();
			// console.log($ionicHistory)
		})		
	}
}])
// .controller('RootCtrl', ['$scope','$ionicHistory', function($scope,$ionicHistory){
// 	$scope.side={
// 		sideMunus: true
// 	}
// 	var currentState = $ionicHistory.viewHistory().stateName;
// 	console.log("ccccc: "+$ionicHistory.viewHistory());
// 	if( currentState == 'supplier.login' || currentState == 'supplier.register'){
// 		$scope.side.sideMunus = false;
// 		console.log('login')
// 	}
// }])
