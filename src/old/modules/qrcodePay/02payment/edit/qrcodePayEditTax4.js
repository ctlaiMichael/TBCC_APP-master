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
	MainApp.register.controller('qrcodePayEditTax4Ctrl',
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

			var Today11=new Date().getFullYear()-1;
			
			var securityTypes = securityServices.getSecurityTypes();
			if(localStorage.getItem('defaultType') != null && localStorage.getItem('defaultType') != ""){
				$scope.defaultSecurityType = JSON.parse(localStorage.getItem('defaultType'))
			}
			else{
				$scope.defaultSecurityType = securityTypes[0];
			}
			
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

			alert(JSON.stringify($scope.qrcode.payNo.replace(/\b(0+)/gi,"")));
			//初始帶入金額
			$scope.qrcode.payNo = $scope.qrcode.payNo.replace(/\b(0+)/gi,"");
			alert('11'+$scope.qrcode.payNo);
			$scope.form.trnsAmountStr1 = $scope.qrcode.payNo;
			alert('22'+$scope.form.trnsAmountStr1);
			$scope.form.trnsAmountStr = $scope.form.trnsAmountStr1;
			alert('33'+$scope.form.trnsAmountStr);


			qrcodePayServices.getLoginInfo(function(res){
				$scope.custId = res.custId;
				
			})

			$scope.clickClean = function(){
				qrcodePayServices.getLoginInfo(function(res){
					if($scope.payId2){$scope.form2.payId = res.custId;
						document.getElementById('payId2').readOnly = true;
						
						document.getElementById("payId2").style.background = "#DEDEDE";
					}
					else{$scope.form2.payId="";
					document.getElementById('payId2').readOnly = false;
					document.getElementById("payId2").style.background = "#FFFFFF";};
					
					
				})
				
			}

			$scope.clickOpen = function(){
				$scope.check ="";
				$scope.check5 ="";
				$scope.check6 ="";
				$scope.form9 = {
						txnType: 'A'
					};
				$scope.form9.custId = $scope.custId;
					
					/**
					 * 載入帳號和使用者設定
					 */
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
				
			}
			
			qrcodePayServices.requireLogin();
			var acts = [];
			$scope.clickcheckInfo = function(){
				if($scope.form2.custId == ""){
					alert("請輸入身分證字號");
				}
				qrcodePayServices.getLoginInfo(function(res1){
					$scope.form2.custId = res1.custId;
					$scope.form2.payId = $scope.form2.payId;
					$scope.form2.paymentTool = "0";
					$scope.form2.payCategory = $scope.qrcode.payCategory;
					$scope.form2.taxNo = "";
					$scope.form2.taxMonth = Today11+'05';
					$scope.form2.cityId = "";
					$scope.form2.payEndDate ="";
					qrCodePayTelegram.send('qrcodePay/fq000203', $scope.form2, function(res, resultHeader){
						//檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
						if(res){
							
							$scope.form.txnAmount = res.txnAmount;
							$scope.form.txnInitDateTime = res.txnInitDateTime;
							$scope.check = "1";
							$scope.form.noticeNo = res.noticeNo;
							
							if($scope.form2.payId == res1.custId && typeof $scope.form2.payId != 'undefined'){$scope.check5 = "";//提醒您，您非納稅義務人本人....
							$scope.check6 = "1";}
							else{
								$scope.check5 = "1";
								$scope.check6 = "2";
								
								}
							
							if(res.trnsRsltCode != "0"){
								$scope.check = 9;
								$scope.check5 = 9;
								$scope.check6 = 9;
								framework.alert(res.hostCodeMsg);
							}
							
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
					$scope.form2.payId = res.custId;
                    $scope.form3.custId = res.custId;
					$scope.check = null;
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
                            $scope.cardds = [];
                            for(var key in cards){
								var jj=(JSON.stringify(cards[key].creditCardNo)).substring(1,7);
								if( jj !="540520" && jj != "405430" ){$scope.cardds.push(cards[key]);}
                            }
							
                        }else{
                            framework.alert(resultHeader.respCodeMsg, function(){
                                qrcodePayServices.closeActivity();
                            });
                        }
                    });
            })

            }
			
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
			// if ($stateParams.qrcode.trnsAmountStr != null && typeof ($stateParams.qrcode.trnsAmountStr) != 'object') {
			// 	$scope.form.trnsAmountStr = $stateParams.qrcode.trnsAmountStr;
			// }

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
				
				else if ($scope.demoform.identify.$error.pattern || $scope.demoform2.identify2.$error.pattern){framework.alert("輸入格式錯誤");}
				
				else if( $scope.status == 1 && ($scope.form.trnsAmountStr1 == null || $scope.form.trnsAmountStr1 == '')){
					framework.alert("請輸入繳款金額");
					
				}

				else if( $scope.status == 3 && ($scope.form.trnsAmountStr == null || $scope.form.trnsAmountStr == '')){
					framework.alert("請輸入繳款金額");
					
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

				else if($scope.status == 3 && $scope.card != null && $scope.form.cardDate != null && $scope.form.cardPassword != null){
						//執行FQ000201
						
						var message = '除每年5月綜合所得稅結算申報自繳稅款案件，得於法定(或依法展延)申報截止日前取消授權外，其餘案件一經授權成功，不得取消或更正。\n您可按「確認」繼續繳款，或按「取消」放棄繳款';
						framework.confirm(message, function(ok){
						if(ok){
							$scope.paymentData = $scope.form;
							qrcodePayServices.getLoginInfo(function(info){
								
								$scope.paymentData.custId = info.custId;
								var form = angular.copy($scope.paymentData);//因顯示和實際發出資料會有不同所以copy一份以免異常
								form.trnsAmount = form.trnsAmount*100;
								form.merchantName = encodeURI( $scope.qrcode.merchantName );

								var fq000201req = {};
								form.cardNo = $scope.card;
								form.taxNo = "";
								form.cityId = "";
								form.taxMonth = Today11+'05';
								
								form.payEndDate ="";
								form.expiredDate = $scope.form.cardDate;
								form.checkId = $scope.form.cardPassword;
								form.trnsAmountStr = $scope.form.trnsAmountStr;
								
								qrCodePayTelegram.send('qrcodePay/fq000201', form, function(fq000201res, error){
								
									fq000201res.custId =$scope.paymentData.custId;
									if(fq000201res){
										fq000201res.payId = $scope.paymentData.custId
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
							if($scope.status == 1 ) {form.trnsfrOutAcct = $scope.act;
							}
							
							form.taxMonth = Today11+'05';
							form.payId = $scope.form2.payId;
							form.payEndDate ="";
							form.taxNo = ""; //營業稅稅籍編號 （其它稅款空白）
							form.cityId = ""; //縣市代碼（綜所稅空白）
							form.trnsAmountStr = $scope.form.trnsAmountStr1;
							form.payNo= $scope.form.noticeNo; 
							if(form.payNo == null){form.payNo="";}
							if($scope.status == 1) {form.paymentTool = "0";} //繳款工具
							else {form.paymentTool = "1";}
							$scope.button_disable = true

							securityServices.send('qrcodePay/fq000202', form, $scope.defaultSecurityType, function(res, error){
								res.custId =$scope.paymentData.custId;
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
