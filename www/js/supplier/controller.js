angular.module('starter.controller', [])

.controller('SupplierCtrl', ['$rootScope', '$scope', '$state', '$ionicHistory', function($rootScope, $scope, $state, $ionicHistory) {
        $rootScope.myGoBack = function() {
            if ($ionicHistory.viewHistory().backView.stateName == 'supplier.quotation') {
                $rootScope.$ionicGoBack(-2)
                window.location.reload();
            }
            $rootScope.$ionicGoBack(-1)
        }
        $rootScope.hideTabs = false;
        // $rootScope.keyboardOpen = false;
        // window.addEventListener('native.keyboardshow', function(){
        // 	$rootScope.keyboardOpen = true;
        // });
    }])
    .controller('homeCtrl', ['$scope', '$state', '$stateParams', '$location', 'supplier', function($scope, $state, $stateParams, $location, supplier) {
        // if (supplier.login) {
        // 	$scope.href = "#/supplier/release";
        // }else{
        // 	$scope.href = "#/login";
        // };
        var promise = supplier.getSupplierInfo();
        $scope.sale = function() {
            promise.then(function(data) {
                if (data.login) {
                    $scope.href = "#/supplier/release";
                    $state.go("supplier.release");
                } else {
                    $state.go("supplier.login");
                    // window.location.reload();

                };
            })
        }
    }])
    .controller('loginCtrl', ['$scope',  'CONFIG', '$ionicPopup', '$cookieStore', 'httpService', '$state', '$ionicBackdrop', '$ionicLoading', 'supplier',
        function($scope, CONFIG, $ionicPopup, $cookieStore, httpService, $state, $ionicBackdrop, $ionicLoading, supplier) {
            var user = $scope.user = {
                name: 'test3@test.com',
                password: '111111'
            };
            // $scope.validPassword=false;
            $scope.supplier = {
                registe: true,
                validPassword: true
            }
            $scope.changeValidPassword = function() {
                $scope.validPassword = false;
            }
            $scope.supplierLogin = function(myform) {
                if (myform.$valid) {


                    httpService.post('/login', {
                        user: $scope.user.name,
                        password: $scope.user.password
                    }).success(function(data) {
                        console.log(data);
                        if (data.success) {
                            console.log('success');
                            window.localStorage.token = data.token;
                            $state.go("supplier.release");
                        } else {
                            //alert("用户名或密码错误");
                            $ionicPopup.alert({
                                template: "用户名或密码错误"
                            })
                        }
                    });

                    /* $ionicBackdrop.retain();
                     $ionicLoading.show({
                         template: "<ion-spinner icon='ios' class='spinner spinner-ios '></ion-spinner>",
                         noBackdrop: true
                     });

                     $http.post(CONFIG.host + '/login', {
                             user: $scope.user.name,
                             password: $scope.user.password
                         })
                         .success(function(data) {
                             $ionicBackdrop.release();
                             $ionicLoading.hide();
                             console.log(data);
                             if (data.success) {

                             } else {

                             }


                             $state.go("supplier.release");
                         })
                         .error(function() {
                             $ionicBackdrop.release();
                             $ionicLoading.hide();
                         });*/

                    /*var promise = supplier.getSupplierInfo();
                    promise.then(function(data){
                    	$ionicBackdrop.release();
                    	$ionicLoading.hide();
                    	console.log(data)
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
                    	console.log(data)
                    })*/

                }
            }
            $scope.pathToRegis = function() {
                $state.go("supplier.register");
                // window.location.reload();
            }
        }
    ])
    // 注册
    .controller('registerCtrl', ['$scope', '$rootScope', '$state', '$cordovaCamera', '$ionicActionSheet','httpService','$ionicPopup',
        function($scope, $rootScope, $state, $cordovaCamera, $ionicActionSheet,httpService,$ionicPopup) {

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
                if ($rootScope.appReady.status) $scope.ready = true;
            });
            $scope.supplierCheckEmail = function(email) {
                httpService.get("/register/supplier/checkemail/"+email).success(function(data) {
                    console.log(data);
                    if (data.success) {
                        console.log('success');
                    } else {
                        
                        $ionicPopup.alert({
                            template: "邮箱已存在"
                        })
                    }
                });
            };
            $scope.supplierRegiste = function(myform) {
                $scope.show_error = true;
                if (myform.$dirty) {
                    if (myform.$valid) {
                        

                        console.log($scope.userRegisInfo);
                        httpService.post("/register/supplier", $scope.userRegisInfo).success(function(data) {
                            console.log(data);
                            if (data.success) {
                                console.log('success');

                                $state.go("supplier.login");
                            } else {                                
                                $ionicPopup.alert({
                                    template: "邮箱已存在"
                                })
                            }
                        });


                    }
                }
            }
        }
    ])
    // 个人中心
    .controller('personalCtrl', ['$scope', '$http', '$state', 'supplier', function($scope, $http, $state, supplier) {
        var promise = supplier.getSupplierInfo();
        promise.then(function(data) {
            $scope.supplier = data;
        }, function(data) {})

        $scope.show_error = false;
        $scope.supplierModPerInfo = function(myform) {
            $scope.show_error = true;
            if (myform.$valid) {
                if (myform.$dirty) {
                    alert("修改成功！");
                }

                console.log($scope.userRegisInfo);
                $state.go("supplier.personal");
                // window.location.reload();
            }
        }
    }])
    // 发布关键字
    .controller('releaseCtrl', ['$scope', '$timeout', function($scope, $timeout) {
        $scope.keywords = ["", "", ""];
        $scope.addKeywords = function() {
            $timeout(function() {
                $scope.keywords.push("")
            }, 10)
        };
        $scope.releaseKeywords = function() {
            console.log($scope.keywords);
        }
    }])

