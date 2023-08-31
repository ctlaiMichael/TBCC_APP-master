/**
 * [推薦人編號設定 Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/service/qrcodePay/barcodeServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('referenceEditCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework
			, qrcodePayServices
			, qrCodePayTelegram
			, qrcodeTelegramServices
			
		) {
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				qrcodePayServices.closeActivity();
			}
			$scope.result = $stateParams.result;
			if($scope.result.employNo =="[object Object]"){$scope.result.employNo="";}
			//alert($scope.result.employNo);
			// referenceNo = $scope.result.hostCode.toString();
			// alert(referenceNo);
			/**
			 * 點選確認
			 */
			$scope.clickSubmit = function () {
				//推薦人編號檢查
				if ( ($scope.result.employNo == "") || (typeof $scope.result.employNo == 'undefined') ) {
					framework.alert("請輸入推薦人編號");
					return;
				}
				// if ($scope.result.employNo.length != 6) {
				// 	framework.alert("推薦人編號長度須為6碼");
				// 	return;
				// }
				// console.log($scope.referenceNo);
				// console.log(typeof $scope.referenceNo);
				// console.log($scope.referenceNo.length);

				//更新推薦人編號
				qrcodePayServices.getLoginInfo(function (res) {
					var form = {};
					form.custId = res.custId;
					form.employNo = $scope.result.employNo;
					qrCodePayTelegram.send('qrcodePay/fq000108', form, function (res) {
						// console.log(JSON.stringify(res));
						if (res) {
							res.referenceNo = $scope.result.employNo;
							$state.go('referenceResult', { result: res });
						} else {
							framework.alert('更新推薦人編號失敗!', function () {
								qrcodePayServices.closeActivity();
								return;
							});
						}
					}, null, false);
				});

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
