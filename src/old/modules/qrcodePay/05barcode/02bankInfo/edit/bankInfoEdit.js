/**
 * [設定領獎帳號 Ctrl]
 */
define([
	'app'
	, 'modules/directive/barcodeLeftMenu/barcodeLeftMenuDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'service/formServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('bankInfoEditCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n, $rootScope, $timeout
			, framework, stringUtil,$log
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
									$state.go("getBarcodeTerm", {});
									return;
								});
							} else {
								$scope.result.cardNo = res.mobileBarcode;
							}
						} else {
							framework.alert("手機條碼讀取失敗", function () {
								qrcodePayServices.closeActivity();
							});
						}
					}, null, false);
				});
			}

			//取得銀行帳號
			qrcodePayServices.getLoginInfo(function (res) {
				var form = {};
				form.custId = res.custId;
				form.type = "B"; //台幣

				qrCodePayTelegram.send('qrcodePay/f5000101', form, function (res, error) {
					// $log.debug("f5000101:"+JSON.stringify(res));
					if (res) {
						var actsOut = qrCodePayTelegram.toArray(res.trnsOutAccts.trnsOutAcct);
						$scope.InAC = [];
						for (key in actsOut) {
							if (actsOut[key].trnsOutCurr.indexOf("TWD") > -1) {
								var tempIn = {};
								tempIn.acctNo = actsOut[key].trnsfrOutAccnt;
								tempIn.acctName = actsOut[key].trnsfrOutName;
								$scope.InAC.push(tempIn);
							}
						}
						// console.log(JSON.stringify($scope.InAC));
						// $log.debug("in:" + $scope.InAC.length);
						
						if ($scope.InAC.length == 0) {
							framework.alert('銀行帳號查詢失敗', function () {
								qrcodePayServices.closeActivity();  //back to 台灣Pay
								return;
							});
						}else{
							$scope.SelectCreditAcctSelected = $scope.InAC[0].acctNo;
						}
					} else {
						framework.alert(error.respCodeMsg, function () {
							qrcodePayServices.closeActivity();  //back to 台灣Pay
						});
					}
				}, null, false);
			});



			/**
			 * 點選確認
			 */
			$scope.clickSubmit = function () {
				//檢查驗證碼
				if (($scope.cardEncrypt == "") || (typeof $scope.cardEncrypt == 'undefined')) {
					framework.alert("請輸入驗證碼  ");
					return;
				}
				if ($scope.cardEncrypt.length < 4 || $scope.cardEncrypt.length > 16) {
					framework.alert('驗證碼長度需 4~16 碼');
					return;
				}
				//檢查聯絡電話
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
				// console.log("cardNo:" + $scope.result.cardNo + '\n' + "cardEncrypt:" + $scope.cardEncrypt);
				// console.log("phoneNo:" + $scope.phoneNo + '\n' + "accountNo:" + $scope.SelectCreditAcctSelected);

				//檢核無誤送出電文
				qrcodePayServices.getLoginInfo(function (res) {
					var form = {};					
					form.custId = res.custId;
					form.bankNo = "006";
					form.acctNo = $scope.SelectCreditAcctSelected;
					form.mobileBarcode = $scope.result.cardNo;
					form.verifyCode = $scope.cardEncrypt;
					form.winnerPhone = $scope.phoneNo;
					// console.log(JSON.stringify(form));
					qrCodePayTelegram.send('qrcodePay/fq000402', form, function (res) {
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
								$state.go('bankInfoResult', {result: newres});
							}
						} else {
							framework.alert("設定領獎帳號 綁定失敗", function () {
								// qrcodePayServices.closeActivity();
								return;  //停留原頁
							});
						}
					}, null, false);
				});
			}

			/**
			 * 點選清除
			 */
			$scope.clickClear = function () {
				$scope.cardEncrypt = "";
				$scope.phoneNo = "";
			}

			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				qrcodePayServices.closeActivity();  //back to 台灣Pay
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;
			// document.addEventListener("backbutton", $scope.clickBack, false);

		});
	//=====[END]=====//
});