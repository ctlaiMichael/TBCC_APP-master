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
	MainApp.register.controller('qrcodePayEditCardCtrl',
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
			//$css.add('ui/css/fix-back.css');
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
			//debugger;
			// noticeNbr
			// var decodeURI = function(str){
			// 	return decodeURIComponent(str);
			// }
			//20180906加入decodeURI與replace("+","%20")
			//replace(/,/g, "")   replace(/-/g,'')
			//alert($scope.qrcode.noticeNbr.replace(/+/g, "%20"));
			//alert($scope.qrcode.noticeNbr.toString().split('+').join('%20'));
			//alert(decodeURI($scope.qrcode.noticeNbr.toString().split('+').join('%20')));
			$scope.qrcode.noticeNbr = decodeURI($scope.qrcode.noticeNbr.split('+').join('%20'));
			// var kk="+++1111++kkk";
			// kk=kk.replace("+","%20");
			//$scope.qrcode.noticeNbr= decodeURI($scope.qrcode.noticeNbr);
			//alert(encodeURI("   111   888"));
			// alert(decodeURI(kk));
			// alert(decodeURI("+++1111++kkk"));
			//alert(encodeURIComponent($scope.qrcode.noticeNbr));
			//交易金額
			if ($stateParams.qrcode.txnAmt != null && $stateParams.qrcode.txnAmt != '' && typeof ($stateParams.qrcode.txnAmt) != 'object') {
				// 檢查限額(統一在表單送出後檢查)
				// if($scope.trnsLimitAmt<$stateParams.qrcode.txnAmt){
				// 	alert('超過單筆限額');
				// 	$scope.clickCancel();//結束流程
				// }
				$scope.form.txnAmt = parseInt($stateParams.qrcode.txnAmt) / 100;
				//$scope.form.charge = parseInt($stateParams.qrcode.charge) / 100;
				//$stateParams.qrcode.charge = parseInt($stateParams.qrcode.charge) / 100;
				
				if($stateParams.qrcode.canAmtEdit == 'Y'){
					$scope.disableAmountInput=false;
					$scope.value2 = true;
				}
				else{$scope.disableAmountInput = true;}
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

			//繳納期限輸入為空之處理
			if( $stateParams.qrcode.deadlinefinal == '[object Object]')
			{
				$stateParams.qrcode.deadlinefinal= '';
			 	$scope.form.deadlinefinal='';
			}

			//手續費為空之處理
			if( $stateParams.qrcode.charge == '[object Object]')
			{
				$stateParams.qrcode.charge= '0';
				$scope.form.charge='0';
			}
			//else{ $scope.form.charge = $scope.form.charge / 100;
			//	  $stateParams.qrcode.charge = $stateParams.qrcode.charge/100;
			//}

			if($stateParams.qrcode.noticeNbr == '10000000000000000')
			{
				$stateParams.qrcode.noticeNbr= '9999999999999999';
				$scope.form.noticeNbr='9999999999999999';
			}

			qrcodePayServices.requireLogin();
			// $scope.submit = function(){
			//     var set_data = {};
			//     $state.go('qrcodePayResult',set_data,{location: 'replace'});
			// }
			
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
				if ($scope.form.txnAmt == null || $scope.form.txnAmt.length == 0) {
					framework.alert('請輸入交易金額');
					return;
				}

				// var qrText="hello test alex";
				// framework.openQRCodeGenerator(qrText, function(success)
				// {},function(fail){alert("encode failed" ,fail);

				// }
			// );
				// if ($scope.form.orderNumber == null || $scope.form.orderNumber.length == 0) {
				// 	framework.alert('請輸入訂單編號');
				// 	return;
				// }
				//檢查單日限額
				//var limit = parseInt($scope.trnsLimitAmt)/100 ;
				if ($scope.form.txnAmt > 2000000) {
					framework.alert('本交易超過單筆交易200萬限額');
					$scope.clickCancel();//結束流程
				}

				// $state.go('qrcodePayCardCheck', params);
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
					form.txnAmt = form.txnAmt*100;
					if($scope.qrcode.charge != null && typeof($scope.qrcode.charge )== 'object' ) { form.charge  = "";}
					else{form.charge = $scope.qrcode.charge;}
					//form.charge = $scope.qrcode.charge;
					//form.noticeNbr = $scope.qrcode.noticeNbr; 
					if($scope.qrcode.noticeNbr != null && typeof($scope.qrcode.noticeNbr) == 'object' ) { form.noticeNbr  = "";}
					//20180906加入encodeURI與replace("%20","+")
					else{form.noticeNbr = (encodeURI($scope.qrcode.noticeNbr)).split('%20').join('+');}
					if($scope.qrcode.otherInfo != null && typeof($scope.qrcode.otherInfo) == 'object' ) { form.otherInfo  = "";}
					else{form.otherInfo = encodeURI($scope.qrcode.otherInfo);}
					//form.otherInfo = encodeURI($scope.qrcode.otherInfo);
					//form.otherInfo = $scope.qrcode.otherInfo;
					if($scope.qrcode.feeInfo != null && typeof($scope.qrcode.feeInfo) == 'object' ) { form.feeInfo  = "";}
					else{form.feeInfo = $scope.qrcode.feeInfo;}
					//form.feeInfo = $scope.qrcode.feeInfo;
					if($scope.qrcode.feeName != null && typeof($scope.qrcode.feeName) == 'object' ) { form.feeName  = "";}
					else{form.feeName = encodeURI($scope.qrcode.feeName);}
					//form.feeName = encodeURI($scope.qrcode.feeName);
					//form.feeName = $scope.qrcode.feeName;
					form.trnsfrOutBank = "006";
					form.merchantName = encodeURI($scope.qrcode.merchantName);
					//form.merchantName = $scope.qrcode.merchantName;
					if($scope.qrcode.deadlinefinal != null && typeof($scope.qrcode.deadlinefinal) == 'object' ) { form.deadlinefinal  = "";}
					else if($scope.qrcode.deadlinefinal == '[object Object]'){form.deadlinefinal  = "";}
					else{form.deadlinefinal = $scope.qrcode.deadlinefinal;}
					//form.deadlinefinal = $scope.qrcode.deadlinefinal;
		            $scope.button_disable = true
					securityServices.send('qrcodePay/fq000107', form, $scope.defaultSecurityType, function(res, error){
						if(res){
							var params = {
								qrcode:$scope.qrcode,
								result:res
							};
							$state.go('qrcodePayCardResult',params,{location: 'replace'});
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
