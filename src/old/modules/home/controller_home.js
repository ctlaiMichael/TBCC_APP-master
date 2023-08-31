define(['app'], function (app) {

    app.controller('HomeCtrl', function ($scope, $window, $log, $http, $rootScope, i18n, sysCtrl, framework, view) {
        //navigator.app.clearCache();
        $rootScope.activePage = "home";

        $scope.redirect = function (url) {
            view.switch(url);
        }

    });
});