/**
 * QRCode功能介接Native功能
 */
define([
	"app", 'modules/service/qrcodePay/qrcodePayServices', 'modules/telegram/qrcodePay/qrcodePayTelegram'

], function (MainApp) {
	MainApp.register.service("securityServices", function (
		i18n, framework, timer, telegram, qrCodePayTelegram, qrcodePayServices, stringUtil,$rootScope
	) {
		//==參數設定==//
		var DebugMode = framework.getConfig("OFFLINE", 'B');
		var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
		
		var MainClass = this;

		var securityTypes = [];
		this.getSecurityTypes = function () {
			if (DebugMode) {
				return [{
					name: '憑證',
					key: 'NONSET'
				}, {
					name: 'OTP',
					key: 'OTP'
				}, {
					name: 'SSL',
					key: 'SSL'
				}, {
					name: '快速交易',
					key: 'Biometric'
				}];
			}
			// alert(JSON.stringify(securityTypes));
			return securityTypes;
		}

		this.updateSecurityTypes = function (callback) {
			var hasSecurityType = function (securityTypes) {
				if (securityTypes.length > 0) {
					return true;
				} else {
					return false;
				}
			}
			qrcodePayServices.getLoginInfo(function (res) {
				var securityTypes = [];
				if (res.AuthType.indexOf('1') > -1) {
					securityTypes.push({
						name: 'SSL',
						key: 'SSL'
					});
				}
				if (res.AuthType.indexOf('2') > -1) {
					var cnEndDate = stringUtil.formatDate(res.cnEndDate);
					var todayDate = stringUtil.formatDate(new Date());
					if (res.cn == null || res.cn == '' || stringUtil.compareDate(todayDate, cnEndDate) == -1) {} else {
						securityTypes.push({
							name: '憑證',
							key: 'NONSET'
						});
					}
				}
				if (res.AuthType.indexOf('3') > -1) {
					if (res.BoundID == 5 && res.OTPID == 2 && res.AuthStatus == 0 && res.PwdStatus == 0) {
						securityTypes.push({
							name: 'OTP',
							key: 'OTP'
						});
					}
				}
				if (hasSecurityType(securityTypes)) {
					callback(securityTypes);
                } 
			});
		}
		// this.setSecurityTypes = function(AuthType, AuthStatus, PwdStatus){
		// 	if(AuthType.indexOf('3')>=0 && AuthStatus == "0" && PwdStatus == "0"){
		// 		securityTypes = [{name:'憑證', key:'NONSET'}, {name:'OTP', key:'OTP'}];
		// 	}else{
		// 		securityTypes = [{name:'憑證', key:'NONSET'}];
		// 	}
			
		// }
		this.setSecurityTypes = function(securityType){
			securityTypes = securityType;
		}

		/**
		 * 數位信封
		 * @param signText string 
		 * @param success function(signedText:string)
		 * @param fail function(error:object)
		 */
		this.digitalEnvelop = function (signText, success, fail, userId, custId) {
			//取得憑證
			qrCodePayTelegram.send('qrcodePay/f1000102', {}, function (res) {
				if (res) {
					if(userId && custId){
						plugin.tcbb.setF1000102Data([res, custId, userId.toUpperCase()], function (res) {
						}, function (error) {
						});
				    }
					//成功取得資料 
					var nbCert = res.nbCert;	//server 憑證
					if (OpenNactive) {
						plugin.tcbb.doCGUMethod(['CertEncrypt', nbCert, signText, 0],function(res){
							success(res.value);
						},function(error){
							//數位信封加密失敗
							// alert('數位信封加密失敗:'+JSON.stringify(error));
							fail({respCode:error.error, respCodeMsg:'加密失敗'});
						});
					} else {
						success(res.value);
					}
				}else{
					//正常回覆取得憑證錯誤訊息
					// alert('取得憑證錯誤:'+JSON.stringify(res));
					fail(res);
				}
			}, function(error){
				//連線異常錯誤
				// alert('連線異常:'+JSON.stringify(error));
				fail(error);
			});
		}

		/**
		 * 依安控機制執行對應流程後，將資訊存入電文header發送
		 */
		this.send = function(api, form, securityType, telegramCallback, sslkey){
			this.getSecurityInfo(api, form, securityType, function(header,body){
				// qrCodePayTelegram.send('qrcodePay/fq000101', form, callback, securityInfo);
				if(localStorage.getItem('cusOtp')!='1'){
					qrCodePayTelegram.send(api, body, telegramCallback, header);
				}
			}, function(error){
				//錯誤處理
			}, sslkey);
		}
		//關閉NonSet密碼輸入
		var closeDialog = function(){
			$("#shadow").attr("style", "display:none");
			$("#dialog").empty();
		}
		//取得已輸入NonSet密碼
		var getNonSetCode = function (callback) {
			$("#dialog").load('modules/service/qrcodePay/nonSet/inputVerify.html', function () {
				localStorage.setItem("cusOtp",'0')
				if(localStorage.getItem('flag') == "1"){
					$("#paytitle").attr("style", "display:none");		
				}
				$("#nonSetCode").val(''); //將內容清空
				$("#shadow").attr("style", "display:block");
				$("#inputNonSet").attr("style", "display:block");
				$("#nonSetOk" ).click(function() {
					localStorage.setItem('flag','0')
					var code = $("#nonSetCode").val();
					if(code==null || code==''){
						//未輸入密碼提示
						framework.alert('請輸入憑證密碼')
						return;
					}
					var event2 = new Event('cancelBiometric');
					window.dispatchEvent(event2);
					closeDialog();
					callback(code);
					
				});
				$( "#nonSetCancel" ).click(function() {
					localStorage.setItem('flag','0')
					closeDialog();
					callback(false);
					localStorage.setItem("nonset",'1')
					var event = new Event('build');
					window.dispatchEvent(event);
					var event2 = new Event('cancelBiometric');
					window.dispatchEvent(event2);
				});
			});
			
		}

		/**
		 * 取得已輸入OTP密碼
		 * @param {*} checkCode string OTP檢核碼
		 * @param {*} time	number 有效時間
		 * @param {*} callback 成功回傳
		 */
		var otpTimer = null;
		var outbound11 ='modules/service/qrcodePay/otp/inputVerify.html';
		var getOTPCode = function (checkCode, time, callback) {
			if(localStorage.getItem('cusOtp')=='1'){
			   localStorage.setItem('cusOtp',0)
			}
			else{
				if(localStorage.getItem('outbound') == 'FQ000421'){
					outbound11 = 'modules/service/qrcodePay/otp/inputVerify11.html';
				}
			$("#dialog").load(outbound11, function () {
					
				var closeInput = function () {
					otpTimer.stop();
					otpTimer = null;
					closeDialog();
				}
				var cancel = function() {
					closeInput();
					error = {respCode:'001', respCodeMsg:'使用者取消'}
					callback(false, error);

				
					
				};
				var timeout = function() {
					closeInput();
					error = {respCode:'002', respCodeMsg:'OTP逾時'}
					callback(false, error);
					
				};
				//倒數計時行為
				var countDownCallBack = function(sencend){
					// var m = parseInt(sencend/60);
					// var s = sencend % 60;
					// showTime = (m>=10  ? m:'0'+m) + ':' +  (s >=10  ? s:'0'+s);
					
					$("#effectTime").html(sencend);
				}
				otpTimer = new timer.Instance(time, timeout, countDownCallBack);
				otpTimer.start();
				$("#checkCode").val('');//將內容清空
				$("#shadow").attr("style", "display:block");
				$("#inputNonSet").attr("style", "display:block");
				$("#verifyCode").html(checkCode);
				$("#effectTime").html(time);
				$("#nonSetOk" ).click(function() {
					var code = $("#checkCode").val();
					if(code==null || code==''){
						//未輸入密碼提示
						framework.alert('請輸入OTP密碼')
						return;
					}
					var event2 = new Event('cancelBiometric');
					window.dispatchEvent(event2);
					otpTimer.stop();
					otpTimer = null;
					closeDialog();
					callback(code);
				});
				$( "#nonSetCancel" ).click(function(){
					cancel()
					var event2 = new Event('cancelBiometric');
					window.dispatchEvent(event2);
				}
				);
			});
			
		}

		}



		/**
		 * 依安控機制取得相關資訊
		 */
		this.getSecurityInfo = function(api, form, securityType, callback, errorFunc, sslkey){
			//securityType.key='NONSET';//目前只能NONSET
			//取得rquId
			var rquId=qrCodePayTelegram.getRquId(api);

			if(securityType.key=='NONSET'){	//NonSet憑證交易
				//取得trnsToken
				qrCodePayTelegram.send('qrcodePay/fh000203', {}, function(res, error){
					if(res){
						var trnsToken = res.trnsToken;
						form.trnsToken = trnsToken;
						//取得Body的XML
						qrCodePayTelegram.getXMLBody(api, form, function(xmlBody){
							var signText = rquId+xmlBody;
							// console.log('alexlog'+signText);
							// alert('alexlog'+signText);
							//取得使用者輸入密碼
							getNonSetCode(function(code){
								if(code){
									if(OpenNactive){
										//NonSet驗證後傳回header需加入資訊
										plugin.tcbb.doCGUMethod(['PureSign', code, signText],function(success){
											if(success.error==0){
												qrcodePayServices.getLoginInfo(function(info){
													callback({
														rquId:rquId,
														SecurityType:'2',
														plainText:signText,
														signature:success.value,
														certSN:info.serialNumber,
														cn:info.cn
													}, form);
													localStorage.setItem("pay_method",JSON.stringify({
														name: '憑證',
														key: 'NONSET'
													}))
												});
											}else{
												// alert('fail:'+JSON.stringify(success));
												framework.alert('憑證密碼錯誤', function(){
													errorFunc(error);
												});
												
											}
											
											// plugin.tcbb.doCGUMethod(['CertGetSerialNumber','123123'],function(success){
											// 	alert('CertGetSerialNumber success:'+JSON.stringify(success));
											// },function(error){
											// 	alert('CertGetSerialNumber fail:'+JSON.stringify(error));
											// });
										},function(error){
											framework.alert(error.respCodeMsg, function(){
												errorFunc(error);
											});
											
										});
										
									}else{
										callback({
											rquId:rquId,
											SecurityType:2,
											plainText:signText
										});
									}
								}
								
							});
						});
					}else{
						errorFunc(error);
					}
				});
				


				
			}else if(securityType.key=='OTP'){

				//取得登入者資訊
				qrcodePayServices.getLoginInfo(function(info){
					
					qrCodePayTelegram.send('qrcodePay/fh000203', {}, function(res, error){
						if(res){
							//取得trnsToken
							var trnsToken = res.trnsToken;
							form.trnsToken = trnsToken;
							
							var f1000105req = {};
							f1000105req.custId = info.custId;	//custId
							f1000105req.depositNumber = form.orderNumber;	//depositNumber轉入帳號
							//edit by alex
							//f1000105req.fnctId = 'FQ000105';//api.substring(api.indexOf('/')+1);	//fnctIdfnctId
							f1000105req.fnctId = api.substring(api.indexOf('/') + 1);

							if (f1000105req.fnctId == 'fq000105') {
								f1000105req.depositMoney = form.trnsAmount / 100;
								f1000105req.fnctId = 'FQ000105';
							
							}else if(f1000105req.fnctId == 'bi000101'){
								f1000105req.depositMoney = 0;
								f1000105req.fnctId = 'BI000101';

							} else if (f1000105req.fnctId == 'fi000604') {
								f1000105req.depositMoney = 0;
								f1000105req.depositNumber = 0000;
								f1000105req.fnctId = 'FI000604';
							} 
							else if (f1000105req.fnctId == 'fq000107') {
								f1000105req.depositMoney = form.txnAmt / 100;
								f1000105req.fnctId = 'FQ000107';
							} else if (f1000105req.fnctId == 'fq000110') {
								f1000105req.depositMoney = form.trnsfrAmount;
								f1000105req.fnctId = 'FQ000110';
								if (form.trnsfrOutAcct.length >= 4) {
									f1000105req.depositNumber = form.trnsfrOutAcct.substr(-4,4);
								}
							}else if (f1000105req.fnctId == 'fq000111') {
								f1000105req.depositMoney = form.trnsfrAmount;
								f1000105req.fnctId = 'FQ000111';
								if (form.trnsfrOutAcct.length >= 4) {
									f1000105req.depositNumber = form.trnsfrOutAcct.substr(-4,4);
								}
							}
							else if (f1000105req.fnctId == 'fq000302') {
								f1000105req.depositMoney = 0;
								f1000105req.fnctId = 'FQ000302';
								if (form.trnsfrOutAcct.length >= 4) {
									f1000105req.depositNumber = form.trnsfrOutAcct.substr(-4,4);
								}
							}
							// else if(f1000105req.fnctId == 'fq000201')
							// 	{
							// 		f1000105req.depositMoney = form.txnAmt / 100;
							// 		f1000105req.fnctId = 'FQ000201';
							// 	}
							else if(f1000105req.fnctId == 'fq000202')
								{
									f1000105req.depositMoney = form.trnsAmountStr;
									f1000105req.fnctId = 'FQ000202';
								}
							// else{f1000105req.depositMoney = form.trnsfrAmount;
							// 	  f1000105req.fnctId = 'FQ000106';}
							else if(f1000105req.fnctId == 'fq000106')
							{		f1000105req.depositMoney = form.trnsfrAmount;
									f1000105req.fnctId = 'FQ000106';}
							else if(f1000105req.fnctId == 'fq000421')
							{		
								f1000105req.depositMoney = 0;
									f1000105req.fnctId = 'FQ000421';
									localStorage.setItem('outbound','FQ000421');}
							//f1000105req.depositMoney = form.trnsAmount / 100;	//depositMoney金額
							else if(f1000105req.fnctId == 'fq000113')
							{		f1000105req.depositMoney = 0;
									f1000105req.fnctId = 'FQ000113';}
							else if(f1000105req.fnctId == 'fq000114')
							{		f1000105req.depositMoney = 0;
									f1000105req.fnctId = 'FQ000114';}


							f1000105req.OutCurr = 'TWD';//form.txnCurrencyCode;	//OutCurr 交易幣別
							//發送OTP請求
							qrCodePayTelegram.send('qrcodePay/f1000105', f1000105req, function(f1000105res, error){
								if(f1000105res){
									// "f10:accessToken": "111221313211",
									// "f10:checkCode": "5115",
									// "f10:OTP_SEC": "180"
									localStorage.setItem('accessToken',f1000105res.accessToken);
									//取得使用者輸入OTP
									getOTPCode(f1000105res.checkCode, f1000105res.OTP_SEC, function(otpCode, error){
										//alert("otpCode:"+ otpCode);
										if(otpCode){	
											if(OpenNactive){
												//數位信封加密
												MainClass.digitalEnvelop(otpCode, function(signedText){
													//取得加密內容
													//alert("signedText" + signedText);
													callback({
														rquId:rquId,
														SecurityType:'3',
														SecurityPassword:signedText,
														Acctoken:f1000105res.accessToken
													}, form);
													localStorage.setItem("pay_method",JSON.stringify({
														name: 'OTP',
														key: 'OTP'
													}))

												
												}, function(error){
													//加密失敗
													framework.alert('加密失敗', function(){
														errorFunc(error);
													});
													
												})
											}else{
												callback({
													rquId:rquId,
													SecurityType:'3',
													SecurityPassword:otpCode,
													Acctoken:f1000105res.accessToken
												}, form); 
											}	
										}else{
											//取得OTP失敗
											if(error.respCode=='001'){//使用者取消時不提示訊息
												errorFunc(error);
											}else{
												framework.alert(error.respCodeMsg, function(){
													errorFunc(error);
												});
											}
											
										}
									});
								}else{
									//取得OTP失敗
									framework.alert(error.respCodeMsg, function(){
										qrcodePayServices.closeActivity();
									});
								}
							});
						}else{
							errorFunc(error);
						}
					});		
				});	
			}else if(securityType.key=='SSL'){
				if(sslkey.length<8||sslkey.length>16){
					framework.alert("SSL密碼長度有誤");
					return
				}
				//SSL時需要由程式帶入sslkey
				sslkey = stringUtil.paddingRight(sslkey, 16);
				if(OpenNactive){
					//數位信封加密
					MainClass.digitalEnvelop(sslkey, function(signedText){
						//取得加密內容
						SecurityType =1
						SecurityPassword=signedText;
						callback({
							rquId:rquId,
							SecurityType:'1',
							SecurityPassword:signedText
						}, form);
					}, function(error){
						//加密失敗
						framework.alert('加密失敗', function(){
							errorFunc(error);
						});
					})
				}else{
					callback({
						rquId:rquId,
						SecurityType:'1',
						SecurityPassword:sslkey
					}, form);
				}

			} else if (securityType.key == 'Biometric') { //NonSet憑證交易

				//取得trnsToken
				qrCodePayTelegram.send('qrcodePay/fh000203', {}, function (res, error) {
					if (res) {
						var trnsToken = res.trnsToken;
						form.trnsToken = trnsToken;
						//取得Body的XML
						qrCodePayTelegram.getXMLBody(api, form, function (xmlBody) {
							var signText = rquId + xmlBody;
							//取得使用者輸入密碼
							if (OpenNactive) {
								//NonSet驗證後傳回header需加入資訊
								setTimeout(function(){
									HiBiometricAuth.requestBioService(function (success) {
										//TODO: error handle
	
										qrcodePayServices.getLoginInfo(function (info) {										
												callback({
													rquId: rquId,
													SecurityType: '4',
													plainText: signText,
													signature: success.mac_value
												}, form);
												localStorage.setItem("pay_method",JSON.stringify({
													name: '快速交易',
													key: 'Biometric'
												}))
											
										});
	
	
										// plugin.tcbb.doCGUMethod(['CertGetSerialNumber','123123'],function(success){
										// 	alert('CertGetSerialNumber success:'+JSON.stringify(success));
										// },function(error){
										// 	alert('CertGetSerialNumber fail:'+JSON.stringify(error));
										// });
									}, function (result) {
										// framework.alert(error.respCodeMsg, function () {
										// 	errorFunc(error);
										// });
										if(result.ret_code == '1'){
											MainUiTool.openBioWrong({title:'錯誤',content:"硬體設備不支援"}); 
											var event = new Event('cancelBiometric');
											window.dispatchEvent(event);
										}
										else if(result.ret_code == '2'){
											MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未啟用"}); 
											var event = new Event('cancelBiometric');
											window.dispatchEvent(event);
										}
										else if(result.ret_code == '3'){
											MainUiTool.openBioWrong({title:'錯誤',content:"生物辨識尚未設定"}); 
											var event = new Event('cancelBiometric');
											window.dispatchEvent(event);
										}
										else if(result.ret_code == '4'){
											MainUiTool.openBioWrong({title:'錯誤',content:"指紋異動"}); 
											var event = new Event('cancelBiometric');
											window.dispatchEvent(event);
										}
										else if(result.ret_code == '5'){
											MainUiTool.openBioWrong({title:'錯誤',content:"尚未產製設備信物"}); 
											var event = new Event('cancelBiometric');
											window.dispatchEvent(event);
										}
										else if(result.ret_code == '6'){
											MainUiTool.openBioWrong({title:'錯誤',content:"尚未啟用驗證服務"}); 
											var event = new Event('cancelBiometric');
											window.dispatchEvent(event);
										}
										else if(result.ret_code == '7'){
											MainUiTool.openBioWrong({title:'錯誤',content:"已啟用驗證服務"}); 
											var event = new Event('cancelBiometric');
											window.dispatchEvent(event);
										}
										else if(result.ret_code == '10'){
											MainUiTool.openBioWrong({title:'錯誤',content:"使用者取消驗證"}); 
											var event = new Event('cancelBiometric');
											window.dispatchEvent(event);	
										}
										else if(result.ret_code == '11'){
											if(device.model == "iPhone10,6" || device.model == "iPhone10,3" ){
												MainUiTool.openBioWrong({title:'臉部辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_faceid.png' width='90px'></div><p>臉部辨識錯誤已達3次，請確認後再試</p>",});                                  }
											else{
												MainUiTool.openBioWrong({title:'指紋辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>指紋辨識錯誤已達3次，請確認後再試</p>",});          
											}
											$scope.password_login();
											$scope.$apply();
										}
										else if(result.ret_code == '12'){
											// if(localStorage.getItem("errorCount")=='1'){
												if(device.model == "iPhone10,6" || device.model == "iPhone10,3" ){
													MainUiTool.openBioWrong({title:'臉部辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_faceid.png' width='90px'></div><p>臉部辨識錯誤已達5次，請重新設定或改用密碼登入</p>",});                                  }
												 else{
													MainUiTool.openBioWrong({title:'指紋辨識錯誤',content:"<div class='dialog_img'><img src='ui/images/icon_touchid.png' width='90px'></div><p>指紋辨識錯誤已達5次，請重新設定或改用密碼登入</p>",});          
												 }
												 HiBiometricAuth.disableBioService(function(res){
													 console.log(res)
													},function(res){console.log(res)})
												 localStorage.setItem('bioLogin','0')
												 localStorage.setItem('login_setting','0')
												 localStorage.setItem('pay_setting','0')
												 localStorage.setItem("defaultType","")               
												 $scope.password_login();
												 $scope.$apply();
											// }
											// else{
											
											// }
										}
										else if(result.ret_code == '13'){
											MainUiTool.openBioWrong({title:'錯誤',content:"驗證功能被鎖住"}); 
											var event = new Event('cancelBiometric');
											window.dispatchEvent(event);
										}
										else{
											MainUiTool.openBioWrong({title:'錯誤',content:"系統錯誤"}); 
											var event = new Event('cancelBiometric');
											window.dispatchEvent(event);
										}
									}, signText,"請將您的指紋置於感應區域上");
								},1400)
								

							} else {
								callback({
									rquId: rquId,
									SecurityType: 2,
									plainText: signText
								});
							}


						});
					} else {
						errorFunc(error);
					}
				});




			} else {
				getOTPCode('5115', '180', function (otpCode, error) {});
			}
			
		}

	});
});
