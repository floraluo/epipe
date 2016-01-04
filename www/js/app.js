// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova', 'starter.controller', 'starter.directive', 'starter.service'])

.run(function($ionicPlatform, $rootScope, $state, $stateParams) {
  $rootScope.appReady = {status:false};
  $ionicPlatform.ready(function() {
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
  });
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
  $ionicConfigProvider.tabs.position('bottom').style('standard');
  $urlRouterProvider.otherwise('supplier/home');

  $stateProvider.state('supplier', {
    url: '/supplier',
    abstract: true,
    views: {
      '': {
        templateUrl: 'views/supplier/main-menu.html',
        controller: 'SupplierCtrl'
      },
      // 'headBar@supplier': {
      //   templateUrl: 'tpl/menu-head-bar.html'
      // },
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
    cache: false,
    url: '/login',
    views: {
      'main': {
        templateUrl: 'views/supplier/login.html',
        controller: 'loginCtrl'       
      }
    }
  })
  // .state('login', {
  //   url: '/login',
  //   views: {
  //     '': {
  //       templateUrl: 'tpl/main-menu.html'
  //     },
  //     'supplierLogin': {
  //       templateUrl: 'views/supplier/login.html',
  //       controller: 'loginCtrl'       
  //     }
  //   }
  // })
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
  .state('supplier.modifyPerInfo', {
    url: '/modifyPerInfo',
    views: {
      'tabPersonalCenter': {
        templateUrl: "views/supplier/modifyPerInfo.html",
        controller: 'personalCtrl'
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