// 订单列表
.controller('orderListCtrl', ['$scope', 'order', '$state', '$stateParams', '$ionicPopup', '$http',
        function($scope, order, $state, $stateParams, $ionicPopup, $http) {
            $scope.order = {
                canBeLoaded: true,
                content: []
            };
            // 获取订单列表数据 x条
            $http
                .get("../data/orderList.json")
                .success(function(data) {
                    $scope.order.content = data;
                })
                .error(function() {

                })
            $scope.amount = 0; //测试数据

            // 刷新订单列表
            $scope.reLoadOrderList = function() {
                    $http
                        .get("../data/orderList.json")
                        .success(function(data) {
                            $scope.order.content = data;
                            $scope.$broadcast('scroll.refreshComplete');
                        })
                        .error(function() {

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
            $scope.loadMoreOrder = function() {
                if ($scope.amount < 2) {
                    $http
                        .get("../data/orderList.json")
                        .success(function(data) {
                            $scope.amount++
                                $scope.order.content = $scope.order.content.concat(data);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        })
                        .error(function() {

                        })
                        // promise.then(function(data){
                        // 	$scope.amount ++
                        // 	$scope.order.content = $scope.order.content.concat(data);
                        // 	// $scope.order = data;
                        // 	$scope.$broadcast('scroll.infiniteScrollComplete');
                        // },function(data){
                        // 	console.log(data);
                        // })
                } else {
                    $scope.order.canBeLoaded = false;
                    $ionicPopup.alert({
                        template: "没有更多数据了！"
                    })
                }
            }
        }
    ])
    // 报价
    .controller('quotationCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicHistory', 'order',
        function($scope, $http, $state, $stateParams, $ionicHistory, order) {

            $scope.show_error = false;
            $http.get('../data/orderDetail' + $stateParams.orderId + '.json')
                .success(function(data) {
                    $scope.order = data;
                })
            $scope.productQuo = {
                unitPrice: '',
                totalPrice: ''
            }
            $scope.canlTotalPrice = function(orderNum) {
                $scope.productQuo.unitPrice = parseInt($scope.productQuo.unitPrice) > 0 ? $scope.productQuo.unitPrice : '';
                $scope.productQuo.totalPrice = $scope.productQuo.unitPrice * orderNum != 0 ? $scope.productQuo.unitPrice * orderNum : ''
            }
            $scope.quotation = function(myform) {
                if (myform.$dirty) {
                    $scope.show_error = true;
                    if (myform.$valid) {
                        alert("提交成功！")
                        $state.go("supplier.orderDetail", {
                            orderId: $stateParams.orderId
                        })
                    }
                }
            }

        }
    ])
    // 订单详情
    .controller('orderDetailCtrl', ['$scope', '$http', '$state', '$stateParams', '$ionicHistory', '$location', 'order', 'supplier',
        function($scope, $http, $state, $stateParams, $ionicHistory, $location, order, supplier) {
            // $scope.order = order[$stateParams.orderId]
            // $ionicHistory.goBack(-1);
            // $scope.$on("$ionicView.enter", function () {
            //    $ionicHistory.clearCache();
            //    $ionicHistory.clearHistory();
            // });
            $http.get('../data/orderDetail' + $stateParams.orderId + '.json')
                .success(function(data) {
                    $scope.order = data;
                })
            var promise = supplier.getSupplierInfo();
            promise.then(function(data) {
                $scope.supplier = data;
            }, function(data) {
                // $scope.supplier = 
            })
        }
    ])
    .controller('LogisTrackCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $http.get("../data/transit_step.json")
            .success(function(data) {
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
    .controller('LogoutCtrl', ['$scope', '$ionicHistory', '$state', 'supplier', function($scope, $ionicHistory, $state, supplier) {
        var promise = supplier.getSupplierInfo();
        $scope.logout = function() {
            promise.then(function(data) {
                data.login = false;
                $state.go("supplier.home");
                $ionicHistory.clearHistory()
                $ionicHistory.clearCache()
                    // window.location.reload();
                    // console.log($ionicHistory)
            })
        }
    }])
