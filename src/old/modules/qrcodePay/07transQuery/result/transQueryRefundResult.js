/**
 * []
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('transQueryRefundResultCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil
			, qrcodePayServices, $window
			, qrCodePayTelegram
			, qrcodeTelegramServices
		) {
			//==參數設定==//
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.formatDate = stringUtil.formatDate;
			$scope.formatAcct = stringUtil.formatAcct;
			$scope.numFmt = stringUtil.formatNum;

			$scope.result = $stateParams.result;
			// console.log(JSON.stringify($scope.result));
			$scope.result.respCode = $scope.result.trnsRsltCode;
			$scope.result.hostCode = $scope.result.hostCode;
			$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
			$scope.trnsStatus = "已退款";
			$scope.trnsAcctReFmt = $scope.result.QR.trnsAcct;
			if ($scope.trnsAcctReFmt.length>13) {
				$scope.trnsAcctReFmt = $scope.trnsAcctReFmt.substr(-13,13);
			}

			
			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				// qrcodePayServices.closeActivity();
				var from = {};
				qrcodePayServices.backToQRTransList(from);
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;
			document.addEventListener("backbutton", $scope.clickBack, false);

		});
	//=====[ END]=====//


});