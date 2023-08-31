/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/service/qrcodePay/securityServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('qrcodePayEdit2Ctrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
			, qrcodeTelegramServices
		) {

			var securityTypes = securityServices.getSecurityTypes();
			$scope.defaultSecurityType = securityTypes[0];
			if (securityTypes.length == 2) {
				$scope.anotherSecurityType = securityTypes[1];
			}


			$scope.changeSecurity = function (key) {
				if (key == 'NONSET') {
					$scope.defaultSecurityType = securityTypes[0];
					$scope.anotherSecurityType = securityTypes[1];
				} else {
					$scope.defaultSecurityType = securityTypes[1];
					$scope.anotherSecurityType = securityTypes[0];
				}
				$scope.onChangeSecurityType = false;
			}


			$scope.clickChangeSceurityType = function (show) {
				$scope.onChangeSecurityType = show;
			}
			$scope.qrcode = $stateParams.qrcode;
			$scope.trnsLimitAmt = $stateParams.trnsLimitAmt;

			$scope.form = {
				trnsfrOutAcct: $stateParams.trnsfrOutAcct
				, secureCode: $stateParams.qrcode.secureCode
				, acqInfo: $stateParams.qrcode.acqInfo
			};

			qrcodePayServices.getLoginInfo(function (res) {
				$scope.form9 = {
					txnType: 'A'
				};
				$scope.custId = res.custId;
				$scope.form9.custId = $scope.custId;
				qrCodePayTelegram.send('qrcodePay/fq000101', $scope.form9, function(res, resultHeader){
					//檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
					if(res){
						if(res.trnsOutAccts == null 
							|| res.trnsOutAccts.trnsOutAcct == null ){
							framework.alert("未開通晶片金融卡，請臨櫃申請");
							qrcodePayServices.closeActivity();
						}
						var acts = res.trnsOutAccts.trnsOutAcct;
						acts = qrcodeTelegramServices.modifyResDetailObj(res.trnsOutAccts.trnsOutAcct);
						// //取得進行SmartPay開通功能開關
						//$scope.isAgreeQRCode = (res.isAgreeQRCode!=null && typeof(res.isAgreeQRCode)=='string' && res.isAgreeQRCode.toUpperCase()=='Y');
						$scope.accts = [];
						for(key in acts){
							//檢查是否為預設SmartPay帳戶
							if(acts[key].acctNo == res.defaultTrnsOutAcct){
								acts[key].selected = true;
							}
							// if(typeof(acts[key].enabledSmartPay)!='string'){
							// 	acts[key].enabledSmartPay='';
							// }
							$scope.accts.push(acts[key]);
						}
						if($scope.accts.length==0){
							framework.alert("未開通晶片金融卡，請臨櫃申請", function(){
								qrcodePayServices.closeActivity();
							});
						}
						$scope.defaultTrnsOutAcct =res.defaultTrnsOutAcct;
						$scope.disable = false;
					}else{
						framework.alert(resultHeader.respCodeMsg, function(){
							qrcodePayServices.closeActivity();
						});
					}
			});
		});

			if ($stateParams.qrcode.txnAmt != null && $stateParams.qrcode.txnAmt != '' && typeof ($stateParams.qrcode.txnAmt) != 'object') {
				// 檢查限額(統一在表單送出後檢查)
				// if($scope.trnsLimitAmt<$stateParams.qrcode.txnAmt){
				// 	alert('超過單筆限額');
				// 	$scope.clickCancel();//結束流程
				// }
				$scope.form.trnsAmount = parseInt($stateParams.qrcode.txnAmt) / 100;
				$scope.disableAmountInput = true;
			}
			//訂單編號(針對可能為空值特別處理)
			if ($stateParams.qrcode.orderNbr != null && typeof ($stateParams.qrcode.orderNbr) != 'object') {
				$scope.form.orderNumber = $stateParams.qrcode.orderNbr;
				$scope.disableOrderNumberInput = true;
			}
			//交易幣別(針對可能為空值特別處理)
			if ($stateParams.qrcode.txnCurrencyCode != null && typeof ($stateParams.qrcode.txnCurrencyCode) != 'object') {
				$scope.form.txnCurrencyCode = $stateParams.qrcode.txnCurrencyCode;
			}

			//QRCode效期(針對可能為空值特別處理)
			if ($stateParams.qrcode.qrExpirydate != null && typeof ($stateParams.qrcode.qrExpirydate) != 'object') {
				$scope.form.qrExpirydate = $stateParams.qrcode.qrExpirydate;
			}
			qrcodePayServices.requireLogin();
			// $scope.submit = function(){
			//     var set_data = {};
			//     $state.go('qrcodePayResult',set_data,{location: 'replace'});
			// }

			/**
			 * 點選切換安控機制
			 */
			

			/**
			 * 點選確認
			 */
			$scope.clickSubmit = function () {
				var params = {
					qrcode: $scope.qrcode,
					paymentData: $scope.form,
					securityType: $scope.defaultSecurityType
				};
				if ($scope.form.trnsAmount == null || $scope.form.trnsAmount.length == 0) {
					framework.alert('請輸入交易金額');
					return;
				}
				if ($scope.form.orderNumber == null || $scope.form.orderNumber.length == 0) {
					framework.alert('請輸入訂單編號');
					return;
				}
				//檢查單日限額
				var limit = parseInt($scope.trnsLimitAmt) / 100;
				if ($scope.form.trnsAmount > limit) {
					framework.alert('本交易超過單筆交易限額');
					$scope.clickCancel();//結束流程
				}
				$scope.paymentData = $scope.form;
				var form = angular.copy($scope.paymentData);
				form.custId = $scope.custId;
				//alert(form.custId);
				form.trnsAmount = form.trnsAmount * 100;
				form.merchantName = encodeURI($scope.qrcode.merchantName);
				form.mobileBarcode = "";
				securityServices.send('qrcodePay/fq000105', form, $scope.defaultSecurityType, function (res, error) {
					if (res) {
						var params = {
							qrcode: $scope.qrcode,
							result: res
						};
						$state.go('qrcodePayResult', params, { location: 'replace' });
					} else {
						framework.alert(error.respCodeMsg, function () {
							qrcodePayServices.closeActivity();
						});
					}

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
