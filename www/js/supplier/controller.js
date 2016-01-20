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

	$rootScope.main = {
		dragContent: true,	// 是否滑动内容区域打开side menu
		hideTabs: false		// 是否隐藏tabs
	};

	// 退出登录
	$scope.logout = function(){
		window.localStorage.token = null;
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();				
	}

}])
    .controller('homeCtrl', ['$scope', '$state', '$ionicHistory','$rootScope', '$ionicBackdrop', '$ionicLoading', '$ionicNavBarDelegate', '$timeout',
    	function($scope, $state, $ionicHistory, $rootScope,$ionicBackdrop,$ionicLoading, $ionicNavBarDelegate,$timeout) {
    	// 禁用登录、注册页滑动打开侧边栏
    	$rootScope.main.dragContent = false;

    	// 禁用下一个页面返回按钮
		$ionicHistory.nextViewOptions({
			disableBack: true
		});

		// 未获取到host显示背景
		$ionicBackdrop.retain();
		$ionicLoading.show({
            template: "<ion-spinner icon='ios' class='spinner spinner-ios '></ion-spinner>",
            noBackdrop: true
        });
        var hostListener = $rootScope.$watch('appReady.getHost', function() {
            if ($rootScope.appReady.getHost) {            	
                $ionicBackdrop.release();
                $ionicLoading.hide();
                hostListener();
            }
        });

        var timer;
		$scope.homeButton = function(){
			if(window.localStorage.token == null || window.localStorage.token == 'null'){
				$state.go("supplier.login");
				// timer = $timeout(function(){
				// 	$ionicNavBarDelegate.showBar(true);
				// },3000)
			} else {
				$state.go("supplier.release");
			}
		}
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
	                    window.localStorage.token = data.token;
	                    window.localStorage.come = true;
	                    $state.go("supplier.release");
	                } else {
	                    // if(data.user == null){
	                    // 	$scope.supplier.noRegiste = true;
	                    // }
	                    $ionicPopup.alert({
	                        template: data.errMsg
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

		$scope.supplierInfo = {
	    	userType: '供应商',
	    	phone: '',
	        userProfile: {
	        	company: '',
	        	credentials: []
	        }
	    }
	    // 获取个人信息
	    
    	$scope.$on('$ionicView.beforeEnter', function() {
    		// if($state.current.name == "supplier.personal"){
				httpService.get("/user/getProfile")
				.success(function(data){
					var profile = data.data;
					$scope.supplierInfo = {
						phone: profile.phone,
						userProfile: {
							company: profile.company
						}
					}
				})
    		// }
		});
	    

		$scope.show_error = false;

		// 修改个人信息
		$scope.supplierModPerInfo = function(myform){		
			$scope.show_error = true;
			if(myform.$valid){

				if(myform.$dirty){
					// $scope.supplierInfo.userProfile.company = $scope.supplier.company;
					httpService.post("/user/changeProfile",{
						company: $scope.supplierInfo.userProfile.company
					})
					.success(function(data){
						if(data.status){
							$ionicPopup.alert({
								template: "修改成功！",
								okText: "确认",
								okType: "button-my-balanced"
							}).then(function(data){
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
						password: $scope.supplier.newPassword
					})
					.success(function(data){
						if(data.status){
							$ionicPopup.alert({
								template: "密码修改成功！",
								okText: "确认",
								okType: "button-my-balanced"
							})
							.then(function(data){
								if(data){
									$state.go("supplier.personal");
								}
							})
						}else {
							$ionicPopup.alert({
								template: data.errMsg,
								okText: "确认",
								okType: "button-my-balanced"
							})
						}
					})
				}
			}
		}
	}])
	// 发布关键字
	.controller('releaseCtrl', ['$scope','$state', '$ionicPopup', 'httpService', '$rootScope', '$timeout', 
		function($scope, $state, $ionicPopup, httpService, $rootScope, $timeout){
		$rootScope.main.dragContent = true;

		$scope.keywords=["", "", ""];

		// 获取关键字
		httpService.get("/keywords/getKeywords")
		.success(function(data){
			if(data.status){
				var keywordsArray = data.data.keywords,
					len = keywordsArray.length;
				$scope.keywords = keywordsArray;
				if(len < 3){
					for(var i =len; i<3; i++ ){
						$scope.keywords.push("");
					}
				}
			}
		})
		$scope.addKeywords = function(){
			$timeout(function(){
				$scope.keywords.push("")
			},10)
		};
		// 清除数组中空数据
		$scope.cleanArray = function(array){
			var newArray = [];
			for(var i=0; i<array.length; i++){
				if(array[i]){
					newArray.push(array[i]);
				}
			}
			return newArray;
		}

		// 发布关键字
		$scope.releaseKeywords = function(){
			var cleanArray = $scope.cleanArray($scope.keywords);
			if(cleanArray.length == 0){
				$ionicPopup.alert({
					title: "关键字发布结果",
					template: "关键字不能为空，请重新发布！",
					okText: "确定",
					okType: "button-my-balanced"
				})
			} else {
				httpService.post("/keywords/setKeywords",{
					keywords: cleanArray
				})
				.success(function(data){
					if(data.status){
						var keywordsStr = cleanArray.toString();
						$state.go("supplier.orderList");
					}else{
						$ionicPopup.alert({
							title: "关键字发布结果",
							template: data.errMsg,
							okText: "确定",
							okType: "button-my-balanced"
						})
					}
				})
			}
			
		}
	}])

	// 订单列表
	.controller('orderListCtrl', ['$scope','httpService', '$state', '$stateParams','$ionicScrollDelegate', '$ionicPopup','$ionicActionSheet',
		function($scope, httpService, $state, $stateParams, $ionicScrollDelegate, $ionicPopup, $ionicActionSheet){
		$scope.order = {
			canBeLoaded: false,		//infinite-scroll能否触发
			mostData: false,		//订单加载是否返回所有数据
			content: [],			//订单内容
			showNoOrderText: false,	//是否显示无数据提示文字
			noOrderText: '',
			noOrderTitle: '采购单搜索结果',
			// startTime: '',
			// endTime: '',
			// date: new Date().toISOString(),
			count: 5,			//要请求的数量
			oldCount: 0,		//当前页面上订单条数
			oldMaxCount: 0,		//所有记录总数，后端返回，初始为0
			orderState: "所有"	//筛选订单状态
		};

		// 获取订单
		getMyOldOrders($scope.order.oldCount,$scope.order.oldMaxCount,$scope.order.orderState);
		// httpService.get("/order/getMyOldOrders/" + $scope.order.count +"/" +$scope.order.oldCount+ "/" + $scope.order.oldMaxCount + "/" + $scope.order.orderState)
		// .success(function(data){
		// 	if(data.status){
		// 		var orderData = data.data,
		// 			orderArray = orderData.orders,
		// 			len = orderArray.length;
		// 		if(orderData.maxCount > 0){
		// 			$scope.order.content = orderArray;
		// 			$scope.order.oldCount = len;
		// 			$scope.order.oldMaxCount = orderData.maxCount;

		// 			$scope.order.canBeLoaded = true;
		// 			$scope.order.showNoOrderText = false;

		// 			if(len == orderData.maxCount){
		// 				$scope.order.mostData = true;							
		// 			}
		// 		}else {
		// 			$scope.order.content = orderArray;
		// 			$scope.order.oldCount = len;
		// 			$scope.order.oldMaxCount = orderData.maxCount;

		// 			$ionicPopup.confirm({
		// 				title: $scope.order.noOrderTitle,
		// 				template: "暂无匹配的订单！",
		// 				okText: "返回",
		// 				cancelText: "留在此页",
		// 				okType: "button-my-balanced",
		// 				cancelType: "button-stable"
		// 			}).then(function(data){
		// 				if(data){
		// 					$state.go("supplier.release");
		// 				}else{
		// 					$scope.order.showNoOrderText = true;
		// 					$scope.order.noOrderText = '暂无匹配的订单！';
		// 				}
		// 			})
		// 		}
		// 	} else {
		// 		var errMsg = data.errMsg;
		// 		$ionicPopup.confirm({
		// 			title: $scope.order.noOrderTitle,
		// 			template: errMsg,
		// 			okText: "添加关键字",
		// 			cancelText: "留在此页",
		// 			okType: "button-my-balanced",
		// 			cancelType: "button-stable"
		// 		}).then(function(data){
		// 			if(data){
		// 				$state.go("supplier.release");
		// 			}else{
		// 				$scope.order.showNoOrderText = true;
		// 				$scope.order.noOrderText = errMsg;
		// 			}
		// 		})
		// 	}
		// })

		// 刷新订单列表
		$scope.loadNewOrderList = function(){
			httpService.get("/order/getMyNewOrders/" +$scope.order.oldCount+ "/" + $scope.order.oldMaxCount + "/" + $scope.order.orderState)
			.success(function(data){
				var orderData = data.data,
					orderArray = orderData.orders,
					len = orderArray.length;
				if(data.status){
					$scope.order.content = orderArray;
					$scope.order.oldCount = len;
					$scope.order.oldMaxCount = orderData.maxCount;
				}
			})
			.finally(function() {
				// Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			});
		}

		// 加载更多订单数据
		$scope.loadMoreOrder = function(){
			if(!$scope.order.mostData){
				httpService.get("/order/getMyOldOrders/" + $scope.order.count +"/" +$scope.order.oldCount+ "/" + $scope.order.oldMaxCount + "/" + $scope.order.orderState)
				.success(function(data){
					var orderData = data.data,
						orderArray = orderData.orders,
						len = orderArray.length;
					if(data.status && len <= orderData.maxCount ){
						$scope.order.content = orderArray;
						$scope.order.oldCount = len;
						$scope.order.oldMaxCount = orderData.maxCount;
						if(len == orderData.maxCount){
							$scope.order.mostData = true;
						}
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				})
			}else {
				$scope.order.canBeLoaded = false;	
				$ionicPopup.alert({
					title: "采购单加载结果",
					template: "已加载全部订单！",
					okText: "确认",
					okType: "button-my-balanced"
				})
			}
		}

		// 报价页or详情页
		$scope.nextGeneration = function(state, name){
			if(state == "报价")	{
				$state.go("supplier.quotation", {orderId: name});
			} else {
				$state.go("supplier.orderDetail", {orderId: name});
			}
		}

		// 物流页
		$scope.nextLogis = function(name){
			$state.go("supplier.logisticsTracking", {orderId: name});
		}

		// 筛选订单状态
		$scope.selectOrderStatus = function() {
			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{ text: '所有' },
					{ text: '报价' },
					{ text: '待支付' },
					{ text: '已支付' },
					{ text: '已发货' },
					{ text: '已完成' }
				],
				cssClass: "order-screen",
				buttonClicked: function(index){
					$ionicScrollDelegate.scrollTo(0,0,false);
					var state="所有";
					switch(index){
						case 0: state = '所有'; break;
						case 1: state = '报价'; break;
						case 2: state = '待支付'; break;
						case 3: state = '已支付'; break;
						case 4: state = '已发货'; break;
						case 4: state = '已完成'; break;
					}
					if(state != $scope.order.orderState){
						getMyOldOrders(0, 0, state);
						$scope.order.orderState = state;					
					}
					hideSheet();
				}
			})
		}

		function getMyOldOrders(oldCount, oldMaxCount, state){
			httpService.get("/order/getMyOldOrders/" + $scope.order.count +"/" + oldCount+ "/" + oldMaxCount + "/" + state)
			.success(function(data){
				if(data.status){
					var orderData = data.data,
						orderArray = orderData.orders,
						len = orderArray.length;
					if(orderData.maxCount > 0){
						$scope.order.content = orderArray;
						$scope.order.oldCount = len;
						$scope.order.oldMaxCount = orderData.maxCount;

						$scope.order.canBeLoaded = true;
						$scope.order.showNoOrderText = false;

						$scope.order.mostData = false;
						if(len == orderData.maxCount){
							$scope.order.mostData = true;
						}
					}else {
						$scope.order.content = orderArray;
						$scope.order.oldCount = len;
						$scope.order.oldMaxCount = orderData.maxCount;

						$ionicPopup.confirm({
							title: $scope.order.noOrderTitle,
							template: "暂无匹配的订单！",
							okText: "返回",
							cancelText: "留在此页",
							okType: "button-my-balanced",
							cancelType: "button-stable"
						}).then(function(data){
							if(data){
								$state.go("supplier.release");
							}else{
								$scope.order.showNoOrderText = true;
								$scope.order.noOrderText = '暂无匹配的订单！';
							}
						})
					}
				} else {
					var errMsg = data.errMsg;
					$ionicPopup.confirm({
						title: $scope.order.noOrderTitle,
						template: errMsg,
						okText: "添加关键字",
						cancelText: "留在此页",
						okType: "button-my-balanced",
						cancelType: "button-stable"
					}).then(function(data){
						if(data){
							$state.go("supplier.release");
						}else{
							$scope.order.showNoOrderText = true;
							$scope.order.noOrderText = errMsg;
						}
					})
				}
			})
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
							$ionicPopup.alert({
								template: "报价完成，返回订单列表",
								okText: "确认",
								okType: "button-my-balanced"
							}).then(function(data){
								if(data){
									$state.go("supplier.orderList");
									$ionicTabsDelegate.showBar(true);
								}
							})
						}
					})
				}
			}
		}
	}])
	// 订单详情
	.controller('orderDetailCtrl', ['$scope','httpService','$ionicPopup', '$stateParams', '$ionicHistory', '$ionicTabsDelegate', 
		function($scope, httpService, $ionicPopup, $stateParams, $ionicHistory, $ionicTabsDelegate){
		// 隐藏tabs
		$ionicTabsDelegate.showBar(false);

		// 是否发货
		$scope.showDelivery = false;
		$scope.delivery = function(){
			httpService.post("/order/sendGoods",{
				orderName: $stateParams.orderId
			})
			.success(function(data){
				if(data.status){
					$ionicPopup.alert({
						template: "已发货",
						okText: "确认",
						okType: "button-my-balanced"
					});
					$scope.showDelivery = false;
				}
			})
		}
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
			var orderState = $scope.order.state;
			if(orderState == "待支付" || orderState == "未支付" || orderState == '已支付'){
				$scope.showDelivery = true;
			}
		})
	}])
	// 物流跟踪
	.controller('LogisTrackCtrl', ['$scope','httpService', '$stateParams', '$ionicTabsDelegate', 
		function($scope,httpService, $stateParams, $ionicTabsDelegate){

		// 隐藏tabs
		$ionicTabsDelegate.showBar(false);
		$scope.logistics={
			info: ""
		};

		// 物流信息
		httpService.get("/order/getLogistics/" + $stateParams.orderId)
		.success(function(data){
			if(data.status){
				var dataArray = data.data;
				$scope.transit = dataArray;
			}
		})

		// 订单信息
		httpService.get("/order/getByOrderName/" + $stateParams.orderId)
		.success(function(data){
			if(data.status){
				$scope.order = data.data
			}
		})

		// 添加物流信息
		$scope.addLogisticsInfo = function(info){
			httpService.post("/order/addLogistics", {
				orderName: $stateParams.orderId,
				info: info
			})
			.success(function(data){
				if(data.status){
					$scope.transit.unshift(data.data);
				}
			})
			$scope.logistics.info = "";
		}
	}])
