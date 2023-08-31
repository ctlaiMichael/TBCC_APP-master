/**
 * [變更手機條碼驗證碼 Ctrl]
 */
define([
	'app'
	, 'modules/directive/barcodeLeftMenu/barcodeLeftMenuDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'service/formServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('changeVerEditCtrl',
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
			$scope.result = $stateParams.result;

			//結果頁back編輯頁
			if ($scope.result.cardNo == "" || typeof $scope.result.cardNo == "undefined") {
				qrcodePayServices.getLoginInfo(function (res) {
					var form = { txnType: 'T' };
					form.custId = res.custId;
					qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res) {
						// console.log(JSON.stringify(res));
						if (res) {
							if (typeof res.mobileBarcode == "undefined" || res.mobileBarcode == "") {
								framework.alert("無發票載具條碼資訊\n請先查詢或註冊您的發票載具條碼", function () {
									$state.go("getBarcodeTerm", {});  //back to 查詢手機條碼顯示頁
									return;
								});
							} else {
								$scope.result.cardNo = res.mobileBarcode;
							}
						} else {
							framework.alert("手機條碼讀取失敗", function () {
								qrcodePayServices.closeActivity();  //back to 台灣Pay
							});
						}
					}, null, false);
				});
			}

			/**
			 * 點選確認
			 */
			$scope.clickSubmit = function () {
				//檢查原驗證碼
				if (($scope.oldVerify == "") || (typeof $scope.oldVerify == 'undefined')) {
					framework.alert("請輸入 [原驗證碼]  ");
					return;
				}
				if ($scope.oldVerify.length < 4 || $scope.oldVerify.length > 16) {
					framework.alert('[原驗證碼] 長度需 4~16 碼');
					return;
				}
				//檢查新驗證碼
				if (($scope.newVerify == "") || (typeof $scope.newVerify == 'undefined')) {
					framework.alert("請輸入 [新驗證碼]  ");
					return;
				}
				if (($scope.newVerify2 == "") || (typeof $scope.newVerify2 == 'undefined')) {
					framework.alert("請輸入 [再次輸入新驗證碼]  ");
					return;
				}
				if ($scope.newVerify !== $scope.newVerify2) {
					framework.alert("[新驗證碼] 與 [再次輸入新驗證碼] 須相同 ");
					return;
				}
				if ($scope.newVerify.length < 8 || $scope.newVerify.length > 16) {
					framework.alert('[新驗證碼] 長度需 8~16 碼');
					return;
				}
				var res = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/;
				if (!res.test($scope.newVerify)) {
					framework.alert("[新驗證碼] 須有數字與英文字母  ");
					return;
				}


				//檢核無誤送出電文
				var form = {};
				form.mobileBarcode = $scope.result.cardNo;
				form.verifyCode = $scope.oldVerify;
				form.newVerifyCode = $scope.newVerify;
				// console.log(JSON.stringify(form));
				qrCodePayTelegram.send('qrcodePay/fq000404', form, function (res,resultHeader) {
					// console.log(JSON.stringify(res));
					if (res) {
						var newres = qrcodePayServices.convertRes(res);
						if (typeof newres == "string") {
							framework.alert(newres, function () {
								// qrcodePayServices.closeActivity();
								return;  //停留原頁
							});
						} else {
							newres.keepBarcodeMobile = $scope.result.cardNo;
							$state.go('changeVerResult', { result: newres });
						}
					} else {
						framework.alert("變更手機條碼驗證碼失敗", function () {
							// qrcodePayServices.closeActivity();
							return;  //停留原頁
						});
					}
				}, null, false);
			}

			/**
			 * 點選清除
			 */
			$scope.clickClear = function () {
				$scope.oldVerify = "";
				$scope.newVerify = "";
				$scope.newVerify2 = "";
			}

			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				qrcodePayServices.closeActivity();  //back to 台灣Pay
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;
			// document.addEventListener("backbutton", $scope.clickBack, false);

		});
	//=====[END]=====//
});
