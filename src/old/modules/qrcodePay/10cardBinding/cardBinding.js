/**
 * [信用卡新增管理 Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/service/qrcodePay/barcodeServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('carBindingCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework
			, qrcodePayServices
			, qrCodePayTelegram
			, qrcodeTelegramServices
			
		) {
            
			$scope.result = $stateParams.result;
			if (typeof $scope.result.hostCode === 'undefined' || $scope.result.hostCode==null || $scope.result.hostCode=='') {
				$scope.result.hostCode = '- -';
			}
			if (typeof $scope.result.hostCodeMsg === 'undefined' || $scope.result.hostCodeMsg==null || $scope.result.hostCodeMsg=='') {
				$scope.result.hostCodeMsg = '- -';
			}

			$scope.clickBackCard = function () {
                $state.go("qrcodePayMenu", {});

			}
			
			$scope.clickGoQrcode = function () {
                $state.go("qrcodePayScanNew", {});

			}
			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				qrcodePayServices.closeActivity();
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;

		});
	//=====[END]=====//
});
