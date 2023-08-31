/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/service/qrcodePay/securityServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/directive/security/securitySelectorDirective.js'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('qrCodeRedEditCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices,stringUtil
			, $css
		) {

			// var securityTypes = securityServices.getSecurityTypes();
			// $scope.defaultSecurityType = securityTypes[0];
			// if (securityTypes.length == 2) {
			// 	$scope.anotherSecurityType = securityTypes[1];
			// }
			// $css.add('ui/newMainPage/css/main.css');
			// $css.add('ui/newMainPage/css/fund.css');

			// $scope.changeSecurity = function (key) {
			// 	if (key == 'NONSET') {
			// 		$scope.defaultSecurityType = securityTypes[0];
			// 		$scope.anotherSecurityType = securityTypes[1];
			// 	} else {
			// 		$scope.defaultSecurityType = securityTypes[1];
			// 		$scope.anotherSecurityType = securityTypes[0];
			// 	}
			// 	$scope.onChangeSecurityType = false;
			// }

			

			$scope.qrcode = $stateParams.qrcode;
			$scope.trnsLimitAmt = $stateParams.trnsLimitAmt;

			$scope.form = {
				trnsfrOutAcct: $stateParams.trnsfrOutAcct
				, secureCode: $stateParams.qrcode.secureCode
				, acqInfo: $stateParams.qrcode.acqInfo
			};

			if($scope.qrcode.note == '[object Object]'){$scope.qrcode.note = '';}
			if($scope.qrcode.noticeNbr22 == '[object Object]'){$scope.qrcode.noticeNbr22 = '';}
			
			$scope.noSSL = true;
			$scope.noOTP = false;

			var securityTypes = [];
			$scope.defaultSecurityType =[];
			qrcodePayServices.getLoginInfo(function(res){
				
				
				if ( res.AuthType.indexOf('2') > -1 ){
					var cnEndDate = stringUtil.formatDate(res.cnEndDate);
					var todayDate = stringUtil.formatDate(new Date());
					if( res.cn==null || res.cn=='' || stringUtil.compareDate(todayDate, cnEndDate) == -1 ) {	
					}else{
						securityTypes.push({name:'憑證', key:'NONSET'});
					}
				} 
				if (res.AuthType.indexOf('3') > -1){
					if (res.BoundID == 4 && res.OTPID == 2 && res.AuthStatus == 0 && res.PwdStatus == 0 ){
						securityTypes.push({name:'OTP', key:'OTP'});	
					}
				}
				console.log(JSON.stringify(securityTypes));
				//alert(JSON.stringify(securityTypes));
				//securityServices.setSecurityTypes(securityTypes);
				$scope.defaultSecurityType = securityTypes[0];
				
				if (securityTypes.length == 2 ) {
					$scope.anotherSecurityType = securityTypes[1];
				}
			
			
			
			});

			// var securityTypes = securityServices.getSecurityTypes();
			// alert(JSON.stringify(securityTypes));

			// for(i=0;i<securityTypes.length;i++)
			// {
			// 	if(securityTypes[i].key == "Biometric"){delete securityTypes[i]}
			// }
			//alert(JSON.stringify(securityTypes));
			
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
			
			//alert($scope.qrcode.note);
			//alert($scope.qrcode.noticeNbr22);
			//debugger;
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
			// if ($stateParams.qrcode.orderNbr != null && typeof ($stateParams.qrcode.orderNbr) != 'object') {
			// 	$scope.form.orderNumber = $stateParams.qrcode.orderNbr;
			// 	$scope.disableOrderNumberInput = true;
			// }
			//交易幣別(針對可能為空值特別處理)
			if ($stateParams.qrcode.txnCurrencyCode != null && typeof ($stateParams.qrcode.txnCurrencyCode) != 'object') {
				$scope.form.txnCurrencyCode = $stateParams.qrcode.txnCurrencyCode;
			}

			//QRCode效期(針對可能為空值特別處理)
			// if ($stateParams.qrcode.qrExpirydate != null && typeof ($stateParams.qrcode.qrExpirydate) != 'object') {
			// 	$scope.form.qrExpirydate = $stateParams.qrcode.qrExpirydate;
			// }

			//繳納期限輸入為空之處理
			// if( $stateParams.qrcode.deadlinefinal == '[object Object]')
			// {
			// 	$stateParams.qrcode.deadlinefinal= '';
			//  	$scope.form.deadlinefinal='';
			// }

			//手續費為空之處理
			// if( $stateParams.qrcode.charge == '[object Object]')
			// {
			// 	$stateParams.qrcode.charge= '0';
			// 	$scope.form.charge='0';
			// }
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
		//js判断input输入框长度(支持中英文输入)
				//$scope.qrcode.noticeNbr22= null;
				if($scope.qrcode.noticeNbr22 != null){
					var num = $scope.qrcode.noticeNbr22.replace(/[^\x00-\xff]/g, 'xx').length;
					//alert(num);
					if (num >16) {
					framework.alert("給收款人訊息長度有誤");
					return;
						}
				}else{
				
						$scope.qrcode.noticeNbr22 = "";}

				if($scope.qrcode.note != null){
					var num = $scope.qrcode.note.replace(/[^\x00-\xff]/g, 'xx').length;
					//alert(num);
					if (num >16) {
						framework.alert("自我備註訊息長度有誤");
					return;
						}
				}else{
				
						$scope.qrcode.note = "";}
				
				//alert($scope.qrcode.noticeNbr22);	
				
				// 	注：11代表最大长度
					
				// 	num代表 该文本框内容的字符长度 length

				if ($scope.form.txnAmt == null || $scope.form.txnAmt.length == 0 || $scope.form.txnAmt == 0) {
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
					form.custId = info.custId;
					form.trnsfrOutAcct = $scope.form.trnsfrOutAcct;//轉出帳號
					form.trnsfrInBank = $stateParams.qrcode.transfereeBank;//轉入行代碼
					form.trnsfrInAcct = $stateParams.qrcode.transfereeAccount;//轉入帳號
					form.trnsfrAmount = $scope.form.txnAmt;//轉帳金額
					form.notePayer = $stateParams.qrcode.note;//付款人自我備註
					form.notePayee = $scope.qrcode.noticeNbr22;//給收款人訊息
					//form.txnCurrencyCode = $stateParams.qrcode.txnCurrencyCode;
					form.trnsToken = $stateParams.qrcode.trnsToken;//交易控制碼

					//debugger;
					// if($scope.qrcode.charge != null && typeof($scope.qrcode.charge )== 'object' ) { form.charge  = "";}
					// else{form.charge = $scope.qrcode.charge;}
					//form.charge = $scope.qrcode.charge;
					//form.noticeNbr = $scope.qrcode.noticeNbr; 
					// if($scope.qrcode.noticeNbr != null && typeof($scope.qrcode.noticeNbr) == 'object' ) { form.noticeNbr  = "";}
					// else{form.noticeNbr = $scope.qrcode.noticeNbr;}
					// if($scope.qrcode.otherInfo != null && typeof($scope.qrcode.otherInfo) == 'object' ) { form.otherInfo  = "";}
					// else{form.otherInfo = encodeURI($scope.qrcode.otherInfo);}
					//form.otherInfo = encodeURI($scope.qrcode.otherInfo);
					//form.otherInfo = $scope.qrcode.otherInfo;
					// if($scope.qrcode.feeInfo != null && typeof($scope.qrcode.feeInfo) == 'object' ) { form.feeInfo  = "";}
					// else{form.feeInfo = $scope.qrcode.feeInfo;}
					//form.feeInfo = $scope.qrcode.feeInfo;
					// if($scope.qrcode.feeName != null && typeof($scope.qrcode.feeName) == 'object' ) { form.feeName  = "";}
					// else{form.feeName = encodeURI($scope.qrcode.feeName);}
					//form.feeName = encodeURI($scope.qrcode.feeName);
					//form.feeName = $scope.qrcode.feeName;
					// form.trnsfrOutBank = "006";
					// form.merchantName = encodeURI($scope.qrcode.merchantName);
					//form.merchantName = $scope.qrcode.merchantName;
					// if($scope.qrcode.deadlinefinal != null && typeof($scope.qrcode.deadlinefinal) == 'object' ) { form.deadlinefinal  = "";}
					// else if($scope.qrcode.deadlinefinal == '[object Object]'){form.deadlinefinal  = "";}
					// else{form.deadlinefinal = $scope.qrcode.deadlinefinal;}
					//form.deadlinefinal = $scope.qrcode.deadlinefinal;
		
					securityServices.send('qrcodePay/fq000110', form, $scope.defaultSecurityType, function(res, error){
						if(res){
							var params = {
								qrcode:$scope.qrcode,
								result:res
							};
							$state.go('qrcodeRedResult',params,{location: 'replace'});
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
				//$state.go('qrcodeRedResult',{});
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;



		});
	//=====[END]=====//
});
