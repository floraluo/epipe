angular.module('starter.service', [])

.factory('httpService', ['$q', '$http', 'CONFIG', '$cookieStore','$ionicBackdrop', '$ionicLoading', '$ionicPopup', '$cordovaInAppBrowser', '$ionicDeploy', '$ionicLoading', 'versionUpdateService',
    function($q, $http, CONFIG, $cookieStore,$ionicBackdrop, $ionicLoading,$ionicPopup,$cordovaInAppBrowser, $ionicDeploy, $ionicLoading,versionUpdateService) {
        
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
                    // errorHandle(data, status);
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
                    // errorHandle(data, status);
                    $ionicBackdrop.release();
                    $ionicLoading.hide();
                });
            }
        }

        function errorHandle(data, status){
            if(status === 403){
                // 处理更新
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

.factory("versionUpdateService", ['$rootScope','$ionicPopup', '$ionicDeploy', '$timeout', '$ionicLoading',
    function($rootScope,$ionicPopup, $ionicDeploy, $timeout, $ionicLoading) {

        var version;

        /**
         * 获得version
         */
        function getAppVersion() {

            $ionicDeploy.info().then(function(data) {
                var binaryVersion = data.binary_version;
                var deployUuid = data.deploy_uuid;
                version = deployUuid != 'NO_DEPLOY_AVAILABLE' ? deployUuid : binaryVersion;
            });

        }

        /**
         * 检查更新
         */
        function checkUpdate() {
            // $ionicLoading.show({
            //     template: '正在检查更新...',
            //     animation: 'fade-in',
            //     showBackdrop: true,
            //     duration: 3000,
            //     showDelay: 0
            // });

            $ionicDeploy.check().then(function(result) {

                if (result.available == 'true') {
                    showUpdateConfirm(result);
                    $rootScope.update = true;
                } else {
                    // $ionicLoading.show({
                    //     template: '恭喜你,你的版本已经是最新!',
                    //     animation: 'fade-in',
                    //     showBackdrop: true,
                    //     duration: 2000,
                    //     showDelay: 0
                    // });
                }
            }, function(err) {
                $ionicLoading.show({
                    template: '更新失败,请检查您的网络配置!' + err,
                    animation: 'fade-in',
                    showBackdrop: true,
                    duration: 2000,
                    showDelay: 0
                });

            });
        }

        function init() {}

        function showUpdateConfirm(checkResult) {
            // $ionicLoading.hide();
            var confirmPopup = $ionicPopup.confirm({
                title: '版本升级',
                template: "有新的版本了,是否要升级?",
                cancelText: '取消',
                okText: '升级'
            });
            confirmPopup.then(function(res) {
                //兼容更新
                if (checkResult.available == 'true' && checkResult.compatible == 'true') {
                    $ionicLoading.show({
                        template: '正在更新...',
                        animation: 'fade-in',
                        showBackdrop: true,
                        //duration: 2000,
                        showDelay: 0
                    });

                    if (res) {
                        $ionicDeploy.update().then(function(res) {
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: '更新成功!',
                                animation: 'fade-in',
                                showBackdrop: true,
                                duration: 2000,
                                showDelay: 0
                            });
                        }, function(err) {
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: '更新失败!' + err,
                                animation: 'fade-in',
                                showBackdrop: true,
                                duration: 2000,
                                showDelay: 0
                            });
                        }, function(prog) {
                            $ionicLoading.show({
                                template: "已经下载：" + prog + "%"
                            });
                            if (downloadProgress > 99) {
                                $ionicLoading.hide();
                            }
                        });
                    } else {
                        $ionicLoading.hide();
                    }
                }
                //非兼容更新
                else if (checkResult.available == 'true' && checkResult.compatible != 'true') {
                    $ionicLoading.show({
                        template: '请前往' + checkResult.update.url + '更新您的app',
                        animation: 'fade-in',
                        showBackdrop: true,
                        duration: 10000,
                        showDelay: 0
                    });
                }


            });
        };


        return {
            init: function() {
                getAppVersion();
            },

            getVersion: function() {
                return version;
            },

            checkUpdate: function() {
                checkUpdate();
            },

            update: function() {
                update();
            }
        }
    }
])