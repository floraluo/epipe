angular.module('starter.service', [])
.factory('httpService', ['$q', '$http', 'CONFIG', '$cookieStore','$ionicBackdrop', '$ionicLoading',
    function($q, $http,  CONFIG, $cookieStore,$ionicBackdrop, $ionicLoading) {
        return {
            post: function(url, params) {
                // body...
                $ionicBackdrop.retain();
                $ionicLoading.show({
                    template: "<ion-spinner icon='ios' class='spinner spinner-ios '></ion-spinner>",
                    noBackdrop: true
                });

                //or add x-access-token
                var token=window.localStorage.token;
				var config={headers:{'x-access-token':token}};
				//var config={};
				console.log('--------');
				console.info(config);
				console.log('--------');
				
                return $http.post(CONFIG.host + url,params,config).success(function() {

                    $ionicBackdrop.release();
                    $ionicLoading.hide();

                }).error(function(err) {
                	console.log('err:'+err);
                    $ionicBackdrop.release();
                    $ionicLoading.hide();
                });

            },
            get:function(url, params) {
                // body...
                $ionicBackdrop.retain();
                $ionicLoading.show({
                    template: "<ion-spinner icon='ios' class='spinner spinner-ios '></ion-spinner>",
                    noBackdrop: true
                });

                //or add x-access-token
                var token=window.localStorage.token;
				var config={headers:{'x-access-token':token},params:params};
				//var config={};
				console.log('--------');
				console.info(config);
				console.log('--------');

				
                return $http.get(CONFIG.host + url,config).success(function() {

                    $ionicBackdrop.release();
                    $ionicLoading.hide();

                }).error(function(err) {
                	console.log('err:'+err);
                    $ionicBackdrop.release();
                    $ionicLoading.hide();
                });
            }
        }
    }
])
// .factory('order',['$q', '$http', 'httpService', function($q, $http, httpService){
//     return {
//         getByOrderName: function(orderId){  
//             return httpService.get('/order/getByOrderName/'+ orderId)
//         }
//     }
// }])
.factory('supplier', ['$q', '$http', function($q, $http) {
        // interface
        var supplier = {
            info: [],
            getSupplierInfo: getSupplierInfo
        };
        return supplier;

        // implementation
        function getSupplierInfo() {
            var def = $q.defer();

            $http.get("../data/supplier.json")
                .success(function(data) {
                    supplier.info = data;
                    def.resolve(data);
                })
                .error(function() {
                    def.reject("Failed to get supplier info");
                });
            return def.promise;
        }
    }])
    // .factory('order', ['$q', '$http', function($q, $http) {
    //     var order = {
    //         info: [],
    //         getOrder: getOrder
    //     }
    //     return order;

    //     function getOrder() {
    //         var def = $q.defer();

    //         $http.get("../data/order.json")
    //             .success(function(data) {
    //                 order.info = data;
    //                 def.resolve(data);
    //             })
    //             .error(function() {
    //                 def.reject("Failed to get order info")
    //             });
    //         return def.promise;
    //     }
    //     // var order = [
    //     // 	{
    //     // 		"orderId": "0",
    //     // 		"orderNum": "3736837484",
    //     // 		"productName": "高密度聚乙烯PPD沙发客3023",
    //     // 		"productAmount": "4",
    //     // 		"date": "2015-02-05",
    //     // 		"state": "我要报价",
    //     // 		"trackInfo": false,
    //     // 		"purchaserCompany": "浙江金鱼枫叶管理有限公司",
    //     // 		"purchaserTel": "12354896578",

    //     // 		"unitPrice": "3456",
    //     // 		"totalPrice": "637383746"
    //     // 	},
    //     // 	{
    //     // 		"orderId": "1",
    //     // 		"orderNum": "3453453452334",
    //     // 		"productName": "高密度3",
    //     // 		"productAmount": "0.9",
    //     // 		"date": "2015-02-05",
    //     // 		"state": "已发货",
    //     // 		"trackInfo": true,
    //     // 		"purchaserCompany": "浙江金鱼枫叶管理有限公司",
    //     // 		"purchaserTel": "1254896587"
    //     // 	},
    //     // 	{
    //     // 		"orderId": "2",
    //     // 		"orderNum": "23423424234",
    //     // 		"productName": "高密度聚乙烯PPD沙发客3023",
    //     // 		"productAmount": "22",
    //     // 		"date": "2014-23-05",
    //     // 		"state": "已完成",
    //     // 		"trackInfo": false,
    //     // 		"purchaserCompany": "浙江金鱼枫叶管理有限公司",
    //     // 		"purchaserTel": "34234252354"
    //     // 	}
    //     // ];
    //     // return order;
    // }])
