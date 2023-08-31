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
	MainApp.register.controller('getBarcodeShowCtrl',
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
			$scope.hasBarcode = false;
			$scope.hasLoveCode = false;
			$scope.barcode = "1";
			let custId = "";
			let defaultBarcode = "1";

			qrcodePayServices.getLoginInfo(function (res) {
				var form = { txnType: 'E' };
				form.custId = res.custId;
				custId = res.custId;
				qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res) {
					// console.log(JSON.stringify(res));
					if (res) {
						if (typeof res.mobileBarcode == "undefined" || res.mobileBarcode == "") {
							$scope.mobileBarcode = "";
						} else {
							$scope.hasBarcode = true;
							$scope.mobileBarcode = res.mobileBarcode;
						}
						if (res.loveCode) {
							$scope.hasLoveCode = true;
							$scope.loveCode = res.loveCode;
							$scope.socialWelfareName = res.socialWelfareName;
						}
						if (res.defaultBarcode && res.defaultBarcode == "2") {
							defaultBarcode = "2";
							$scope.barcode = "2";
						}
						localStorage.setItem("defaultBarcode", defaultBarcode);
					}
				}, null, false);
			});

			//捐贈碼
			$scope.clickGoToLoveCode = function () {
				$state.go('loveCodeEdit', {});
			}

			//查詢手機條碼
			$scope.clickQuery = function () {
				$state.go('getBarcodeEdit', {});
			}

			$scope.termBarcode = function () {
				$state.go('getBarcodeTerm', {});
			}

			$scope.changeDefaultCode = function () {
				if ($scope.barcode !== defaultBarcode) {
					const form = {
						"custId": custId,
						"mobileBarcode": $scope.mobileBarcode,
						"loveCode": $scope.loveCode,
						"socialWelfareName": $scope.socialWelfareName,
						"defaultBarcode": $scope.barcode
					};
					localStorage.setItem("defaultBarcode", $scope.barcode);
					qrCodePayTelegram.send('qrcodePay/fq000301', form, function (res) {
						if (res && res.trnsRsltCode === "0") {
							defaultBarcode = $scope.barcode;
						} else if (res.hostCodeMsg) {
							framework.alert(res.hostCodeMsg);
						}
					}, null, true);
				}
			};

			$scope.deleteBarcode = function () {
				framework.confirm("是否刪除手機條碼", function (ok) {
					if (ok) {
						const form = {
							"custId": custId,
							"mobileBarcode": "",
							"loveCode": $scope.loveCode,
							"socialWelfareName": $scope.socialWelfareName,
							"defaultBarcode": ($scope.loveCode !== "" ? "2" : "")
						};
						qrCodePayTelegram.send('qrcodePay/fq000301', form, function (res) {
							if (res && res.trnsRsltCode === "0") {
								$scope.hasBarcode = false;
								$scope.mobileBarcode = "";
								$scope.barcode = "2";
								localStorage.setItem("defaultBarcode", 2);
							} else if (res.hostCodeMsg) {
								framework.alert(res.hostCodeMsg);
							} else {
								framework.alert("刪除失敗");
							}
						}, null, false);
					}
				}, "刪除");
			}

			$scope.deleteLoveCode = function () {
				framework.confirm("是否刪除捐贈碼", function (ok) {
					if (ok) {
						const form = {
							"custId": custId,
							"mobileBarcode": $scope.mobileBarcode,
							"loveCode": "",
							"socialWelfareName": "",
							"defaultBarcode": ($scope.mobileBarcode !== "" ? "1" : "")
						};
						qrCodePayTelegram.send('qrcodePay/fq000305', form, function (res) {
							if (res && res.trnsRsltCode === "0") {
								$scope.hasLoveCode = false;
								$scope.loveCode = "";
								$scope.barcode = "1";
								localStorage.setItem("defaultBarcode", 1);
							} else if (res.hostCodeMsg) {
								framework.alert(res.hostCodeMsg);
							} else {
								framework.alert("刪除失敗");
							}
						}, null, false);
					}
				}, "刪除");
			}

			$scope.toLoveCodeEdit = function () {
				var params = {
					loveCodeKeyword: $scope.loveCodeKeyword
				};
				$state.go('loveCodeEdit', params);
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
