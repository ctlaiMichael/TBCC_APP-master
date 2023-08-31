/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
	, 'modules/service/qrcodePay/securityServices'
	, 'modules/directive/security/securitySelectorDirective.js'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('KYCHasAuthCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices,securityServices
			, qrCodePayTelegram
			
		) {
			//==參數設定==//
			//$css.add('ui/newMainPage/css/main.css');
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			//$scope.form6 = $stateParams.form6;
			$scope.noSSL = true;
			$scope.noOTP = false;

			

			
			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				
			}

			
			$scope.clickSubmit = function () {	
				$state.go('KYCBaseData',params,{location: 'replace'});
				
			}

			$scope.clickBack = function () {
				framework.confirm('是否離開風險承受度測驗。',function(ok){
					if(ok){framework.backToNative()};
					//return;
				});
			}

		});
	//=====[ END]=====//


});