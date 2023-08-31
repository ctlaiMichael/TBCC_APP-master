/**
 * [查詢手機條碼 Ctrl]
 */
define([
	'app'
	, 'modules/directive/barcodeLeftMenu/barcodeLeftMenuDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'service/formServices'
	, 'modules/service/qrcodePay/barcodeServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('getBarcodeTermCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, $http
			, qrcodePayServices
			, qrCodePayTelegram
			, qrcodeTelegramServices
			, formServices
			, barcodeServices
		) {
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			let loveCode = ""; 
			let socialWelfareName = ""; 
			let defaultBarcode = "";

			qrcodePayServices.getLoginInfo(function (res) {
				var form = { txnType: 'T' };
				form.custId = res.custId;
				qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res) {
					// console.log(JSON.stringify(res));
					if (res) {
						if (typeof res.mobileBarcode == "undefined" || res.mobileBarcode == "") {
							$scope.mobileBarcode = "";
						} else {
							$scope.mobileBarcode = res.mobileBarcode;
							$scope.orgMobileBarcode = res.mobileBarcode;
						}
						if (typeof res.loveCode == "undefined" || res.loveCode == "") {
						} else {
							loveCode = res.loveCode; 
							socialWelfareName = res.loveCodeName; 
						}
						if (localStorage.getItem("defaultBarcode") != null) {
							defaultBarcode = localStorage.getItem("defaultBarcode");
						} else if ($scope.mobileBarcode !== "") {
							defaultBarcode = "1";
						} else if (loveCode !== ""){
							defaultBarcode = "2";
						}
					} else {
						// framework.alert("手機條碼讀取失敗", function () {
						// 	qrcodePayServices.closeActivity();  //back to 台灣Pay
						// });
					}
				}, null, false);
			});

			$scope.clickSubmit = function () {
				var newMobileBarcode = "";
				if (typeof $scope.mobileBarcode == "undefined" || $scope.mobileBarcode == "") {
				}else {
					newMobileBarcode = $scope.mobileBarcode.toUpperCase();
					// console.log("newMobileBarcode=" + newMobileBarcode);
					if (newMobileBarcode.length != 8) {
						framework.alert('手機條碼長度需等於 8 碼');
						return;
					}
					if (newMobileBarcode.substring(0, 1) != "/") {
						framework.alert('手機條碼第1碼須為 / ');
						return;
					}
					var checkStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-.";
					for (var i = 1; i < newMobileBarcode.length; i++) {
						// console.log(newMobileBarcode.substring(i, i + 1));
						if (checkStr.indexOf(newMobileBarcode.substring(i, i + 1)) == -1) {
							framework.alert('手機條碼格式錯誤');
							return;
						}
					}
				}

				qrcodePayServices.getLoginInfo(function (res) {
					var form = {};
					form.custId = res.custId;
					form.mobileBarcode = newMobileBarcode; 
					form.loveCode = loveCode;
					form.socialWelfareName = socialWelfareName;
					form.defaultBarcode = (defaultBarcode === "" ? "1" : defaultBarcode);
					// console.log(JSON.stringify(form));
					qrCodePayTelegram.send('qrcodePay/fq000301', form, function (res) {
						// console.log(JSON.stringify(res));
						if (res) {
							framework.alert('手機條碼設定成功',function(){
								$scope.mobileBarcode = newMobileBarcode;
								$state.go('getBarcodeShow', {});
							});
						} else {
							$scope.mobileBarcode = $scope.orgMobileBarcode;
							framework.alert("手機條碼設定失敗", function () {
								// qrcodePayServices.closeActivity();  //back to 台灣Pay
								return;  //停留原頁
							});
						}
					}, null, false);
				});
			}

			//捐贈碼
			$scope.clickGoToLoveCode = function () {
				$state.go('loveCodeEdit', {});
			}

			//查詢手機條碼
			$scope.clickQuery = function () {
				$state.go('getBarcodeEdit', {});
			}

			//註冊手機條碼
			$scope.clickReg = function () {
				var title = '註冊手機條碼';
				var message = '資訊將會發送到財政部電子發票整合服務平台進行註冊，相關服務請參閱財政部平台說明。';
				framework.confirm(message, function (ok) {
					if (ok) {
						$state.go('carRegEdit', {});
					}
				}, title);
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
