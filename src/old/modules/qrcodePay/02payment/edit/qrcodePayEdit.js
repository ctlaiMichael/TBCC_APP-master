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
	MainApp.register.controller('qrcodePayEditCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework,$css,boundle
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
		) {
			$scope.cardData = boundle.getData('fq000102Res');
			$scope.trnsfrOutCard = boundle.getData('trnsfrOutCard');
			$scope.isTwpay = boundle.getData('isTwpay');
			console.log("boundle.getData('trnsfrOutCard'):"+boundle.getData('trnsfrOutCard'));

			var myFunction = function (e) {
				$scope.button_disable = false
				//window.removeEventListener("cancelBiometric", myFunction);
			}
			window.addEventListener('cancelBiometric', myFunction);
			

			(function () {
				boundle.remove('hasCards');
				if($scope.isTwpay != "1"){
					console.log("取得卡片型態");
					if($scope.trnsfrOutCard == undefined || $scope.trnsfrOutCard == null){
						if($scope.cardData.transType != "3"){
							$scope.getCardType=$scope.trnsfrOutCard;
							// 取得信用卡資訊
							$('#setting_body').prepend('<div class="loader-box ng-scope block" style="display:none;"><div class="gif_loading"><img src="ui/images/spinner.gif" ;=""></div><div class="lable_loading">正在載入中...</div></div>');
							$('.block').show();
							qrcodePayServices.getLoginInfo(function(res){
	
								var form = {};
								form.custId = res.custId;
								/**
								 * 取得信用卡資訊fq000112電文
								 */
								qrCodePayTelegram.send('qrcodePay/fq000112', form, function(res, resultHeader){
									
									//檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
									if(res){
										if(res.creditCards == null || res.creditCards.creditCard == null ){
											//走金融卡頁面
											$scope.isEmv = false;
											$('#meansTransactionMoney').show();
											boundle.setData('hasCards', 0 );
											$('.block').hide();
										}else{
											boundle.setData('hasCards', 1 );
											// 判斷有無預設信用卡
											var today = new Date();
											if(localStorage.getItem("nextAsk_bindCard") != today.getDate().toString()){
												//是否要綁定信用卡
												MainUiTool.openConfirm({
													title: '訊息',
														content: "是否綁定信用卡<br><input id='nextAsk' type='checkbox' style='margin-right:3px;'>本日不再提醒我",
														success: function(){
															//	下次是否詢問
															if($('#nextAsk').prop('checked')){
																localStorage.setItem("nextAsk_bindCard",today.getDate().toString());
															}else{
																localStorage.setItem("nextAsk_bindCard",'0');
															}
															$state.go('qrcodePayCardTerms',{},{location: 'replace'});
														},
														cancel : function(){
															//走金融卡頁面
															$scope.isEmv = false;
															$('#meansTransactionMoney').show();
														}
												});
												$('.block').hide();
											}else{
												//走金融卡頁面
												$scope.isEmv = false;
												$('#meansTransactionMoney').show();
												$('.block').hide();
											}
										}
									}else{
										framework.alert(resultHeader.respCodeMsg, function(){
											qrcodePayServices.closeActivity();
										});
										$('.block').hide();
									}
						
								});
							});
						}else{
							//走金融卡頁面
							$scope.isEmv = false;
							$('#meansTransactionMoney').show();
						}
					}else{
						var cardType = $scope.trnsfrOutCard.substr(0,1);
						if(cardType == "3"){
							$scope.getCardType="JCB";
						}else if(cardType == "4"){
							$scope.getCardType="VISA";
						}else if(cardType == "2" || cardType == "5"){
							$scope.getCardType="MASTER";
						}
					}

					if($scope.cardData != null){
						if ($scope.cardData.transactionAmout != null && $scope.cardData.transactionAmout != '' && typeof ($scope.cardData.transactionAmout) != 'object') {
							$scope.cardData.transactionAmout = parseInt($scope.cardData.transactionAmout);
							$scope.disableCardAmountInput = true;
						}
						if(typeof ($scope.cardData.transactionAmout) == 'object'){
							$scope.cardData.transactionAmout ="";
						}
						//判斷手機手否有值
						if($scope.cardData.mobileNumber != null && typeof ($scope.cardData.mobileNumber) != 'object'){
							$scope.disablemobileNumberInput = true;
							$scope.mobileNumberDisply = true;
							if($scope.cardData.mobileNumber == "***"){
								$scope.mobileNumberDisply = true;
								$scope.cardData.mobileNumber = "";
								$scope.disablemobileNumberInput = false;
							}
						}else{
							$scope.mobileNumberDisply = false;
							$scope.cardData.mobileNumber = "";
						}
							
						//訂單編號(針對可能為空值特別處理)
						if ($scope.cardData.billNumber != null && typeof ($scope.cardData.billNumber) != 'object') {
							$scope.disablebillNumberInput = true;
							$scope.billNumberDisply = true;
							if($scope.cardData.billNumber == "***"){
								$scope.billNumberDisply = true;
								$scope.cardData.billNumber = "";
								$scope.disablebillNumberInput = false;
							}
						}else{
							$scope.billNumberDisply = false;
							$scope.cardData.billNumber = "";
						}
						//判斷是否有對應的卡片型態
						if(angular.isUndefined($scope.cardData.jcbMerchantPAN)){
							$scope.cardData.jcbMerchantPAN = "";
						}
						if(angular.isUndefined($scope.cardData.visaMerchantPAN)){
							$scope.cardData.visaMerchantPAN = "";
						}
						if(angular.isUndefined($scope.cardData.masterMerchantPAN)){
							$scope.cardData.masterMerchantPAN = "";
						}
						var getCardType = $scope.getCardType;
						var chCardType = true;
						if(getCardType =="JCB" && $scope.cardData.jcbMerchantPAN==""){
							var chCardType = false;
						}
						if(getCardType =="VISA" && $scope.cardData.visaMerchantPAN==""){
							var chCardType = false;
						}
						if(getCardType =="MASTER" && $scope.cardData.masterMerchantPAN==""){
							var chCardType = false;
						}
			
						if(chCardType){
							//取得上次交易方式
							var lastTransaction = localStorage.getItem("lastTransaction");
							console.log("lastTransaction:"+lastTransaction);
							//判斷是否為境外交易
							if($scope.cardData.countryCode!="TW" || $scope.cardData.transactionCurrency!="901"){
									$scope.isEmv = false;
							}else{
								if(lastTransaction == "1"){
									$scope.selectedItem="1";
								}else{
									
									$scope.selectedItem="2";
								}
								$scope.isEmv = true;
							}
							
						}else{
							$scope.isEmv = false;
						}
					}else{
						$scope.isEmv = false;
					}

				}else{
					$scope.isEmv = false;
				}

				function readyfun(){
					if($scope.isEmv){
						if($scope.selectedItem=="1"){
							$('#jcb-logo').hide();
							$('#visa-logo').hide();
							$('#master-logo').hide();
							$('#meansTransactionCard').hide();
						}else{
							var cardLogo = $scope.getCardType;
								console.log("cardLogo:"+cardLogo);
								if(cardLogo=="JCB"){
									$('#visa-logo').hide();
									$('#master-logo').hide();
									$('#card-logo').hide();
								}else if(cardLogo=="VISA"){
									$('#jcb-logo').hide();
									$('#master-logo').hide();
									$('#card-logo').hide();
								}else if(cardLogo=="MASTER"){
									$('#jcb-logo').hide();
									$('#visa-logo').hide();
									$('#card-logo').hide();
								}else{
									$('#jcb-logo').hide();
									$('#visa-logo').hide();
									$('#master-logo').hide();
								};
								$('#meansTransactionMoney').hide();
						}

					}
				}

				setTimeout(function(){ readyfun(); }, 200);
				
			}());
			//發票載具beg
			//取得mobileBarcode
			var barcode = [];
			qrcodePayServices.getLoginInfo(function (res) {
				var form = {txnType: 'T'};
				form.custId = res.custId;
				qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res,error) {
					// console.log(JSON.stringify(res));
					if (res) {
						var tempList = {};
						let barcodeListCount = localStorage.getItem("defaultBarcode") != null ? localStorage.getItem("defaultBarcode") : 1;
						barcodeListCount = Number.parseInt(barcodeListCount);
						if ((res.mobileBarcode == "") || (typeof res.mobileBarcode == "undefined")) {
						} else {
							tempList = {};
							tempList.name = '手機條碼 ' + res.mobileBarcode ;
							tempList.key = 'MB';
							tempList.code = res.mobileBarcode;
							if (barcodeListCount === 2) {
								barcode[1] = tempList;
							} else {
								barcode[0] = tempList;
							}
						}
						if ((res.loveCode == "") || (typeof res.loveCode == "undefined")) {
						} else {
							tempList = {};
							tempList.name = '捐贈碼 ' + res.loveCode;
							tempList.key = 'LC';
							tempList.code = res.loveCode;
							if (barcode[0] != null) {
								barcode[1] = tempList;
							} else {
								barcode[0] = tempList;
							}
						}
						// console.log(JSON.stringify(barcode));
						$scope.noBarcode = "Y";
						if (barcode.length > 0) {
							// console.log("list count:"+barcode.length);
							$scope.noBarcode = "N";
							if (barcode.length > 1) {
								$scope.barcodeStyle = "haveBarcode";
							}else {
								$scope.barcodeStyle = "noBarcode";
							}
							$scope.defaultBarcode = barcode[0];
						}else {
							$scope.barcodeStyle = "noBarcode";
						}
						if (barcode.length == 2) {
							$scope.anotherBarcode = barcode[1];
						}
					} else {
						$scope.noBarcode = "Y";
						framework.alert(error.respCodeMsg, function () {
							qrcodePayServices.closeActivity();
						});
					}
				}, null, false);
			});
			$scope.changeBarcode = function (key) {
				let temp = {};
				temp = $scope.defaultBarcode;
				$scope.defaultBarcode = $scope.anotherBarcode;
				$scope.anotherBarcode = temp;
				$scope.onChangeBarcode = false;
			}
			$scope.clickChangeBarcode = function (show) {
				$scope.onChangeBarcode = show;
			}
			//沒有發票載具條碼
			$scope.getBarcode = function () {
				$state.go('getBarcodeTerm', {});
			}
			//發票載具end
			

			var securityTypes = securityServices.getSecurityTypes();
			
			if(localStorage.getItem('defaultType') != null && localStorage.getItem('defaultType') != "" ){
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
				//$css.add('ui/css/fix.css');
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
			$scope.clickChangeSceurityType = function (show) {
				$scope.onChangeSecurityType = show;
			}

			/**
			 * 點選確認
			 */
			$scope.clickSubmit = function () {
				if($scope.isEmv){
					//如果是信用卡要判斷電話是否為空值
					if($scope.billNumberDisply){
						if ($('#selectedItem').val() =="2" && ($scope.cardData.billNumber == null || $scope.cardData.billNumber.length == 0)) {
							framework.alert('請輸入訂單編號');
							return;
						}
					}
					if($('#selectedItem').val() =="2" && $('#transactionAmout').val() == ""){
						framework.alert('請輸入交易金額');
						return;
					}
					if($scope.mobileNumberDisply){
						if($('#selectedItem').val() =="2" &&($scope.cardData.mobileNumber == null || $scope.cardData.mobileNumber.length == 0)){
							framework.alert('請輸入電話號碼');
							return;
						}
					}
					if ($('#selectedItem').val() =="1" && ($scope.form.trnsAmount == null || $scope.form.trnsAmount.length == 0)) {
						framework.alert('請輸入交易金額');
						return;
					}
					if ($('#selectedItem').val() =="1" && ($scope.form.orderNumber == null || $scope.form.orderNumber.length == 0)) {
						framework.alert('請輸入訂單編號');
						return;
					}
					var limit = parseInt($scope.trnsLimitAmt) / 100;
					if ($('#selectedItem').val() =="2" && $('#transactionAmout').val() > limit) {
						framework.alert('一般交易金額每筆限新臺幣五萬元(不含稅費)');
						// $scope.clickCancel();//結束流程
						return;
					}
					if ($('#selectedItem').val() =="1" && $scope.form.trnsAmount > limit) {
						framework.alert('一般交易金額每筆限新臺幣五萬元(不含稅費)');
						// $scope.clickCancel();//結束流程
						return;
					}
				}else{
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
						// framework.alert('本交易超過單筆交易限額');
						framework.alert('一般交易金額每筆限新臺幣五萬元(不含稅費)');
						// $scope.clickCancel();//結束流程
						return;
					}
				}
				

				// $state.go('qrcodePayCheck', params);
				$scope.paymentData = $scope.form;
				qrcodePayServices.getLoginInfo(function (info) {
					if (($scope.defaultSecurityType.key == 'NONSET') && (info.cn == null || info.cn == '')) {
						framework.alert('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。', function () {
							qrcodePayServices.closeActivity();
						});
						return;
					}

					var form101 = { txnType: 'T' };
					form101.custId = info.custId;
					qrCodePayTelegram.send('qrcodePay/fq000101', form101, function (res101, resultHeader) {
						// console.log(JSON.stringify(res101));
						if (res101) {
							var selectType = $('#selectedItem').val();
							if(selectType == '1' || !$scope.isEmv){
								// 金融卡交易
								var outBarcode = "";
								if (barcode.length > 0) {
									outBarcode = $scope.defaultBarcode.code;
								}
	
								$scope.paymentData.custId = info.custId;
								var form = angular.copy($scope.paymentData);//因顯示和實際發出資料會有不同所以copy一份以免異常
								form.trnsAmount = form.trnsAmount * 100;
								form.merchantName = encodeURI($scope.qrcode.merchantName);
								form.mobileBarcode = outBarcode;
	
								$scope.button_disable = true
								securityServices.send('qrcodePay/fq000105', form, $scope.defaultSecurityType, function (res, error) {
									if (res) {
										var params = {
											qrcode: $scope.qrcode,
											result: res,
											means: 'financial'
										};
										$state.go('qrcodePayResult', params, { location: 'replace' });
										//預設交易方式
										localStorage.setItem("lastTransaction", "1");
									} else {
										framework.alert(error.respCodeMsg, function () {
											qrcodePayServices.closeActivity();
										});
									}
	
								});
							}else{
								// 信用卡交易
								$scope.paymentData.custId = info.custId;
								var form = angular.copy($scope.paymentData);//因顯示和實際發出資料會有不同所以copy一份以免異常
								form.custId = info.custId;
								form.cardNo = $scope.trnsfrOutCard;
								form.trnsAmount = $scope.cardData.transactionAmout;
								if(typeof($scope.cardData.transactionAmout) == "number"){
									form.trnsAmount = $scope.cardData.transactionAmout.toString();
								}
								if(form.trnsAmount.indexOf(".") == -1){
									form.trnsAmount = form.trnsAmount+"00";
								}else{
									form.trnsAmount = form.trnsAmount*100;
								}
								form.countryCode = '158';
								form.txnCurrencyCode = $scope.cardData.transactionCurrency;

								// 判斷是什麼卡 傳什麼pan
								if($scope.getCardType == "JCB"){
									form.merchantPan = $scope.cardData.jcbMerchantPAN
								}else if($scope.getCardType == "VISA"){
									form.merchantPan = $scope.cardData.visaMerchantPAN
								}else if($scope.getCardType == "MASTER"){
									form.merchantPan = $scope.cardData.masterMerchantPAN
								}
								
								form.mcc = $scope.cardData.merchantCategoryCode;
								form.merchantName = $scope.cardData.merchantName;
								form.merchantCity = $scope.cardData.merchantCity;
								form.postalCode = $scope.cardData.postalCode;
								form.billNumber = $scope.cardData.billNumber;
								form.mobileNumber = $scope.cardData.mobileNumber;
								form.merchantNameByLang = encodeURI($scope.cardData.merchantNameByLang);
								form.trnsToken =$scope.cardData.trnsToken;
								$scope.button_disable = true;
								securityServices.send('qrcodePay/fq000114', form, $scope.defaultSecurityType, function (res, error) {
									if (res) {
										var params = {
											qrcode: $scope.qrcode,
											result: res,
											means: 'card'
										};
										localStorage.setItem("lastTransaction", "2");
										$state.go('qrcodePayResult', params, { location: 'replace' });
									} else {
										framework.alert(error.respCodeMsg, function () {
											qrcodePayServices.closeActivity();
										});
										return;
									}
	
								});
							}

						} else {
							framework.alert(resultHeader.respCodeMsg, function () {
								qrcodePayServices.closeActivity();
							});
							return;
						}
					});
				});
			}


			// 切換交易方式
			$scope.changeMeansTransaction = function () {
				console.log($('#selectedItem').val());
				if($('#selectedItem').val() == "1"){
					$('#jcb-logo').hide();
					$('#visa-logo').hide();
					$('#master-logo').hide();
					$('#card-logo').show();
					$("#meansTransactionMoney").show();
					$("#meansTransactionCard").hide();
					$scope.selectedItem="1";
				}else{
					var cardLogo = $scope.getCardType;
					console.log('cardLogo:~~~~'+cardLogo);
					$('#card-logo').hide();
					if(cardLogo =="JCB"){
						$('#jcb-logo').show();
					}else if(cardLogo =="VISA"){
						$('#visa-logo').show();
					}else if(cardLogo =="MASTER"){
						$('#master-logo').show();
					}else{
						$('#card-logo').show();
					};
					$("#meansTransactionMoney").hide();
					$("#meansTransactionCard").show();
					$scope.selectedItem="2";
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
