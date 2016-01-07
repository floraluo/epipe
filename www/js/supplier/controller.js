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
    .controller('registerCtrl', ['$scope', '$rootScope', '$state', '$cordovaCamera', '$ionicActionSheet','httpService','$ionicPopup',
        function($scope, $rootScope, $state, $cordovaCamera, $ionicActionSheet,httpService,$ionicPopup) {

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
            		$scope.userRegisInfo.code=$scope.code = 201601;
            	})
            }

            // 验证验证码
            $scope.verifyCode = function(code){
            	// 判断验证码是否正确
                if($scope.userRegisInfo.code != $scope.captch){
                	$scope.code_is_error = true;
                }else{
                	$scope.code_is_error = false;
                }
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
.controller('personalCtrl',['$scope', '$http','$state', 'supplier' ,function($scope, $http, $state, supplier){
	var promise = supplier.getSupplierInfo();
	promise.then(function(data){
		$scope.supplier = data;
	}, function(data){
	})

	$scope.show_error = false;
	$scope.supplierModPerInfo = function(myform){		
		$scope.show_error = true;
		if(myform.$valid){
			if(myform.$dirty){
				alert("修改成功！");					
			}

			console.log($scope.userRegisInfo);
			$state.go("supplier.personal");
			// window.location.reload();
		}
	}
}])
// 发布关键字
.controller('releaseCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
	$rootScope.main.dragContent = true;
	$scope.keywords=["", "", ""];
	$scope.addKeywords = function(){
		$timeout(function(){
			$scope.keywords.push("")
		},10)
	};
	$scope.releaseKeywords = function(){
		console.log($scope.keywords);
	}
}])

// 订单列表
.controller('orderListCtrl', ['$scope', 'order', '$state', '$stateParams', '$ionicPopup','$http',
 function($scope, order, $state, $stateParams,$ionicPopup, $http){
	$scope.order = {
		canBeLoaded: true,
		content: []
	};
	// 获取订单列表数据 x条
	$http
	.get("../data/orderList.json")
	.success(function(data){
		$scope.order.content = data;
	})
	.error(function(){

	})
	$scope.amount = 0;//测试数据

	// 刷新订单列表
	$scope.reLoadOrderList = function(){
		$http
		.get("../data/orderList.json")
		.success(function(data){
			$scope.order.content = data;
			$scope.$broadcast('scroll.refreshComplete');
		})
		.error(function(){

		})
		// promise.then(function(data){
		// 	// $scope.order = $scope.order.concat(data);
		// 	$scope.order.content = data;
		// 	$scope.$broadcast('scroll.refreshComplete');
		// },function(data){
		// 	console.log(data);
		// })
	}
	// 加载更多订单数据
	$scope.loadMoreOrder = function(){
		if($scope.amount < 2){
			$http
			.get("../data/orderList.json")
			.success(function(data){
				$scope.amount ++
				$scope.order.content = $scope.order.content.concat(data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			})
			.error(function(){

			})
		}else{
			$scope.order.canBeLoaded = false;
			$ionicPopup.alert({
				template: "没有更多数据了！"
			})
		}
	}
}])
// 报价
.controller('quotationCtrl', ['$scope','$http', '$state', '$stateParams','$ionicHistory', '$ionicTabsDelegate', 'order', 
	function($scope, $http, $state, $stateParams, $ionicHistory, $ionicTabsDelegate, order){
	// 隐藏tabs
	$ionicTabsDelegate.showBar(false);
	// show_error：是否显示错误提示
	$scope.show_error = false;
	$http.get('../data/orderDetail'+$stateParams.orderId+'.json')
	.success(function(data){
		$scope.order = data;
	})
	$scope.productQuo = {
		unitPrice: '',
		totalPrice: ''
	}
	$scope.canlTotalPrice = function(orderNum){
		$scope.productQuo.unitPrice = parseInt($scope.productQuo.unitPrice) > 0 ? $scope.productQuo.unitPrice : '';
		$scope.productQuo.totalPrice = $scope.productQuo.unitPrice*orderNum !=0 ? $scope.productQuo.unitPrice*orderNum : ''
	}
	$scope.quotation = function(myform){
		if(myform.$dirty){
			$scope.show_error = true;
			if(myform.$valid){
				alert("提交成功！")
				$state.go("supplier.orderDetail",{orderId:$stateParams.orderId})
			}
		}
	}

}])
// 订单详情
.controller('orderDetailCtrl', ['$scope','$http', '$state','$stateParams', '$ionicHistory','$location', '$ionicTabsDelegate', 'order', 'supplier', 
		function($scope, $http,$state, $stateParams, $ionicHistory, $location, $ionicTabsDelegate, order, supplier){
	// 隐藏tabs
	$ionicTabsDelegate.showBar(false);
	// $scope.order = order[$stateParams.orderId]
	// $ionicHistory.goBack(-1);
	// $scope.$on("$ionicView.enter", function () {
	//    $ionicHistory.clearCache();
	//    $ionicHistory.clearHistory();
	// });
	$http.get('../data/orderDetail'+$stateParams.orderId+'.json')
	.success(function(data){
		$scope.order = data;
	})
	var promise = supplier.getSupplierInfo();
	promise.then(function(data){
		$scope.supplier = data;
	}, function(data){
		// $scope.supplier = 
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
