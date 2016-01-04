angular.module('starter.controller' , [])

.controller('SupplierCtrl', ['$rootScope', '$scope', '$state','$ionicHistory', function($rootScope, $scope, $state,$ionicHistory){

	$rootScope.myGoBack = function(){
		if($ionicHistory.viewHistory().backView.stateName == 'supplier.quotation'){
			$rootScope.$ionicGoBack (-2)
			window.location.reload();
		}
		$rootScope.$ionicGoBack (-1)
	}
	$rootScope.hideTabs = false;
	$rootScope.sideMunus = true;
	$rootScope.main = {};
	$rootScope.main.dragContent = true;
}])
.controller('homeCtrl', ['$scope', '$rootScope', '$state','$stateParams', '$location', 'supplier', '$ionicHistory',
	function($scope, $rootScope, $state,$stateParams, $location, supplier, $ionicHistory){
	// if (supplier.login) {
	// 	$scope.href = "#/supplier/release";
	// }else{
	// 	$scope.href = "#/login";
	// };
	// 欢迎页，登录页，注册页隐藏sidemenu
	$rootScope.main.dragContent = false;

	$ionicHistory.nextViewOptions({
		disableBack: true
	})
	var promise = supplier.getSupplierInfo();
	$scope.sale = function(){
		promise.then(function(data){
			if (data.login) {
				$scope.href = "#/supplier/release";
				$state.go("supplier.release");
			}else{
				$state.go("supplier.login");
				// window.location.reload();

			};
		})		
	}
}])
// 登录
.controller('loginCtrl', ['$scope','$rootScope', '$state','$ionicBackdrop','$ionicLoading', 'supplier', 
	function($scope, $rootScope, $state,$ionicBackdrop,$ionicLoading, supplier){
	
	var user = $scope.user = {
		name: '',
		password: ''
	};
	// $scope.validPassword=false;
	$scope.supplier={
		registe: true,
		validPassword: true
	}
	$scope.changeValidPassword = function(){
		$scope.validPassword=false;
	}
	$scope.supplierLogin = function(myform){
		if(myform.$valid){
			$ionicBackdrop.retain();
			$ionicLoading.show({
				template: "<ion-spinner icon='ios' class='spinner spinner-ios '></ion-spinner>",
				noBackdrop: true
			})
			var promise = supplier.getSupplierInfo();
			promise.then(function(data){
				$ionicBackdrop.release();
				$ionicLoading.hide();
				// console.log(data)
				if(data.registe == false){
					$scope.supplier.registe=data.registe;
					return;
				}
				if(user.password == data.password){
					alert("登录成功！")
					$state.go("supplier.release");
				}else {
					$scope.supplier.validPassword=false
				}
			},function(data){
				// console.log(data)
			})
			// console.log($scope.user)
		}
	}
	$scope.pathToRegis = function(){
		$state.go("supplier.register");
		// window.location.reload();
	}
}])
// 注册
.controller('registerCtrl', ['$scope', '$rootScope', '$state', '$cordovaCamera','$ionicActionSheet',
	function($scope, $rootScope, $state, $cordovaCamera,$ionicActionSheet){
	$scope.userRegisInfo = {
		email: '',
		tel: '',
		company: '',
		password: '',
		repassword: '',
		myCredentials: []
	}
	$scope.show_error = false;
	$scope.ready = false;
	$rootScope.$watch('appReady.status', function() {
		// console.log('watch fired '+$rootScope.appReady.status);
		if($rootScope.appReady.status) $scope.ready = true;
	});
	$scope.supplierRegiste = function(myform){
		$scope.show_error = true;
		if(myform.$dirty){
			if(myform.$valid){
				alert("提交成功！");

				console.log($scope.userRegisInfo);
				$state.go("supplier.release");
				// window.location.reload();
			}			
		}
	}
}])
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
			// promise.then(function(data){
			// 	$scope.amount ++
			// 	$scope.order.content = $scope.order.content.concat(data);
			// 	// $scope.order = data;
			// 	$scope.$broadcast('scroll.infiniteScrollComplete');
			// },function(data){
			// 	console.log(data);
			// })
		}else{
			$scope.order.canBeLoaded = false;
			$ionicPopup.alert({
				template: "没有更多数据了！"
			})
		}
	}
}])
// 报价
.controller('quotationCtrl', ['$scope','$http', '$state', '$stateParams','$ionicHistory', 'order', 
	function($scope, $http, $state, $stateParams, $ionicHistory, order){

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
.controller('orderDetailCtrl', ['$scope','$http', '$state','$stateParams', '$ionicHistory','$location', 'order', 'supplier', 
		function($scope, $http,$state, $stateParams, $ionicHistory, $location, order, supplier){
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
.controller('LogisTrackCtrl', ['$scope','$http','$stateParams', function($scope, $http,$stateParams){
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

		$rootScope.hideTabs = false;

		if ($state.current.name === 'tabs.events-create') {
			$rootScope.hideTabs = true;
    	}
	});
})
.controller('LogoutCtrl', ['$scope','$ionicHistory','$state' , 'supplier', function($scope, $ionicHistory,$state , supplier){
	var promise = supplier.getSupplierInfo();
	$scope.logout = function(){
		promise.then(function(data){
			data.login = false;
			$state.go("supplier.home");
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