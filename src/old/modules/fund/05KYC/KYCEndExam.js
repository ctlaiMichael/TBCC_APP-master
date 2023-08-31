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
	MainApp.register.controller('KYCEndExamCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
			
		) {
			//==參數設定==//
			//$css.add('ui/newMainPage/css/main.css');
			$scope.result = $stateParams.result;
			//$scope.result = {"@xmlns:fi0":"http://mnb.hitrust.com/service/schema/fi000604","@xsi:type":"fi0:fi000604ResultType","custId":"B121194483","type":"1","score":"56","rtType":"2","rtTypeDesc":"穩健型","detailDesc":"穩健型：願意承擔適度投資風險，可接受投資標的價格小幅波動，追求穩定成長之報酬率。","result":"0","respCode":"","respCodeMsg":""}
			
			if(($scope.result.respCode == null|| $scope.result.respCode == '') && $scope.result.trnsRsltCode!=null){
				$scope.result.respCode = $scope.result.trnsRsltCode;
			}
			if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.trnsRsltCodeMsg!=null){
				$scope.result.respCodeMsg = $scope.result.trnsRsltCodeMsg;
			}
			if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.hostCodeMsg!=null){
				$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
			}
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				
			}

			$scope.clickBack = function () {
				framework.confirm('是否離開風險承受度測驗。',function(ok){
					if(ok){framework.backToNative()};
					//return;
				});
			}
			
			$scope.clickSubmit = function () {	
				framework.backToNative();
				
			}

			if($scope.result.isFirstKYC == 'Y'){
				$scope.isFirstKYC = 'Y';
			}

		});
	//=====[ END]=====//


});