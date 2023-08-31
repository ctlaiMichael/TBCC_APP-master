/**
 * 
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('BoundAgreeCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
			
		) {
			//==參數設定==//
			$css.add('ui/newMainPage/css/main.css');
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
			}

			$scope.result = $stateParams.result;

			$scope.clickSubmit = function () {	
				
				var params = {
					result:$scope.result
				};
				$state.go('outboundData',params,{location: 'replace'});
			}

			$scope.clickBack = function () {
				var title = '跨境電子支付交易-身分認證程序';
				framework.confirm('您已取消身分確認作業',function(ok){
					if(ok){framework.backToNative();};
				},title);
				
			}

		});


});