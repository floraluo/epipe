angular.module('starter.service', [])

.factory('httpService', ['$q', '$http', 'CONFIG', '$cookieStore','$ionicBackdrop', '$ionicLoading', '$ionicPopup', '$cordovaInAppBrowser',
    function($q, $http, CONFIG, $cookieStore,$ionicBackdrop, $ionicLoading,$ionicPopup,$cordovaInAppBrowser) {
        
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

                var host = '';
                if(CONFIG.serveHost){
                    host = CONFIG.serveHost;
                }else {
                    host = CONFIG.host;
                }
                return $http.post(host + url,params,config).success(function() {

                    $ionicBackdrop.release();
                    $ionicLoading.hide();

                })
                .error(function(data, status) {
                    errorHandle(data, status);
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
                var host = '';
                if(CONFIG.serveHost){
                    host = CONFIG.serveHost;
                }else {
                    host = CONFIG.host;
                }
                return $http.get(host + url,config).success(function() {

                    $ionicBackdrop.release();
                    $ionicLoading.hide();

                })
                .error(function(data, status) {
                    errorHandle(data, status);
                    $ionicBackdrop.release();
                    $ionicLoading.hide();
                });
            }
        }

        function errorHandle(data, status){
            if(status === 403){
                var iosPath = data.app_ios_path,
                    androidPath = data.app_andriod_path;

                $ionicPopup.alert({
                    title: "更新提示",
                    template: "检测到有新版本，为了不影响您继续使用请立即更新！",
                    okText: "立即更新",
                    cancelText: "稍后再说",
                    okType: "button-my-balanced",
                    cancelType: "button-stable"
                }).then(function(data){
                    if(data){
                        // getNewApp(iosPath,androidPath)
                        if(ionic.Platform.isIOS()){
                            console.log(iosPath);
                            $cordovaInAppBrowser.open(iosPath, '_system')
                            .then(function(){
                                console.log("success");
                            });
                        } else if(ionic.Platform.isAndroid()){
                            console.log(androidPath);
                            $cordovaInAppBrowser.open(androidPath, '_system')
                            .then(function(){
                                console.log("success");
                            });
                        }
                    }
                })
            }
            
        }
    }
])
