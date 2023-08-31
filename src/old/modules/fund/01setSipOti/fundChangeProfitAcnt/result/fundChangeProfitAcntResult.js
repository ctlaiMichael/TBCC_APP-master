/**
 * []
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('fundChangeProfitAcntResultCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, stringUtil, framework, sysCtrl
			, qrcodePayServices
			, qrCodePayTelegram
		) {
			//==參數設定==//
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.numFmt = stringUtil.formatNum;
			$scope.displayParam = $stateParams.displayParam;
			$scope.response = $stateParams.response;

			//android實體鍵盤返回鍵lock
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				$state.go('fundResultProfitAcnt',{},{location: 'replace'});
			}

			//下行電文 回覆訊息顯示
			function checkResSatatus(res) {
				$scope.result = {};
				$scope.result.respCode = res.respCode;
				$scope.result.trnsRsltCode = res.trnsRsltCode;
				$scope.result.respCodeMsg = res.respCodeMsg;
				$scope.result.trnsRsltCodeMsg = res.trnsRsltCodeMsg;
				$scope.result.hostCodeMsg = res.hostCodeMsg;
				$scope.result.hostCode = res.hostCode;

				if (($scope.result.respCode == null || $scope.result.respCode == '') && $scope.result.trnsRsltCode != null) {
					$scope.result.respCode = $scope.result.trnsRsltCode;
				}
				if (($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.trnsRsltCodeMsg != null) {
					$scope.result.respCodeMsg = $scope.result.trnsRsltCodeMsg;
				}
				if (($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.hostCodeMsg != null) {
					$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
				}
			}
			checkResSatatus($scope.response); //下行電文 回覆訊息顯示


			$scope.clickDisAgree = function () {
				framework.backToNative();
			}
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;


		});
	//=====[ END]=====//


});