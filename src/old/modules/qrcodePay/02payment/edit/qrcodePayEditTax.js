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
	MainApp.register.controller('qrcodePayEditTaxCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework,$css
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
		) {
			var myFunction = function (e) {
				$scope.button_disable = false
				//window.removeEventListener("cancelBiometric", myFunction);
			}
			window.addEventListener('cancelBiometric', myFunction);

			var securityTypes = securityServices.getSecurityTypes();
			if(localStorage.getItem('defaultType') != null && localStorage.getItem('defaultType') != ""){
				$scope.defaultSecurityType = JSON.parse(localStorage.getItem('defaultType'))
			}
			else{
				$scope.defaultSecurityType = securityTypes[0];
			}
			console.log($scope.defaultSecurityType.key)
			$scope.Type_border = function(last){
				return {
					"border-bottom":"none"
				}
			}
			$scope.popup_Height = {
				"height": "24px" 
			}

			if(securityTypes.length == 2){
				if(localStorage.getItem('pay_setting')=='1'){
					if($scope.defaultSecurityType.key == 'NONSET'){
						$scope.anotherSecurityType = [securityTypes[1]];
						
					}
					else if($scope.defaultSecurityType.key == 'OTP'){
						if(securityTypes[1].key == 'OTP'){
							$scope.anotherSecurityType = [securityTypes[0]];
						}
						else{
							$scope.anotherSecurityType = [securityTypes[1]];
						}
					}
					else{
						$scope.anotherSecurityType = [securityTypes[0]];						
					}
				}
				else{
					if($scope.defaultSecurityType.key == 'NONSET'){
						$scope.anotherSecurityType = [securityTypes[1]];
						
					}
					else if($scope.defaultSecurityType.key == 'OTP'){
							$scope.anotherSecurityType = [securityTypes[0]];
						
					}				
				}

			}
			else if (securityTypes.length == 3) {
				if($scope.defaultSecurityType.key == 'NONSET'){
					$scope.anotherSecurityType = [securityTypes[1],securityTypes[2]];
				}
				else if($scope.defaultSecurityType.key == 'OTP'){
					$scope.anotherSecurityType = [securityTypes[0],securityTypes[2]];

				}
				else if($scope.defaultSecurityType.key == 'Biometric'){
					$scope.anotherSecurityType = [securityTypes[0],securityTypes[1]];
				}
				$scope.Type_border = function(last){
					if(last){
						return {
							"border-bottom":"none"
						}
					}
					else{
						return {
							"border-bottom":"1px solid #999999"
						}
					}
				}
				$scope.popup_Height = {
					"height": "48px" 
				}
				
			}
			$scope.changeSecurity = function (key) {
				if(securityTypes.length == 2){
					if(localStorage.getItem('pay_setting')=='1'){
						if (key == 'NONSET' || key == 'OTP') {
							$scope.defaultSecurityType = securityTypes[0];
							$scope.anotherSecurityType = [securityTypes[1]];
						} 
						else {
							$scope.defaultSecurityType = securityTypes[1];
							$scope.anotherSecurityType = [securityTypes[0]];
						}
					}
					else{
						if (key == 'NONSET') {
							$scope.defaultSecurityType = securityTypes[0];
							$scope.anotherSecurityType = [securityTypes[1]];
						}
						else {
							$scope.defaultSecurityType = securityTypes[1];
							$scope.anotherSecurityType = [securityTypes[0]];
						}
					}
				}
				if(securityTypes.length == 3){
					if (key == 'NONSET') {
						$scope.defaultSecurityType = securityTypes[0];
						$scope.anotherSecurityType = [securityTypes[1],securityTypes[2]];
					} 
					else if(key == 'OTP'){
						$scope.defaultSecurityType = securityTypes[1];
						$scope.anotherSecurityType = [securityTypes[0],securityTypes[2]];
					}
					else {
						$scope.defaultSecurityType = securityTypes[2];
						$scope.anotherSecurityType = [securityTypes[0],securityTypes[1]];
					}
				}
				$scope.onChangeSecurityType = false;

			}

			$scope.qrcode = $stateParams.qrcode;
			$scope.trnsLimitAmt = $stateParams.trnsLimitAmt;

			$scope.form = {
				trnsfrOutAcct: $stateParams.trnsfrOutAcct
				, secureCode: $stateParams.qrcode.secureCode
				, acqInfo: $stateParams.qrcode.acqInfo
			};
			// if ($stateParams.qrcode.txnAmt != null && $stateParams.qrcode.txnAmt != '' && typeof ($stateParams.qrcode.txnAmt) != 'object') {
			// 	// 檢查限額(統一在表單送出後檢查)
			// 	// if($scope.trnsLimitAmt<$stateParams.qrcode.txnAmt){
			// 	// 	alert('超過單筆限額');
			// 	// 	$scope.clickCancel();//結束流程
			// 	// }
			// 	$scope.form.trnsAmount = parseInt($stateParams.qrcode.txnAmt) / 100;
			// 	$scope.disableAmountInput = true;
			// }
			//訂單編號(針對可能為空值特別處理)
			// if ($stateParams.qrcode.orderNbr != null && typeof ($stateParams.qrcode.orderNbr) != 'object') {
			// 	$scope.form.orderNumber = $stateParams.qrcode.orderNbr;
			// 	$scope.disableOrderNumberInput = true;
			// }
			//交易幣別(針對可能為空值特別處理)
			// if ($stateParams.qrcode.txnCurrencyCode != null && typeof ($stateParams.qrcode.txnCurrencyCode) != 'object') {
			// 	$scope.form.txnCurrencyCode = $stateParams.qrcode.txnCurrencyCode;
			// }

			//QRCode效期(針對可能為空值特別處理)
			// if ($stateParams.qrcode.qrExpirydate != null && typeof ($stateParams.qrcode.qrExpirydate) != 'object') {
			// 	$scope.form.qrExpirydate = $stateParams.qrcode.qrExpirydate;
			// }
			qrcodePayServices.requireLogin();
			// $scope.submit = function(){
			//     var set_data = {};
			//     $state.go('qrcodePayResult',set_data,{location: 'replace'});
			// }



			//繳款類別(針對可能為空值特別處理)
			if ($stateParams.qrcode.payCategory != null && typeof ($stateParams.qrcode.payCategory) != 'object') {
				$scope.form.payCategory = $stateParams.qrcode.payCategory;
				if($scope.form.payCategory=='11331')
					$scope.form.businessType='T';
				//$scope.disableOrderNumberInput = true;
			}
			//交易幣別(針對可能為空值特別處理)
			if ($stateParams.qrcode.payNo != null && typeof ($stateParams.qrcode.payNo) != 'object') {
				$scope.form.payNo = $stateParams.qrcode.payNo;
			}

			if ($stateParams.qrcode.payEndDate != null && typeof ($stateParams.qrcode.payEndDate) != 'object') {
				$scope.form.payEndDate = $stateParams.qrcode.payEndDate;
				//$scope.disableOrderNumberInput = true;
			}
			//交易幣別(針對可能為空值特別處理)
			if ($stateParams.qrcode.trnsfrAmount != null && typeof ($stateParams.qrcode.trnsfrAmount) != 'object') {
				$scope.form.trnsfrAmount = $stateParams.qrcode.trnsfrAmount;
			}

			//識別碼(針對可能為空值特別處理)
			if ($stateParams.qrcode.identificationCode != null && typeof ($stateParams.qrcode.identificationCode) != 'object') {
				$scope.form.identificationCode = $stateParams.qrcode.identificationCode;
			}

			//期別代碼(針對可能為空值特別處理)
			if ($stateParams.qrcode.periodCode != null && typeof ($stateParams.qrcode.periodCode) != 'object') {
				$scope.form.periodCode = $stateParams.qrcode.periodCode;
			}


			/**
			 * 點選切換安控機制
			 */
			$scope.clickChangeSceurityType = function (show) {
				$scope.onChangeSecurityType = show;
			}

			/**
			 * 點選確認
			 */
			$scope.clickSubmit = function () {
				// var params = {
				// 	qrcode: $scope.qrcode,
				// 	paymentData: $scope.form,
				// 	securityType: $scope.defaultSecurityType
				// };
				// if ($scope.form.trnsAmount == null || $scope.form.trnsAmount.length == 0) {
				// 	alert('請輸入交易金額');
				// 	return;
				// }
				// if ($scope.form.orderNumber == null || $scope.form.orderNumber.length == 0) {
				// 	alert('請輸入訂單編號');
				// 	return;
				// }
				//檢查單日限額
				// var limit = parseInt($scope.trnsLimitAmt) / 100;
				// if ($scope.form.trnsAmount > limit) {
				// 	alert('本交易超過單筆交易限額');
				// 	$scope.clickCancel();//結束流程
				// }

				// $state.go('qrcodePayTaxCheck', params);
				$scope.paymentData = $scope.form;
				qrcodePayServices.getLoginInfo(function(info){
					if( ($scope.defaultSecurityType.key=='NONSET') && (info.cn==null || info.cn=='')){
						framework.alert('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。', function(){
							qrcodePayServices.closeActivity();
						});
						return;
					}
					$scope.paymentData.custId = info.custId;
					var form = angular.copy($scope.paymentData);//因顯示和實際發出資料會有不同所以copy一份以免異常
					form.trnsAmount = form.trnsAmount*100;
					form.merchantName = encodeURI( $scope.qrcode.merchantName );

					$scope.button_disable = true

					securityServices.send('qrcodePay/fq000106', form, $scope.defaultSecurityType, function(res, error){
						if(res){
							var params = {
								qrcode:$scope.qrcode,
								result:res
							};
							$state.go('qrcodePayTaxResult',params,{location: 'replace'});
						}else{
							framework.alert(error.respCodeMsg, function(){
								qrcodePayServices.closeActivity();
							});
						}
					});
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
