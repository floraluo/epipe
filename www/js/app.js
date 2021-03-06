// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova', 
  'ngCookies',
  'starter.controller', 
  'starter.directive', 
  'starter.service', 
  'starter.filter',
  'ionic.service.core',
  'ionic.service.deploy'])

.config(['$ionicAppProvider', function($ionicAppProvider) {
    // Identify app
    $ionicAppProvider.identify({
        // Your App ID
        app_id: '5fe394ef',
        // The public API key services will use for this app
        api_key: '1f98a02dab45f4c129f1145b58b51a2f6e635ca3748980de',
        domain: 'http://192.168.1.154:8100',
        channel_tag: 'production'
            // Your GCM sender ID/project number (Uncomment if supporting Android)
            //gcm_id: 'YOUR_GCM_ID'
    });

}])
.run(function($ionicPlatform, $ionicPopup,$timeout, $rootScope, $state, $stateParams,$ionicHistory,$cordovaAppVersion,$http, CONFIG,$ionicTabsDelegate) {

  $rootScope.appReady = {status:false,getHost:false};
  $rootScope.update = false;
  $ionicPlatform.ready(function() {
    $http.get("http://www.epipe.cn/download/appConfig.js")
    .then(function(data){
      // CONFIG['serveHost']=data.data.api_host;
      CONFIG['serveHost']='http://192.168.1.154:8083';
      $rootScope.appReady.getHost = true;
    },function(){
      $rootScope.appReady.getHost = true;
    })
    $rootScope.appReady.status = true;
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // ----------start 浏览器不支持获取app version 测试写法-----------------------
    try{
      $cordovaAppVersion.getVersionNumber().then(function (version) {
        window.localStorage.appVersion = version;
      });
    } catch(error){
      window.localStorage.appVersion = '0.0.1';
    }
    // ----------end  浏览器不支持获取app version 测试写法-----------------------

    // $cordovaAppVersion.getVersionNumber().then(function (version) {
    //  window.localStorage.appVersion = version;
    // }); 
  });

  $ionicPlatform.registerBackButtonAction(function(e){
    if( $state.current.name=="supplier.release" 
      || $state.current.name=="supplier.orderList" 
      || $state.current.name=="supplier.personal" 
      || $state.current.name=="supplier.login" ){
      e.preventDefault();
      $ionicPopup.confirm({
        template: "确认要退出采购宝吗？",
        okText: "确认",
        cancelText: "取消",
        okType: "button-my-balanced",
        cancelType: "button-stable"
      })
      .then(function(data){
        if(data){
          ionic.Platform.exitApp();
        }
      })
    }else {
      $ionicHistory.goBack();
      $timeout(function(){
        $ionicTabsDelegate.showBar(true);    
      },300);
    }
  },100);
})
.config(function($stateProvider,$httpProvider, $urlRouterProvider, $ionicConfigProvider){
  $ionicConfigProvider.tabs.position('bottom').style('striped');
  $urlRouterProvider.otherwise('supplier/home');

  // if( window.localStorage.come ){
  //   if(window.localStorage.token == null || window.localStorage.token == 'null'){
  //     $urlRouterProvider.otherwise('supplier/login');
  //   }else {
  //     $urlRouterProvider.otherwise('supplier/release');      
  //   }
  // }else {
  //   $urlRouterProvider.otherwise('supplier/home');        
  // }

  $httpProvider.defaults.headers.get={'Content-Type':'jwt'};
  $stateProvider.state('supplier', {
    url: '/supplier',
    abstract: true,
    views: {
      '': {
        templateUrl: 'views/supplier/main-menu.html',
        controller: 'SupplierCtrl'
      },
      'main@supplier': {
        templateUrl: 'views/supplier/tabs.html'
      }
    }
  })
  .state('supplier.home', {
    url: '/home',
    views: {
      'main': {
        templateUrl: 'views/home.html',
        controller: 'homeCtrl'
      }
    }
  })
  .state('supplier.login', {
    url: '/login',
    cache: false,
    views: {
      'main': {
        templateUrl: 'views/supplier/login.html',
        controller: 'loginCtrl'       
      }
    }
  })
  .state("supplier.fetchVerfication", {
    url: '/fetchVerfication',
    cache: false,
    views: {
      'main': {
        templateUrl: 'views/supplier/fetch-verification.html',
        controller: 'FetchVerificationCtrl'
      }
    }
  })
  .state('supplier.resetPassword', {
    url: '/resetPassword/:phone/:code',
    cache: false,
    views: {
      'main': {
        templateUrl: 'views/supplier/reset-password.html',
        controller: 'ResetPasswordCtrl'
      }
    }
  })
  .state('supplier.register', {
    url: '/register',
    views: {
      'main': {
        templateUrl: 'views/supplier/register.html',
        controller: 'registerCtrl'   
      }
    }
  })
  .state('supplier.personal', {
    url: '/personal',
    views: {
      'tabPersonalCenter': {
        templateUrl: 'views/supplier/personal-center.html',
        controller: 'personalCtrl'
      }
    }
  })
  .state('supplier.modifyProfile', {
    url: '/modifyProfile',
    views: {
      'tabPersonalCenter': {
        templateUrl: "views/supplier/modify-profile.html",
        controller: 'personalCtrl'
      }
    }
  })
  .state('supplier.modifyPassword', {
    url: '/modifyPassword',
    views: {
      'tabPersonalCenter': {
        templateUrl: "views/supplier/modify-password.html",
        controller: 'ModifyPasswordCtrl'
      }
    }
  })
  .state('supplier.release', {
    url: '/release',
    views: {
      'tabRelease': {
        templateUrl: 'views/supplier/release.html',
        controller: 'releaseCtrl'
      }
    }
  })
  .state('supplier.orderList', {
    cache: false,
    url: '/orderList',
    views: {
      'tabPO': {
        templateUrl: 'views/supplier/order-list.html',
        controller: 'orderListCtrl'
      }
    }
  })
  .state('supplier.quotation', {
    url: '/quotation?orderId',
    views: {
      'tabPO': {
        templateUrl: 'views/supplier/quotation.html',
        controller: 'quotationCtrl'
      }
    }
  })
  .state('supplier.orderDetail', {
    url: '/orderDetail?orderId',
    views: {
      'tabPO': {
        templateUrl: 'views/supplier/order-detail.html',
        controller: 'orderDetailCtrl'
      }
    }
  })
  .state('supplier.logisticsTracking', {
    url: '/logisticsTracking?orderId',
    views: {
      'tabPO': {
        templateUrl: 'views/supplier/logistics-tracking.html',
        controller: 'LogisTrackCtrl'
      }
    }
  })
});