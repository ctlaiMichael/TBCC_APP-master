/**
 * [信用卡新增管理 Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/service/qrcodePay/barcodeServices'
	, 'modules/service/qrcodePay/securityServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('cardManagementCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework,boundle,$filter,stringUtil
			, qrcodePayServices
			, qrCodePayTelegram
			, qrcodeTelegramServices
			, securityServices
		) {
			qrcodePayServices.getLoginInfo(function(res){
				var securityTypes = [];
				
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

				$scope.defaultSecurityType = securityTypes[0];

				//無安控機制
				if($scope.defaultSecurityType.key == 'Biometric' && securityTypes.length == 1){
					framework.alert('您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。',function(){
						qrcodePayServices.closeActivity();
						$state.go('qrcodePayMenu',{});
						return;
					});
				}

				// 判斷有無預設信用卡
				if(localStorage.getItem("nextAsk_aggreCard") != 1 && localStorage.getItem('firstAggreCard') == "1"){
					if(securityTypes.length > 0){
						MainUiTool.openBiometricConfirm({
							title: '注意事項',
							content: "本人同意以快速交易、OTP或憑證作為交易密碼，並妥善保管。<br><input id='nextAsk' type='checkbox' style='margin-right:3px;'>下次不要提醒我",
							success: agg,
							cancel: noagg
						});
						function agg(){
							//	下次是否詢問
							if($('#nextAsk').prop('checked')){
								localStorage.setItem("nextAsk_aggreCard",'1');
							}else{
								localStorage.setItem("nextAsk_aggreCard",'0');
							}
							console.log("同意信用卡");
						}
						function noagg(){
							qrcodePayServices.closeActivity();
							$state.go('qrcodePayMenu',{});
						}
					}
				}
			});

			//取得安控機制
			qrcodePayServices.getLoginInfo(function(res){
				var securityTypes = [];
				
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

				$scope.defaultSecurityType = securityTypes[0];
				// $scope.defaultSecurityType = securityTypes[0];
				$scope.Type_border = function(last){
					return {
						"border-bottom":"none"
					}
				}
				$scope.popup_Height = {
					"height": "24px" 
				}
				if(securityTypes.length == 2){
					if($scope.defaultSecurityType.key == 'NONSET'){
						$scope.defaultSecurityType = securityTypes[1];
						$scope.anotherSecurityType = [securityTypes[0]];
					}
					else if($scope.defaultSecurityType.key == 'OTP'){
							$scope.defaultSecurityType = securityTypes[0];
							$scope.anotherSecurityType = [securityTypes[1]];
						
					}
				}
				$scope.changeSecurity = function (key) {
					if(securityTypes.length == 2){
						if (key == 'OTP') {
							$scope.defaultSecurityType = securityTypes[1];
							$scope.anotherSecurityType = [securityTypes[0]];
						}
						else {
							$scope.defaultSecurityType = securityTypes[0];
							$scope.anotherSecurityType = [securityTypes[1]];
						}
					}
					$scope.onChangeSecurityType = false;
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
				//取得安控機制end

				
			});
			
			
			
			
			//檢查是否有登入
			qrcodePayServices.requireLogin();
			boundle.remove('changeDefaultCardNo');

			//避免末完成初始化就被按下按鈕
			$scope.disable = true;

			// 取得信用卡資訊
			qrcodePayServices.getLoginInfo(function(res){
				//檢查是否有驗證機制
				var securityTypes = securityServices.getSecurityTypes();
				console.log('securityTypes:'+securityTypes);
				console.log('securityTypes[1]:'+securityTypes[1]);


				if(securityTypes.length == 0){
					// framework.alert('無檢核權限'), function(){
					// 	qrcodePayServices.closeActivity();
					// };
				}
				$scope.form = {};
				$scope.form.custId = res.custId;
				/**
				 * 載入帳號和使用者設定
				 */
				console.log("取得信用卡資訊fq000112電文");
				qrCodePayTelegram.send('qrcodePay/fq000112', $scope.form, function(res, resultHeader){
					//檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
					if(res){
						if(res.trnsRsltCode!='0'){
							framework.alert(res.hostCodeMsg, function(){
								qrcodePayServices.closeActivity();
							});
						}
						if(res.creditCards == null || res.creditCards.creditCard == null ){
							framework.alert("未開通信用卡功能，請臨櫃申請", function(){
								qrcodePayServices.closeActivity();
							});
							
						}
						var cards = res.creditCards.creditCard;
						cards = qrcodeTelegramServices.modifyResDetailObj(res.creditCards.creditCard);
						
						$scope.cards = [];
						for(key in cards){
							//檢查是否為預設預設卡號
							if(cards[key].cardNo == res.defaultCreditCard){
								cards[key].selected = true;
								boundle.setData('defaultCreditCard',res.defaultCreditCard);
							}

							$scope.cards.push(cards[key]);
						}
						//檢查是否為綁定卡號
						for(i in $scope.cards){
							if($scope.cards[i].isBind =='Y'){
									$scope.cards[i].checked = true;
								}else{
									$scope.cards[i].checked = false;
								}
						}
						if($scope.cards.length==0){
							framework.alert("未開通信用卡功能，請臨櫃申請", function(){
								qrcodePayServices.closeActivity();
							});
						}
						$scope.defaultCreditCard =res.defaultCreditCard;
						$scope.disable = false;

						console.log("$scope.cards:"+ $scope.cards);
					}else{
						framework.alert(resultHeader.respCodeMsg, function(){
							qrcodePayServices.closeActivity();
						});
					}
		
				});
			});

			// 信用卡綁定與解除綁定
            $scope.cardCvcShow = function($event,card){
				console.log(card.checked);
				$(".cardCvc").css('display','none');

				console.log($($event.currentTarget).find("input").attr('checked'));
				var checkVal=$($event.currentTarget).find("input").attr('checked');
				if(card.checked){
					//未綁定成功開關關掉
					for(i in $scope.cards){
						if($scope.cards[i].isBind =='Y'){
								$scope.cards[i].checked = true;
							}else{
								$scope.cards[i].checked = false;
							}
					}
					
					//隱藏並清空資料
					$(".cardCvc").css('display','none'); 
					$(".effective_year").val(""); 
					$(".last_three").val(""); 
					$($event.currentTarget).parent().parent().find(".cardCvc").css('display','block');

					
					for(i in $scope.cards){
						if($scope.cards[i]==card){
								$scope.cards[i].checked = true;
							}
					}
				}else{
					//隱藏並清空資料
					$(".cardCvc").css('display','none'); 
					$(".effective_year").val(""); 
					$(".last_three").val(""); 

					if(card.isBind =='Y'){
						console.log("card.isBind =='Y'");
						//解除綁定確認提示
						MainUiTool.openBiometricConfirm({
							title: '信用卡解除綁定',
							content: "是否解除綁定本張信用卡",
							success: successStart,
							cancel: stop
						});
						function successStart(){
							//判斷是否有為預設
							var defaultCreditCardNo = boundle.getData('defaultCreditCard');
							console.log('card.cardNocard.cardNo:'+card.cardNo);
							console.log('boundle.getData("defaultCreditCard"):'+boundle.getData('defaultCreditCard'));
							if(card.cardNo == defaultCreditCardNo){
								//檢查是否為綁定卡號
								var enterTime = 0;
								var aa = $filter('orderBy')($scope.cards, 'cardNo',true);
								for(i in aa){
									if(aa[i].isBind =='Y' && aa[i].cardNo != defaultCreditCardNo){
											enterTime ++;
											
											boundle.setData('changeDefaultCardNo',aa[i].cardNo);
											console.log('boundle.setData("changeDefaultCardNo"'+boundle.getData('changeDefaultCardNo'));
											break;
										}
								}
								//確認是否為最後一個綁定
								if(enterTime == 0){
									framework.alert("您目前已無綁定信用卡，請至「信用卡新增／變更」新增卡片", function(){
										console.log('發送解除綁定電文');
										$scope.cardTelegram("D",card);
									});
								}else{
									framework.alert("自動預設卡號為"+"*"+boundle.getData('changeDefaultCardNo').substr(-6,6)+"，如需更改預設卡號，請至「信用卡新增／變更」變更", function(){
										console.log('發送解除綁定電文');
										$scope.cardTelegram("D",card);
									});
								}
							}else{
								$scope.cardTelegram("D",card);
							};
							//解除綁定預設拿掉
							for(i in $scope.cards){
								if($scope.cards[i]==card){
										$scope.cards[i].selected = false;
									}
							}
						};
						function stop(){
							// $state.reload();
							//檢查是否為綁定卡號
							for(i in $scope.cards){
								if($scope.cards[i].isBind =='Y'){
										$scope.cards[i].checked = true;
									}else{
										$scope.cards[i].checked = false;
									}
							}
						};
						
					}
				}

            }

				/**
			 * 點選切換安控機制
			 */
			$scope.clickChangeSceurityType = function (show) {
				$scope.onChangeSecurityType = show;
			}

			//綁定信用卡
            $scope.clickSubmit = function ($event,card) {
				card.expiredDate = $($event.currentTarget).parent().parent().parent().find(".effective_year").val();
				card.checkId = $($event.currentTarget).parent().parent().parent().find(".last_three").val();

                if(card.expiredDate == ""){
					framework.alert('請輸入卡片有效月年');
					return;
				}
				if(card.checkId == ""){
					framework.alert('卡片背面末三碼');
					return;
				}

				var isBindSum = 0;
				for(i in $scope.cards){
					if($scope.cards[i].isBind =='Y'){
							isBindSum++;
						}
				}

				//判斷有沒有其他綁定的信用卡
				boundle.remove('cardInfo');
				boundle.remove('cardTxnType');
				boundle.setData('cardInfo',card);
				if(isBindSum > 0){
					//確認是否改為預設
					MainUiTool.openBiometricConfirm({
						title: '信用卡預設設定',
						content: "是否變更為預設信用卡號",
						success: changeNo,
						cancel: netChange
					});
					function changeNo(){
						console.log('發送綁定信用卡並變更預設電文');
						$scope.cardTelegram("A",card);
						// boundle.setData('cardTxnType',"A");
						// $state.go('otpCardBinding',{});
					}
					function netChange(){
						console.log('發送綁定信用卡電文');
						$scope.cardTelegram("B",card);
						// boundle.setData('cardTxnType',"B");
						// $state.go('otpCardBinding',{});
					}

				}else{
					console.log('發送綁定信用卡並變更預設電文');
					$scope.cardTelegram("A",card);
					// boundle.setData('cardTxnType',"A");
					// $state.go('otpCardBinding',{});
				}
				
				
			}

			// $scope.cards = [{'selected':true,'cardNo':'*263524','checked':true,'show':false,'isBind':'Y','cardType':'342'},{'selected':false,'cardNo':'*918307','checked':false,'show':false,'isBind':'N','cardType':'342'},{'selected':false,'cardNo':'*123938','checked':false,'show':false,'isBind':'N','cardType':'342'},{'selected':false,'cardNo':'*092617','show':false,'checked':false,'show':false,'isBind':'N','cardType':'342'}];
			/**
			 * 點選預設信用卡動作(設定為單選)
			 */
			$scope.selectcard = function(card){
				$scope.selectedCard = card;
				for(i in $scope.cards){
					$scope.cards[i].selected = ($scope.cards[i]==$scope.selectedCard);
				}
				if($scope.selectedCard.cardNo == boundle.getData('defaultCreditCard')){
					return;
				}
				for(i in $scope.cards){
					if($scope.cards[i].cardNo == $scope.selectedCard.cardNo){
						if($scope.cards[i].isBind == "N"){
							for(key in $scope.cards){
								//檢查是否為預設預設卡號
								if($scope.cards[key].cardNo == boundle.getData('defaultCreditCard')){
									$scope.cards[key].selected = true;
								}else{
									$scope.cards[key].selected = false;
								}
							}
							return;
						}
					}
				}
				MainUiTool.openBiometricConfirm({
					title: '信用卡預設設定',
					content: "是否變更為預設信用卡號",
					success: success,
					cancel: cancel
				});
				function success(){
					console.log('發送變更預設電文');
					$scope.cardTelegram("S",card);
				}
				function cancel(){
					for(key in $scope.cards){
						//檢查是否為預設預設卡號
						if($scope.cards[key].cardNo == boundle.getData('defaultCreditCard')){
							$scope.cards[key].selected = true;
						}else{
							$scope.cards[key].selected = false;
						}
					}
				}
				
			}

			//發電文綁定信用卡
			//綁定卡片：B、設定預設卡片：S、解除綁定卡片  D
			$scope.cardTelegram = function (method,card) {
				console.log('fnctCode:'+method);
				var form2 = { custId : $scope.form.custId };
				
				if(method == "B"){//綁定卡片：B
					form2.txnType = "B";
					form2.cardNo = card.cardNo;
					form2.cardType = card.cardType;
					form2.expiredDate = card.expiredDate;
					form2.checkId = card.checkId;
					
				}else if(method == "S"){//設定預設卡片：S
					form2.txnType = "S";
					form2.defaultCreditCard = card.cardNo;
					boundle.setData('defaultCreditCard',card.cardNo);

				}else if(method == "D"){//解除綁定卡片  D
					form2.txnType = "D";
					form2.cardNo = card.cardNo;
					console.log('boundle.getData("changeDefaultCardNo"):'+boundle.getData('changeDefaultCardNo'));
					if(boundle.getData('changeDefaultCardNo') == undefined || boundle.getData('changeDefaultCardNo') == null){
						// form2.defaultCreditCard = card.cardNo;
					}else{
						form2.defaultCreditCard = boundle.getData('changeDefaultCardNo');
					}
				}else if(method == "A"){
					form2.txnType = "A";
					form2.cardNo = card.cardNo;
					form2.cardType = card.cardType;
					form2.expiredDate = card.expiredDate;
					form2.checkId = card.checkId;
					form2.defaultCreditCard = card.cardNo;
				}

				if(method == "B" || method == "A"){
					securityServices.send('qrcodePay/fq000113', form2, $scope.defaultSecurityType, function (res, error) {
						if (res) {
							//預設交易方式
							localStorage.setItem("lastTransaction", "2");
							//綁定成功
							var params={
                                result : res
                            }
                            //綁定成功
                            console.log('res:'+ res);
                            $state.go("cardBinding",params, {});
							
	
						} else {
							framework.alert(error.respCodeMsg, function () {
								qrcodePayServices.closeActivity();
							});
							return;
						}
	
					});
				}else{
					qrCodePayTelegram.send('qrcodePay/fq000113', form2, function (res, resultHeader) {
						if(res.result!='0'){
							//交易未成功
							framework.alert(res.hostCodeMsg, function () {
							});
						}
						
						if (res) {
							//預設交易方式
							localStorage.setItem("lastTransaction", "2");
							//綁定成功
							console.log('res:'+ res);
							if(form2.txnType == "D"){
								localStorage.setItem('firstAggreCard' ,"2");
								$state.reload();
							}
							
	
						} else {
							framework.alert(resultHeader.respCodeMsg, function () {
								framework.closeEmbedQRCodeReader(function(){
									qrcodePayServices.closeActivity();
								});
								return;
							});
						}
					}, null, false);
				}
			}


			 
            

			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				$(".cardCvc").css('display','none');
				for(i in $scope.cards){
					if($scope.cards[i].isBind =='Y'){
							$scope.cards[i].checked = true;
						}else{
							$scope.cards[i].checked = false;
						}
				}
			}
			//點選返回
			$scope.clickBack = function () {
				qrcodePayServices.closeActivity();
			}

			//ios輸入處理

			$scope.clickInput = function () {
				var u = navigator.userAgent;
				var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
				if(isiOS){
					$('input').focus(function(){
						$('.matlast:last-child').append("<div class='floatL aab' style='width:100%;height:494px'></div>");
					});
					$('input').blur(function(){
						$(".aab").remove();
					});
				}
			}
		});
	//=====[END]=====//
});
