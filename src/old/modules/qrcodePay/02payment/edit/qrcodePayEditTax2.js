/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/service/qrcodePay/securityServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('qrcodePayEditTax2Ctrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework,$css
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
			, qrcodeTelegramServices
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
			//edit by alex
			$scope.status = null;		//select radio account 
			//$scope.status = $stateParams.status
			$scope.accts = $stateParams.accts;		//活期儲蓄存款帳戶列表
			$scope.cardds = $stateParams.cardds; 		//信用卡列表

			$scope.form = {
				trnsfrOutAcct: $stateParams.trnsfrOutAcct
				, secureCode: $stateParams.qrcode.secureCode
				, acqInfo: $stateParams.qrcode.acqInfo
			};
			$scope.form2 = {};
			$scope.form3 = {};
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

			//點選帳號radio 動作
			
			var acts = [];
			
			//debugger;
			
			// if($stateParams.status == '2' ){//發送F4000101
				//debugger;
			$scope.clickAccts = function(){
				qrcodePayServices.getLoginInfo(function(res){
					$scope.form2.custId = res.custId;
					qrCodePayTelegram.send('qrcodePay/f4000101', $scope.form2, function(res, resultHeader){
						//檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
						if(res){
							if(res.trnsOutAccts == null 
								|| res.trnsOutAccts.trnsOutAcct == null ){
								framework.alert("未開活期存款帳戶，請臨櫃申請");
								qrcodePayServices.closeActivity();
							}
							acts = res.trnsOutAccts.trnsOutAcct;
							acts = qrcodeTelegramServices.modifyResDetailObj(res.trnsOutAccts.trnsOutAcct);
							$scope.accts = [];
							for(key in acts){
								//檢查是否為預設SmartPay帳戶
								
								$scope.accts.push(acts[key]);
							}
						//debugger;
						}else{
							framework.alert(resultHeader.respCodeMsg, function(){
								qrcodePayServices.closeActivity();
							});
						}

					});
			})
			}

			var cards = [];
            $scope.clickCard = function(){
                qrcodePayServices.getLoginInfo(function(res){
                    $scope.form3.custId = res.custId;
					$scope.form3.appInputFlag ="1";
                    qrCodePayTelegram.send('qrcodePay/fc001001', $scope.form3, function(res, resultHeader){
                        //檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
                        if(res){
                            if(res.details == null 
                                || res.details.detail == null ){
                                framework.alert("未開活期存款帳戶，請臨櫃申請");
                                qrcodePayServices.closeActivity();
                            }
                            cards = res.details.detail;
                            cards = qrcodeTelegramServices.modifyResDetailObj(res.details.detail);
//alert(JSON.stringify(cards));
                            $scope.cardds = [];
	                            for(var key in cards){
	                                //var qq=(JSON.stringify(cards[key].creditCardNo)).substring(14,15);
									var jj=(JSON.stringify(cards[key].creditCardNo)).substring(1,7);
									if( jj !="540520" && jj != "405430" ){$scope.cardds.push(cards[key]);}
	  								//$scope.cardds.push(cards[key]);
								
                            }
//alert(JSON.stringify($scope.cardds));
							//$scope.card=$scope.cardds[0].creditCardNo;
                        //debugger;
                        }else{
                            framework.alert(resultHeader.respCodeMsg, function(){
                                qrcodePayServices.closeActivity();
                            });
                        }
                    });
            })

            }
			



			// var cards = {};
			// if($stateParams.status =='3' ){//發送FC0001001
			// 	qrcodePayServices.getLoginInfo(function(res){
			// 		$scope.form3.custId = res.custId;
			// 		$scope.form3.paginator = {};
			// 		$scope.form3.paginator.pageSize = '10';
			// 		//$scope.form3.paginator.pageNumber = '1';
			// 		//$scope.form3.paginator.sortColName = 'creditCardNo';
			// 		//$scope.form3.paginator.sotrDirection = 'ASC';
			// 		qrCodePayTelegram.send('qrcodePay/fc001001', $scope.form3, function(res, resultHeader){
			// 			//檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
			// 			if(res){
			// 				if(res.paginator == null){
			// 					framework.alert("未開活期存款帳戶，請臨櫃申請");
			// 					qrcodePayServices.closeActivity();
			// 				}
			// 				$scope.totalRowCount = res.paginatedInfo.totalRowCount;
			// 				cards = res.details.detail;
			// 				// cards = res.details.detail.creditCardNo;
			// 				// for (var key in $scope.totalRowCount){
			// 				// 	cards = cards[key];
			// 				// }

			// 				//var acts = res.trnsOutAccts.trnsOutAcct;
			// 				//acts = qrcodeTelegramServices.modifyResDetailObj(res.trnsOutAccts.trnsOutAcct);
			// 			}else{
			// 				framework.alert(resultHeader.respCodeMsg, function(){
			// 					qrcodePayServices.closeActivity();
			// 				});
			// 			}
			
			// 		});
			// 	})

			// }	
			// qrcodePayServices.getLoginInfo(function(res){
			// 	$scope.form.custId = res.custId;
			// 	qrCodePayTelegram.send('qrcodePay/fc001001', $scope.form, function(res, resultHeader){
			// 		//檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
			// 		if(res){
			// 			if(res.paginator == null 
			// 				 ){
			// 				framework.alert("未申請信用卡，請臨櫃申請");
			// 				qrcodePayServices.closeActivity();
			// 			}
			// 			var acts = res.trnsOutAccts.trnsOutAcct;
			// 			acts = qrcodeTelegramServices.modifyResDetailObj(res.trnsOutAccts.trnsOutAcct);
			// 		}
			// 	}else{
			// 			framework.alert(resultHeader.respCodeMsg, function(){
			// 				qrcodePayServices.closeActivity();
			// 			});
			// 		}
		
				
			

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
			if ($stateParams.qrcode.trnsAmountStr != null && typeof ($stateParams.qrcode.trnsAmountStr) != 'object') {
				$scope.form.trnsAmountStr = $stateParams.qrcode.trnsAmountStr;
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
				var params = {
					qrcode: $scope.qrcode,
					paymentData: $scope.form,
					securityType: $scope.defaultSecurityType
				};
				//debugger;
				//沒有選擇繳款方式情況
				if($scope.status == null){
					framework.alert("請選擇繳款方式");
				}

				//活期
				else if($scope.status == 2 && $scope.accts == null ){
					framework.alert("您目前尚未設定約定轉出帳戶，請改以其它方式繳款");
				}

				// if($scope.status == 2 && $scope.life != null ){
				// 	//執行FQ000202
				// 	$scope.paymentData = $scope.form;
				// 	qrcodePayServices.getLoginInfo(function(info){
				// 		if( ($scope.defaultSecurityType.key=='NONSET') && (info.cn==null || info.cn=='')){
				// 			framework.alert('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。', function(){
				// 				qrcodePayServices.closeActivity();
				// 			});
				// 			return;
				// 		}
				// 		$scope.paymentData.custId = info.custId;
				// 		var form = angular.copy($scope.paymentData);//因顯示和實際發出資料會有不同所以copy一份以免異常
				// 		form.trnsAmount = form.trnsAmount*100;
				// 		form.merchantName = encodeURI( $scope.qrcode.merchantName );
				// 		securityServices.send('qrcodePay/fq000202', form, $scope.defaultSecurityType, function(res, error){
				// 			if(res){
				// 				var params = {
				// 					qrcode:$scope.qrcode,
				// 					result:res
				// 				};
				// 				$state.go('qrcodePayTaxResult',params,{location: 'replace'});
				// 			}else{
				// 				framework.alert(error.respCodeMsg, function(){
				// 					qrcodePayServices.closeActivity();
				// 				});
				// 			}
				// 		});
				// 	});
				// 	//alert("aaa");
				// }
				// else if($scope.status == 2 && $scope.accts != null && $scope.life == null){
				// 	alert("請選擇活期存款帳戶");
				// }

				else if($scope.status == 2 && $scope.accts != null && $scope.life == null){
					framework.alert("請選擇活期存款帳戶");
				}

				//信用卡
				else if($scope.status == 3 && $scope.cardds == null ){
					framework.alert("您目前無本行信用卡，請改以其它方式繳款");
				}
				else if($scope.status == 3 && $scope.cardds != null && $scope.card == null){
					framework.alert("請選擇信用卡");
				}
				else if($scope.status == 3 && $scope.cardds != null && $scope.card != null && ($scope.form.cardDate == null || $scope.form.cardDate == '')){
					framework.alert("請輸入信用卡有效月年");
				}
				else if($scope.status == 3 && $scope.cardds != null && $scope.card != null && ($scope.form.cardPassword == null || $scope.form.cardPassword == '')){
					framework.alert("請輸入信用卡背面末三碼");
				}

				else if ($scope.demoform3.identify3.$error.pattern || $scope.demoform4.identify4.$error.pattern){framework.alert("輸入格式錯誤");}

				else if ($scope.status == 3 && $scope.card != null && $scope.form.cardDate != null && $scope.form.cardPassword){
						//執行FQ000201
						var message = '除每年5月綜合所得稅結算申報自繳稅款案件，得於法定(或依法展延)申報截止日前取消授權外，其餘案件一經授權成功，不得取消或更正。\n您可按「確認」繼續繳款，或按「取消」放棄繳款';
						framework.confirm(message, function(ok){
							if(ok){
							$scope.paymentData = $scope.form;
							qrcodePayServices.getLoginInfo(function(info){
								// if( ($scope.defaultSecurityType.key=='NONSET') && (info.cn==null || info.cn=='')){
								// 	framework.alert('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。', function(){
								// 		qrcodePayServices.closeActivity();
								// 	});
								// 	return;
								// }
								$scope.paymentData.custId = info.custId;
								var form = angular.copy($scope.paymentData);//因顯示和實際發出資料會有不同所以copy一份以免異常
								form.trnsAmount = form.trnsAmount*100;
								form.merchantName = encodeURI( $scope.qrcode.merchantName );

								var fq000201req = {};
								//form.cardNo = cards[$scope.card].creditCardNo;
								form.cardNo = $scope.card;
								form.taxNo = "";
								form.cityId = "";
								//輸入卡號月年交換
								// var st1=$scope.form.cardDate.substring(0,2);
								// var st2=$scope.form.cardDate.substring(2,4);
								// form.expiredDate = st2.concat(st1);
								form.expiredDate = $scope.form.cardDate;
								form.checkId = $scope.form.cardPassword;
								
								form.taxMonth = $scope.qrcode.periodCode;
								
								//securityServices.send('qrcodePay/fq000201', form, $scope.defaultSecurityType, function(res, error){
								qrCodePayTelegram.send('qrcodePay/fq000201', form, function(fq000201res, error){
									
									fq000201res.num = 11;//用來辨識11類銷帳編號
									fq000201res.payId = info.custId;
									if(fq000201res){
										var params = {
											qrcode:$scope.qrcode,
											result:fq000201res
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
						})}

					//已開通帳戶
					//if($scope.status == 2 && $scope.life != null ){
					else if($scope.status == 1 || ($scope.status == 2 && $scope.life != null)){
						
							
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
									//debugger;
									if($scope.status == 2 ) {form.trnsfrOutAcct = acts[$scope.life].acctNo;}
									form.taxNo = ""; //營業稅稅籍編號 （其它稅款空白）
									form.cityId = ""; //縣市代碼（綜所稅空白）
									form.checkId = $scope.qrcode.identificationCode;
									form.taxMonth = $scope.qrcode.periodCode;
									if($scope.status == 1) {form.paymentTool = "0";} //繳款工具
									else {form.paymentTool = "1";}
									//form.merchantName = encodeURI( $scope.qrcode.merchantName );
									$scope.button_disable = true

									securityServices.send('qrcodePay/fq000202', form, $scope.defaultSecurityType, function(res, error){
										res.num = 11;//用來辨識11類銷帳編號
										if(res){
											res.payId = info.custId;
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

				//$state.go('qrcodePayTaxCheck', params);
			
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
