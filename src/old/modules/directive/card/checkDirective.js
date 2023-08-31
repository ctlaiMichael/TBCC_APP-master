/**
 * [Check Directive] 驗證directive
 */
define([
	'app'
	,'app_telegram/fc000103Telegram'
],function(MainApp,doNgRepeat){



/**
 * [checkCaptchaDirective] 圖形驗證碼
 * @param  {number}	$scope.showBoxStep		[當前step]
 */
MainApp.register.directive('checkCaptchaDirective', function($rootScope,fc000103Telegram,i18n){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		//==圖形驗證碼設定==//
		$scope.checkCaptchaData = {
			id : '',
			name : '',
			input : '',
			captcha : ''
		};
		$scope.checkCaptchaData.check_method = function(){
			if($scope.checkCaptchaData.input == ''){
				iElm.find('.input_captcha').addClass('input_error');
				return false;
			}
			return true;
		}

		//==圖形驗證碼取得==//
		$scope.captchaChange = function()
		{
			$scope.checkCaptchaData.input = '';
			$scope.checkCaptchaData.captcha = '';
			iElm.find('.input_captcha').removeClass('input_error');

			var success_method = function(captcha){
				$scope.checkCaptchaData.captcha = captcha;
				// console.log(captcha.replace(/^"data:*/jpeg;base64,"/,''));
				// console.log(captcha.replace(/^data:image\//,''));
				// console.log(captcha.replace(/^(\w+)\s*,/,''));
				
				$rootScope.isLoading = false;
				$rootScope.$broadcast('isLoading', false); // 強制關閉
			}
			var error_method = function(jsonObj){
				MainUiTool.openDialog(jsonObj.respCodeMsg);
				$rootScope.isLoading = false;
				$rootScope.$broadcast('isLoading', false); // 強制關閉
			}

			fc000103Telegram.getData(success_method,error_method);
		}
		$scope.captchaChange();

	};
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		replace: false,
		templateUrl: 'modules/template/check/check_captcha.html',
		link: linkFun
	};
});
//=====[checkCaptchaDirective END]=====//

});