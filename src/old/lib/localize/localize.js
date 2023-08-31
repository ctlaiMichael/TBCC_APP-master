var angularTranslate =angular.module('angularTranslate', ['pascalprecht.translate']); //    //'pascalprecht.translate'
    angularTranslate.config(function($translateProvider) {
	  
        var locale = navigator.userAgent.match(/[a-z]{2}-[a-z]{2}/); //because Android navigator.language always returns 'en'
        if (locale) {locale = locale[0]}
        locale = locale || navigator.language;

        // 20191021 關閉英文版
        locale = 'zh-TW';
      
         $translateProvider.useStaticFilesLoader({
                    prefix: 'message/i18n/resources-locale_',
                    suffix: '.json'
         });

          $translateProvider.useSanitizeValueStrategy('escaped');
          $translateProvider.preferredLanguage(locale);
          $translateProvider.fallbackLanguage('zh-TW');

     })
      .service('i18n', function($translate) {

            this.changeLanguage  = function(len){
                $translate.use(len);

            }

            this.getStringByTag = function(tag){
                    return $translate.instant(tag);
            }

      })
      .factory('login', function() {
            return {
                language:''
            };
       })
       .controller('headCtrl', function($http,$scope, login, i18n, $translate){
            $scope.login = login;
            $scope.login.language = $translate.use();

            $scope.changeLanguage = function(){
                i18n.changeLanguage($scope.login.language ,  $scope.login.language);
            }

       }).directive('selectLocal', function() {
            return {
                restrict: 'A',
                transclude: true,
                templateUrl: 'modules/common/selectLocal.html'
            };
        });
