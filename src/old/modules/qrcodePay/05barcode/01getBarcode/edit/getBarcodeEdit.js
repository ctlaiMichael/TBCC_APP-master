/**
 * [查詢手機條碼 Ctrl]
 */
define([
	'app'
	, 'modules/directive/barcodeLeftMenu/barcodeLeftMenuDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'service/formServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('getBarcodeEditCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework
			, qrcodePayServices
			, qrCodePayTelegram
			, qrcodeTelegramServices
			, formServices
		) {
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

			/**
			 * 點選確認
			 */
			$scope.clickSubmit = function () {
				//檢查手機號碼
				if (($scope.phoneNo == "") || (typeof $scope.phoneNo == 'undefined')) {
					framework.alert("請輸入手機號碼  ");
					return;
				}
				var res = /^[0-9]*$/;
				if (!res.test($scope.phoneNo)) {
					framework.alert("手機號碼須為數字  ");
					return;
				}
				var checkMobile = formServices.checkMobile(String($scope.phoneNo));
				if (!checkMobile.status) {
					framework.alert(checkMobile.msg);
					return;
				}
				//手機條碼驗證碼
				if (($scope.verificationCode == "") || (typeof $scope.verificationCode == 'undefined')) {
					framework.alert("請輸入手機條碼驗證碼  ");
					return;
				}
				if ($scope.verificationCode.length < 4 || $scope.verificationCode.length > 16) {
					framework.alert('手機條碼驗證碼長度需 4~16 碼');
					return;
				}


				//檢核無誤送出電文
				var form = {};
				form.phoneNo = $scope.phoneNo;
				form.verifyCode = $scope.verificationCode;
				// console.log(JSON.stringify(form));
				qrCodePayTelegram.send('qrcodePay/fq000403', form, function (res) {
					// console.log(JSON.stringify(res));
					if (res) {
						var newres = qrcodePayServices.convertRes(res);
						if (typeof newres == "string") {
							framework.alert(newres, function () {
								// qrcodePayServices.backToEinvoice();
								return;  //停留原頁
							});
						} else {
							$state.go('getBarcodeResult', { result: newres });
						}
					} else {
						framework.alert("手機條碼查詢失敗，請再查詢一次", function () {
							// qrcodePayServices.backToEinvoice();
							return;  //停留原頁
						});
					}
				}, null, false);
			}


			//查詢驗證碼
			$scope.clickForgetVer = function () {
				$state.go('forgetVerEdit', {});
			}


			/**
			 * 點選清除
			 */
			$scope.clickClear = function () {
				$scope.phoneNo = "";
				$scope.verificationCode = "";
			}

			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				qrcodePayServices.backToEinvoice();
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;
			// document.addEventListener("backbutton", $scope.clickBack, false);

		});
	//=====[END]=====//
});
