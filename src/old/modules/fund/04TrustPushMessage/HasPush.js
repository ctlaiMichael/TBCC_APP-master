/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('HasPushCtrl',
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
			//$scope.form6 = $stateParams.form6;

			$scope.result = $stateParams.result;
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				
			}

			$scope.year1 = $scope.result.modifyDate.substring(0,4);
			$scope.month1 = $scope.result.modifyDate.substring(4,6);
			$scope.day1 = $scope.result.modifyDate.substring(6,8);

			// alert("111"+$scope.result.modifyDate);
			// alert("222"+$scope.year1);

			
				
			

			$scope.clickSubmit = function () {	
				$state.go('fundStopPush',{});
				
			}

			// qrcodePayServices.getLoginInfo(function (res) {
			// 	//保留 custId
			// 	//alert("aaa");
			// 	$scope.custId = res.custId;
				
			// });

			$scope.clickBack = function () {
				framework.backToNative();
			}

		});
	//=====[ END]=====//


});