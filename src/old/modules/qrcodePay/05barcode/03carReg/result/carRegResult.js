/**
 * [註冊手機條碼 Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('carRegResultCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, stringUtil, framework
			, qrcodePayServices
			, qrCodePayTelegram
			, qrcodeTelegramServices
		) {
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

			// console.log(JSON.stringify($stateParams.result));
			if ($stateParams.result.code == "200") {
				if ($stateParams.result.GeneralCarrierCode != "") {
					qrcodePayServices.getLoginInfo(function (res) {
						var form = {};
						form.custId = res.custId;
						form.mobileBarcode = $stateParams.result.GeneralCarrierCode; 
						// console.log(JSON.stringify(form));
						qrCodePayTelegram.send('qrcodePay/fq000301', form, function (res) {
							// console.log(JSON.stringify(res));
							if (res) {
								$scope.mobileBarcode = $stateParams.result.GeneralCarrierCode;
							} else {
								var errmsg = "手機條碼更新失敗，\n請先確認您的Email信箱 " + $stateParams.result.Email + " ，\n再重新查詢一次";
								framework.alert(errmsg, function () {
									$state.go('carRegEdit', {});  //back to 註冊手機條碼編輯頁
									return;
								});
							}
						}, null, false);
					});
				}else {
					var errmsg = "手機條碼 更新失敗，\n請先確認您的Email信箱 " + $stateParams.result.Email + " ，\n再重新查詢一次";
					framework.alert(errmsg, function () {
						$state.go('carRegEdit', {});  //back to 註冊手機條碼編輯頁
						return;
					});
				}				
			}

			$scope.result = $stateParams.result;
			if(($scope.result.respCode == null || $scope.result.respCode == '') && $scope.result.trnsRsltCode!=null){
				$scope.result.respCode = $scope.result.trnsRsltCode;
			}
			if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.trnsRsltCodeMsg!=null){
				$scope.result.respCodeMsg = $scope.result.trnsRsltCodeMsg;
			}
			if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.hostCodeMsg!=null){
				$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
			}
			// console.log(JSON.stringify($scope.result));

			
			//一維條碼 設定
			$scope.bc = {
				format: 'CODE39',
				lineColor: '#000000',
				width: 2,
				height: 100,
				displayValue: false,
				fontOptions: '',
				font: 'monospace',
				textAlign: 'center',
				textPosition: 'bottom',
				textMargin: 2,
				fontSize: 20,
				background: '#ffffff',
				margin: 0,
				marginTop: undefined,
				marginBottom: undefined,
				marginLeft: undefined,
				marginRight: undefined,
				valid: function (valid) {
				}
			};

			
			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				qrcodePayServices.backToEinvoice();
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;
			$scope.clickSubmit = function () {
				if ($scope.result.respCode == 0) {
					$state.go('getBarcodeTerm', {});  //back to 查詢手機條碼顯示頁
				}else {
					$state.go('carRegEdit', {});  //back to 註冊手機條碼編輯頁
				}
			}
			// document.addEventListener("backbutton", $scope.clickBack, false);

		});
	//=====[ END]=====//
});