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
	MainApp.register.controller('AgreePushCtrl',
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

			// var coin =[];
			// $scope.item1 = ["就業中","退休","家管","學生","待業中","學齡前"];
			// $scope.item2 = ["軍警","政府機關","教育研究","經商","金融保險","電子資訊工程","建築營造","製造業","服務業","醫療","法律及會計業","自由業","博弈業","珠寶貴金屬業","武器戰爭設備","典當民間融資","其他：＿＿ "];
			// $scope.item3 = ["50萬元(未逾)","50萬以上～100萬元","100萬以上～300萬元","300萬以上～500萬元","500萬以上～1000萬元","1000萬以上～5000萬元","5000萬以上～1億元","1億以上～5億元","5億以上～10億元"];
			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				
			}

			if(localStorage.getItem("pushmessage") == '1'){$scope.state = '1'}
			else if(localStorage.getItem("pushmessage") == '2'){$scope.state = '2'}
			
			$scope.clickSubmit = function () {	
				framework.backToNative();
				
			}

			

		});
	//=====[ END]=====//


});