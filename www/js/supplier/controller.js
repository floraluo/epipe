angular.module('starter.controller' , [])

.controller('SupplierCtrl', ['$rootScope', '$scope', '$state','$ionicHistory', function($rootScope, $scope, $state,$ionicHistory){
	$rootScope.myGoBack = function(){
		if($ionicHistory.viewHistory().backView.stateName == 'supplier.quotation'){
			$rootScope.$ionicGoBack (-2)
			window.location.reload();
		}
		$rootScope.$ionicGoBack (-1)
	}
	// $rootScope.keyboardOpen = false;
	// window.addEventListener('native.keyboardshow', function(){
	// 	$rootScope.keyboardOpen = true;
	// });
}])
.controller('homeCtrl', ['$scope', '$state','$stateParams', '$location', 'supplier', function($scope, $state,$stateParams, $location, supplier){
	// if (supplier.login) {
	// 	$scope.href = "#/supplier/release";
	// }else{
	// 	$scope.href = "#/login";
	// };
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
.controller('loginCtrl', ['$scope','$state','$ionicBackdrop','$ionicLoading', 'supplier', 
	function($scope, $state,$ionicBackdrop,$ionicLoading, supplier){
	var user = $scope.user = {
		name: '',
		password: '',
		validPassword: false
	};
	$scope.supplierLogin = function(myform){
		if(myform.$valid){
			$ionicBackdrop.retain();
			$ionicLoading.show({
				template: "<ion-spinner icon='ios' class='spinner spinner-ios '></ion-spinner>",
				noBackdrop: true
			})
			var promise = supplier.getSupplierInfo();
			promise.then(function(data){
				if(user.password == data.password){
					alert("登录成功！")
					$ionicBackdrop.release();
					$ionicLoading.hide();
					$state.go("supplier.release");
				}else {
					user.validPassword = true
				}
			})
			console.log($scope.user)
		}
	}
	$scope.pathToRegis = function(){
		$state.go("supplier.register");
		// window.location.reload();
	}
}])
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
		if(myform.$dirty){
			$scope.show_error = true;
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
.controller('personalCtrl',['$scope', '$http', 'supplier' ,function($scope, $http, supplier){
	var promise = supplier.getSupplierInfo();
	promise.then(function(data){
		$scope.supplier = data;
	}, function(data){
	})
}])
// 发布关键字
.controller('releaseCtrl', ['$scope', '$timeout', function($scope, $timeout){
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
.controller('orderListCtrl', ['$scope', 'order', '$state', '$stateParams', '$ionicPopup',
 function($scope, order, $state, $stateParams,$ionicPopup){
	$scope.order = {
		canBeLoaded: true,
		content: []
	};
	$scope.amount = 0;
	var promise = order.getOrder();
	promise.then(function(data){
		$scope.order.content = data;
	},function(data){
		console.log(data);
	})
	$scope.displayOrderList = function(){
		promise.then(function(data){
			// $scope.order = $scope.order.concat(data);
			$scope.order.content = data;
			$scope.$broadcast('scroll.refreshComplete');
		},function(data){
			console.log(data);
		})
	}
	$scope.loadMoreOrder = function(){
		if($scope.amount < 2){
			promise.then(function(data){
				$scope.amount ++
				$scope.order.content = $scope.order.content.concat(data);
				// $scope.order = data;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			},function(data){
				console.log(data);
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
.controller('quotationCtrl', ['$scope','$http', '$state', '$stateParams','$ionicHistory', 'order', 
	function($scope, $http, $state, $stateParams, $ionicHistory, order){

	$scope.show_error = false;
	$http.get('../data/order'+$stateParams.orderId+'.json')
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
	$http.get('../data/order'+$stateParams.orderId+'.json')
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
	})
	$http.get("../data/order"+$stateParams.orderId+".json")
	.success(function(data){
		$scope.thisOrder = data;
	})
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
			$state.go("home");
			window.location.reload();
			console.log($ionicHistory)
		})		
	}
}])