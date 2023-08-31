/**
 * [註冊手機條碼 Ctrl]
 */
define([
	'app'
	, 'modules/directive/barcodeLeftMenu/barcodeLeftMenuDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'service/formServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('carRegEditCtrl',
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
				var checkMobile = formServices.checkMobile($scope.phoneNo);
				if (!checkMobile.status) {
					framework.alert(checkMobile.msg);
					return;
				}
				//檢查Email信箱
				if (($scope.email == "") || (typeof $scope.email == 'undefined')) {
					framework.alert("請輸入Email信箱  ");
					return;
				}
				var checkEmail = formServices.checkEmail($scope.email);
				if (!checkEmail.status) {
					framework.alert(checkEmail.msg);
					return;
				}

				
				//檢核無誤送出電文
				var form = {};
				form.email = $scope.email;
				form.phoneNo = $scope.phoneNo;
				// console.log(JSON.stringify(form));
				qrCodePayTelegram.send('qrcodePay/fq000401', form, function (res) {
					// console.log(JSON.stringify(res));
					if (res) {
						var newres = qrcodePayServices.convertRes(res);
						if (typeof newres == "string") {
							framework.alert(newres, function () {
								// qrcodePayServices.backToEinvoice();
								return;  //停留原頁
							});
						} else {
							$state.go('carRegResult', { result: newres });
						}
					} else {
						framework.alert("註冊手機條碼 失敗", function () {
							// qrcodePayServices.backToEinvoice();
							return;  //停留原頁
						});
					}
				}, null, false);
			}

			/**
			 * 點選清除
			 */
			$scope.clickClear = function () {
				$scope.phoneNo = "";
				$scope.email = "";
			}

			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				qrcodePayServices.backToEinvoice();  //back to 查詢手機條碼顯示頁
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;
			// document.addEventListener("backbutton", $scope.clickBack, false);

		});
	//=====[END]=====//
});
