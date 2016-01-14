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
                var token=window.localStorage.token,
                    appVersion = window.localStorage.appVersion;
				var config={
                    headers:{
                        'x-access-token':token,
                        'x-app-version': appVersion
                    }
                };
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
                var token=window.localStorage.token,
                    appVersion = window.localStorage.appVersion;
				var config={
                    headers:{
                        'x-access-token':token,
                        'x-app-version':appVersion
                    },
                    params:params
                };
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
