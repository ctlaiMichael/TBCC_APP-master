/**
 * QRCode功能介接Native功能
 */
define([
	"app"
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
	,"service/formServices"
	,"service/messageServices"
]
, function (MainApp) {
	MainApp.register.service("qrcodePayServices", function (
		i18n,$filter,$state
	,formServices,messageServices, framework, telegram, qrCodePayTelegram, sysCtrl,boundle
	) {
		var MainClass = this;

		
		//==參數設定==//
		var DebugMode = framework.getConfig("OFFLINE", 'B');
		var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
		//edit by alex
		var PayType='';//加入區別繳款類別:1 繳費 2繳稅 

		this.logout = function(fnc){
			var title = '是否登出';
            var message = '您確定要登出嗎？';
            framework.confirm(message, function(ok){
				if (ok){
					if (typeof fnc == 'function') {
						fnc();
					}
					sysCtrl.logout();
					framework.mainPage();
				}
			},title);			
		}

		this.closeActivity = function(){
			// plugin.bank.close(function(){} ,function(){});// 關閉
			$state.go('qrcodePayMenu',{},{location: 'replace'});
		}

		this.backToEinvoice = function(){
			$state.go('getBarcodeTerm',{},{location: 'replace'});
		}

		this.backToQRTransList = function(backData){
			$state.go('transQueryTerms',{ result : backData },{location: 'replace'});
		}
		
		/**
		 * 收到中台回覆後
		 * 將雲端發票extend回覆資料到response
		 */
		this.convertRes = function (res) {
			var reslut;
			try {
				var resData = JSON.parse(res.resData);						
				try {
					$.extend(res, resData);
					if (res.code != "200") {
						res.trnsRsltCode = "1";
						res.respCode = "1";
						res.hostCode = res.code;
						res.respCodeMsg = res.msg;
					} else {
						res.trnsRsltCode = "0";
						res.respCode = "0";
					}
					reslut = res;
				}catch(err) {
					reslut = "雲端發票資料有誤";
				}
			} catch (e) {
				reslut = "雲端發票 資料有誤";
			}
			return reslut;
		}
		
		/**
		 * 取得登入資訊
		 * 
		 * callback(res)
		 * res.custId => 用戶id
		 */
		this.getLoginInfo = function (callback) {
			//搬到sysCtrl
			sysCtrl.getLoginInfo(callback);
		}

		/**
		 * 檢查登入狀態
		 * 未登入提示登入視窗
		 * 若取消則離開功能
		 */
		this.requireLogin = function () {
			if(OpenNactive){
				// plugin.tcbb.getSessionIDCbSuccess(function(res){
				// 	if(res.value==null || res.value==''){
				// 		//未登入
				// 		MainClass.exit();
				// 	}
				// });
			}
		}

		/**
		 * 離開QRCode功能
		 */
		this.exit = function(){
			if(OpenNactive){
				//回首頁
				// plugin.tcbb.returnHome();
				//關閉功能
				plugin.bank.close(function(){} ,function(){});
				//history.back();
			}else{
				window.close();
				history.back();
			}
		}
		
		//Uri decode
		var decodeURI = function(str){
			//str=str.replace(/[+]/g," " );
			//alert(str);
			return decodeURIComponent(str);
		}

		var emv='0';
		this.checkQRCode = function(qrcode){
			
			var res = {
				status : false,
				msg_code : '',
				msg : '',
				data : {}
			};
			//檢查是否為空值
			if(qrcode==null || qrcode.length==0){
				res.msg = i18n.getStringByTag('INPUT_CHECK.EMPTY');
				return res;
			}
			
			//避免字串有編碼統一解碼
			//alert('11'+qrcode);
			qrcode = decodeURI(qrcode);
			//alert('22'+qrcode);
			//檢查是否財金QRCode
			pos = qrcode.indexOf("TWQRP://");//POS=0
			pos1= qrcode.indexOf("tw.com.twqrp");//emvoco

			if(pos1 != -1){ emv='1';
			
			}
			else{
			if(pos != -1){
				    qrcode = qrcode.substring(pos+8);//qrcode 從8開始計算
				    PayType='1';//加入繳款類別
					res.data.PayType ='1';
				    //取得商店名稱
					pos = qrcode.indexOf("/");
					if(pos != -1){
						res.data.storeName = qrcode.substring(0,pos);
						qrcode = qrcode.substring(pos+1);//qrcode 從8+店名長度開始計算
					}else{
						res.msg = 'QRCode格式錯誤';
						return res;
					}
					//取得國別碼
					pos = qrcode.indexOf("/");
					if(pos != -1){
						res.data.countryCode = qrcode.substring(0,pos);
						qrcode = qrcode.substring(pos+1);
					}else{
						res.msg = 'QRCode格式錯誤';
						return res;
					}
					//取得交易型態
					pos = qrcode.indexOf("/");
					if(pos != -1){
						res.data.trnsType = qrcode.substring(0,pos);
						qrcode = qrcode.substring(pos+1);
						if(res.data.trnsType!='01' && res.data.trnsType!='03' && res.data.trnsType!='02' ){
							//res.msg = '僅接受購物交易';
							res.msg = '此交易尚未開放';
							return res;
						}
					}else{
						res.msg = 'QRCode格式錯誤';
						return res;
					}
					//版本
					pos = qrcode.indexOf("?");
					if(pos != -1){
						res.data.version = qrcode.substring(0,pos);
						qrcode = qrcode.substring(pos+1);
					}else{
						res.msg = 'QRCode格式錯誤';
						return res;
					}
					//有效期限(有才檢查)
					if(qrcode.indexOf('D12=')>-1){
						var d12 = qrcode.substr(qrcode.indexOf('D12=')+4,8);
						var rightNow = new Date();
						var now = rightNow.toISOString().slice(0,10).replace(/-/g,"");
						if(d12==null || d12.length!=8 || now>d12){
							res.msg = 'Qrcode效期逾期';
							return res;
						}
					}
			}else{ 
					//檢查是否繳稅QRCode
				pos = qrcode.indexOf("https://paytax.nat.gov.tw/QRCODE.aspx?par=");
				if(pos != -1){
					qrcode = qrcode.substring(pos+42);
					PayType='2';//加入繳款類別
					res.data.PayType ='2';
				}else{
						res.msg = 'QRCode格式錯誤';
						return res;
					}
				//取得繳款類別
				res.data.payCategory = qrcode.substring(0,5);
				//edit by alex
				if(res.data.payCategory == '11331') res.data.payCategory1 = '11331-地價稅';
				// //使用 indexOf 來判斷
				// var isExist = arr.indexOf("a");
				 
				// //不存在會得到 -1
				// if(isExist == -1){
				//  console.log('不存在');
				// }else{
				//  console.log('存在');
				// }
				var arr=["11221","11222","11223","11224","11225","11226","11227","11228","11229","11230","11231","11232","11233","11234","11235","11236"];
				var isExist = arr.indexOf(res.data.payCategory);

				if(res.data.payCategory == '11331') {res.data.payCategory1 = '11331-地價稅';}
				else if (res.data.payCategory == '11201'){res.data.payCategory1 = '11201-房屋稅';}
				else if (res.data.payCategory == '15001'){res.data.payCategory1 = '15001-綜合所得稅';}
				else if (isExist != "-1"){res.data.payCategory1 = res.data.payCategory+'-牌照稅';}
				else if (res.data.payCategory == '11002' || res.data.payCategory =='11003'){res.data.payCategory1 = res.data.payCategory+'-綜所稅補徵稅款'}
				else{
					res.msg = '尚未提供此稅款繳納服務';
					return res;
					}
				//取得銷帳編號
				qrcode = qrcode.substring(5);
				res.data.payNo = qrcode.substring(0,16);
				//取得繳款金額
				qrcode = qrcode.substring(16);				
				var payMoney = qrcode.substring(0,10);				
				res.data.trnsfrAmount =payMoney.replace(/\b(0+)/gi,"");//.replaceFirst("^0*", "")去除前面0	
				res.data.trnsAmountStr = payMoney.replace(/\b(0+)/gi,"");//.replaceFirst("^0*", "")去除前面0
				//取得繳納截止日
				qrcode = qrcode.substring(10);
				res.data.payEndDate = qrcode.substring(0,6);
				//edit by alex
				res.data.payEndDate1 = '1'.concat(res.data.payEndDate);
				//取得期別代號
				qrcode = qrcode.substring(6);
				res.data.periodCode = qrcode.substring(0,5);
				//取得識別碼
				qrcode = qrcode.substring(5);
				res.data.identificationCode = qrcode.substring(0,6);
			}
			}

			res.status = true;
			console.log(res);
			return res;

		}
		/**
		 * 掃描財金QRCode
		 */
		this.scanQRCode = function(callback){
			var data = {
				status : false,
				msg_code : 'FC0004_301',//QR Code掃描失敗
				msg : '',
				data : {}
			};
			//掃描成功後預先檢核
			var success_method = function(jsonObj){
				jsonObj = jsonObj.replace(/[+]/g," " );
				// alert('success:'+JSON.stringify(jsonObj));
				if(typeof jsonObj !== 'object'
					|| typeof jsonObj.cancelled === 'undefined'
					|| typeof jsonObj.text === 'undefined'
					|| jsonObj.cancelled
				){
					data.msg_code = 'FC0004_302'; // QR Code掃描取消
					data.msg = '';
					callback(false,data);
					return false;
				}
				alert("333"+jsonObj.text);
				var returnObj = MainClass.checkQRCode(jsonObj.text);
				
				//加入判斷繳費與繳稅
				if(PayType=='2'){
					//避免財前面亂加東西先刪掉
					var qrcode = jsonObj.text;
					qrcode = qrcode.substring(qrcode.indexOf('https://paytax.nat.gov.tw/QRCODE.aspx?par='));
					callback(true,returnObj);//??
					return true;

				}else{var qrcode = jsonObj.text;
					qrcode = qrcode.substring(qrcode.indexOf('TWQRP'));
					//S繳稅這段可以不用
					if(returnObj.status){
						//檢核完成發送電文取得內容
						// var header = {
						// 	SecurityType:'1'
						// 	, SecurityPassword: '2345678900ugghdsjfa'
						// }
						
						MainClass.getLoginInfo(function(res){
							if(emv =='1'){
								qrcode = qrcode.toString().replace(/\+/g,"%2B");
								emv ='0';
							}
							//alert('aaa'+qrcode);
							fq000104Req = {
								custId : res.custId,
								QRCode : qrcode
							}
							/**
							 * 載入帳號和使用者設定
							 */
							qrCodePayTelegram.send('qrcodePay/fq000104', fq000104Req, function(res){
								if(res.trnsRsltCode!='0'){
									returnObj.msg = res.hostCodeMsg;
									returnObj.status = false;
									callback(false,returnObj);
									return false;
								}
								if(res.qrExpirydate!=null  && typeof(res.qrExpirydate)!='string' && res.qrExpirydate.length!=8){
									res.qrExpirydate = '';
								}
								returnObj.data = res;
								callback(true,returnObj);
								return true;
							// }, header);
							});
						});					
					}else{
						callback(false,returnObj);
						return false;
					}
					//E繳稅這段可以不用
				}
			};
			// QR Code掃描失敗
			var error_method = function(errMsg){
				// alert('error:'+JSON.stringify(errMsg));
				// framework.alert('err:'+JSON.stringify(errMsg));
				data.msg_code = 'FC0004_301'; // QR Code掃描失敗
				data.msg = errMsg;
				callback(false,data);
				return false;
			}

			if(OpenNactive){
				framework.openQRCodeReader(success_method,error_method);
				return true;
			}else{
				//模擬用假資料
				var jsonObj = {
					//text : "TWQRP://星九客咖啡 /158/01/V1?D1=12500&D2=order-90001&D3=AVnVbcN9xxRv&D10=901&D11=00,006006111 22233344400000001;01,00600611122233344400000001;04,00800899887766554400000001&D12=20180630&OprodNumber=拿鐵",
					//text : "https://paytax.nat.gov.tw/QRCODE.aspx?par=113313304001474545000000003410805120205012941558",
					text : "https://paytax.nat.gov.tw/QRCODE.aspx?par=15001",
					//text : "https://paytax.nat.gov.tw/QRCODE.aspx?par=113317402900000010001000000022107123107070501195",
					format : "QR_CODE",
					cancelled : false
				};
				success_method(jsonObj);
				return true;
			}
		}


		/**
		 * 掃描財金QRCode
		 * (for cordova-plugin-qrscanner)
		 */
		this.scanQRCodeNew = function(callback){
			var data = {
				status : false,
				msg_code : 'FC0004_301',//QR Code掃描失敗
				msg : '',
				data : {}
			};
			//掃描成功後預先檢核
			var success_method = function(jsonObj){
				//jsonObj = jsonObj.replace(/[+]/g," " );
				//離開畫面前要關閉camera
				framework.closeEmbedQRCodeReader(function(){ });
				if(typeof jsonObj !== 'string'){
					data.msg_code = 'FC0004_302'; // QR Code掃描取消
					data.msg = '';
					callback(false,data);
					return false;
				}
                
                //checkTwqrpPos==-1 && checkPaytaxPos==-1 
				//表示此段QRCode是有可能是信用卡特殊編碼
				var checkTwqrpAndPaytax = function(inputStr) {
					var checkResult = true;
					var checkTwqrpPos = inputStr.indexOf("TWQRP://");
					var checkPaytaxPos = inputStr.indexOf("https://paytax.nat.gov.tw/QRCODE.aspx?par=");
					if (checkTwqrpPos == -1 && checkPaytaxPos == -1){
						checkResult = false;
					}
					return checkResult;
				}
				
				var checkEmv = function(inputStr){
					var checkResult = false;
					if(inputStr.substr(0,6) == "000201"){
						var checkResult = true;
					}
					return checkResult;
				}
				//alert("444"+jsonObj.text);
                var preCheckQrcode = decodeURI(jsonObj);
                if (!checkTwqrpAndPaytax(preCheckQrcode)) {
					boundle.setData('isTwpay',"0");
					if(checkEmv(preCheckQrcode)){
						MainClass.getLoginInfo(function(res){
							if(preCheckQrcode.indexOf("tw.com.twqrp")>0){
								//preCheckQrcode = preCheckQrcode.toString().replace(/\+/g,"%2B");
								
							}
							//alert('bbb'+preCheckQrcode);
								fq000102Req = {
									custId : res.custId,
									EMVQRCode : preCheckQrcode
								}
								/**
								 * 發送fq000102-EMV QR Code解析 電文
								 */
								qrCodePayTelegram.send('qrcodePay/fq000102', fq000102Req, function(resfq000102){
									if(resfq000102.trnsRsltCode!='0'){
										//解析未成功
										data.msg = resfq000102.hostCodeMsg;
										callback(false,data);
										return false;
									}
									console.log("發送電文解析ＥＭＶ");
									console.log(resfq000102);
									console.log(resfq000102.qrtype);
									console.log(resfq000102.supportScheme);
									// 判斷支援的卡片公司
									var isT= findKey(resfq000102.supportScheme,'T');
									var isV= findKey(resfq000102.supportScheme,'V');
									var isM= findKey(resfq000102.supportScheme,'M');
									var isJ= findKey(resfq000102.supportScheme,'J');
			
									function findKey(supportScheme,key){
										if(supportScheme.indexOf(key) != -1){
											return true;
										}else{
											return false;
										}
									}
									var qrType = resfq000102.transType;
								
									   if(qrType == "1"){
										  // 有emv無taiwanPay
										   //是否有V,M,J
										   if(isV || isM || isJ){
												if(resfq000102.trnsRsltCode!='0'){
													//交易未成功
													data.msg = res.hostCodeMsg;
													returnObj.status = false;
													callback(false,returnObj);
													return false;
												}
												if(resfq000102.countryCode!="TW" || resfq000102.transactionCurrency!="901"){
													data.msg = "目前不支援境外交易";
													callback(false,data);
													return false;
												}
												$state.go('qrCodePayCardForm',{  
													trnsfrOutCard:'',
													qrcode:resfq000102
												},{location: 'replace'});
			
										   }else{
											   data.msg = 'QR Code掃描失敗';
											   callback(false,data);
											   return false;
										   }
										  }else if(qrType == "2"){
										  // 有emv有taiwanPay
											  //是否有V,M,J
											  if(isV || isM || isJ){
												   boundle.setData('fq000102Res',resfq000102);
												   processSucess(jsonObj,'emv');
											  }else{
												   processSucess(jsonObj,'emv');
											  }
											}else if(qrType == "3"){
											// 台灣pay
													boundle.setData('fq000102Res',resfq000102);
													processSucess(jsonObj,'emv');
											}
											else{
												// 非emv非台灣pay
													data.msg_code = 'FC0004_301'; 
													data.msg = '非emv非台灣pay';
													callback(false,data);
													return false;
												}
								});
							
							});
					}else{
						data.msg = 'QR Code掃描失敗';
						callback(false,data);
						return false;
					}
				}else{
					boundle.setData('isTwpay',"1");
					processSucess(jsonObj);
				}

				function processSucess(successQRCode,emvFlag){
                    //加入判斷繳費與繳稅
                    if (emvFlag=='emv'){
						var returnObj = {'status' : true};
					}else{
						var returnObj = MainClass.checkQRCode(successQRCode);
                    }
                    
                    if(PayType=='2'){
                        //避免財前面亂加東西先刪掉
                        var qrcode = jsonObj;
                        qrcode = qrcode.substring(qrcode.indexOf('https://paytax.nat.gov.tw/QRCODE.aspx?par='));
                        callback(true,returnObj);//??
                        return true;

                    }else{var qrcode = jsonObj;
                        qrcode = qrcode.substring(qrcode.indexOf('TWQRP'));
                        //S繳稅這段可以不用
                        if(returnObj.status){
                            //檢核完成發送電文取得內容
                            // var header = {
                            // 	SecurityType:'1'
                            // 	, SecurityPassword: '2345678900ugghdsjfa'
                            // }
                            
                            MainClass.getLoginInfo(function(res){
								if(qrcode.indexOf("tw.com.twqrp")>0){
									
									qrcode = qrcode.toString().replace(/\+/g,"%2B");
									//emv ='0';
									}
									//alert('ccc'+qrcode);
								// if(qrcode.toString().indexOf('D11%') > 0  && qrcode.toString().indexOf('%3B11%') > 0){}
								// else{qrcode = qrcode.toString().replace(/\+/g,"%2B");}
								//qrcode = qrcode.toString().replace(/\+/g,"%2B");
								//qrcode = "TWQRP%3A%2F%2FAlipay+Company+Ltd%2F158%2F01%2FV1%3FD12%3D20191231153154%26D2%3DOutSale190423151509%26D11%3D00%2C95095010000300415695000001%3B11%2C95095010000300415695000001%26D3%3DAdFN2rb2Uk8C%26D1%3D158500%26D10%3D901";
								//qrcode = "TWQRP%3A%2F%2FAlipay+Company+Ltd%2F158%2F01%2FV1%3FD12%3D20191231153154%26D2%3DOutSale190423151509%26D11%3D00%2C95095010000300415695000001%3B11%2C95095010000300415695000001";
								
								// var n = qrcode.indexOf("26D11%3D");
								
								// var k2,k1,k,m ;
								
								// if(n>0){ m = qrcode.substring(n);
								// 	 k2 = m.indexOf("%26D");
								// 	if(k2>0){
								// 		k1 = qrcode.substring(n,n+k2);
								// 		k = k1.indexOf("11%2C");
								// 	}else{
								// 		k1=qrcode.substring(n);
								// 		k = k1.indexOf("11%2C");}
								// }
								
								// if(n>0 && k>0){}
								// else{qrcode = qrcode.toString().replace(/\+/g,"%2B");};
								
                                fq000104Req = {
                                    custId : res.custId,
                                    QRCode : qrcode
                                }
                                /**
                                 * 載入帳號和使用者設定
                                 */
                                qrCodePayTelegram.send('qrcodePay/fq000104', fq000104Req, function(res){
                                    if(res.trnsRsltCode!='0'){
                                        returnObj.msg = res.hostCodeMsg;
                                        returnObj.status = false;
                                        callback(false,returnObj);
                                        return false;
                                    }
                                    if(res.qrExpirydate!=null  && typeof(res.qrExpirydate)!='string' && res.qrExpirydate.length!=8){
                                        res.qrExpirydate = '';
                                    }
                                    returnObj.data = res;
                                    callback(true,returnObj);
                                    return true;
                                // }, header);
                                });
                            });					
                        }else{
                            callback(false,returnObj);
                            return false;
                        }
                        //E繳稅這段可以不用
                    }
                }
			};
			// QR Code掃描失敗
			var error_method = function(errMsg){
				data.msg_code = 'FC0004_301'; // QR Code掃描失敗
				data.msg = errMsg.name;
				callback(false,data);
				return false;
			}

			if(OpenNactive){
				framework.openEmbedQRCodeReader(success_method, error_method);
				return true;
			}else{
				//模擬用假資料
				var jsonObj = "TWQRP%3A%2F%2F462QRCODE%E6%B8%AC%E8%A9%A6%E5%BA%97%2F158%2F01%2FV1%3FD1%3D299900%26D2%3DP201712310000003000%26D3%3DASS%2BDfDFxSuu%26D10%3D901%26D11%3D00%2C46246226301561000110001001%26D12%3D20201231123030";
				success_method(jsonObj);
				return true;
			}
		}

		/**
		 * 讀取圖片掃描QRCode 
		 * (for cordova-plugin-qrscanner)
		 */
		this.processQRCodeNew = function(qrcodeTxT,callback){
			var data = {
				status : false,
				msg_code : 'FC0004_301',//QR Code掃描失敗
				msg : '',
				data : {}
			};
			//掃描成功後預先檢核
			var success_method = function(jsonObj){
				//jsonObj = jsonObj.replace(/[+]/g," " );
				//離開畫面前要關閉camera
				framework.closeEmbedQRCodeReader(function(){ });
				if(typeof jsonObj !== 'string'){
					data.msg_code = 'FC0004_302'; // QR Code掃描取消
					data.msg = '';
					callback(false,data);
					return false;
				}
                
                //checkTwqrpPos==-1 && checkPaytaxPos==-1 
				//表示此段QRCode是有可能是信用卡特殊編碼
				var checkTwqrpAndPaytax = function(inputStr) {
					var checkResult = true;
					var checkTwqrpPos = inputStr.indexOf("TWQRP://");
					var checkPaytaxPos = inputStr.indexOf("https://paytax.nat.gov.tw/QRCODE.aspx?par=");
					if (checkTwqrpPos == -1 && checkPaytaxPos == -1){
						checkResult = false;
					}
					return checkResult;
				}
				var checkEmv = function(inputStr){
					var checkResult = false;
					if(inputStr.substr(0,6) == "000201"){
						var checkResult = true;
					}
					return checkResult;
				}
				
				alert("aaa"+jsonObj);
				var preCheckQrcode = decodeURI(jsonObj);
				// preCheckQrcode.toString().replace(/\+/g,"%2B");
                if (!checkTwqrpAndPaytax(preCheckQrcode)) {
					boundle.setData('isTwpay',"0");
					if(checkEmv(preCheckQrcode)){
						MainClass.getLoginInfo(function(res){
							if(emv =='1'){
								preCheckQrcode = preCheckQrcode.toString().replace(/\+/g,"%2B");
								emv ='0';
							}
							//alert('ddd'+qrcode);
								fq000102Req = {
									custId : res.custId,
									EMVQRCode : preCheckQrcode
								}
								/**
								 * 發送fq000102-EMV QR Code解析 電文
								 */
								qrCodePayTelegram.send('qrcodePay/fq000102', fq000102Req, function(resfq000102){
									if(resfq000102.trnsRsltCode!='0'){
										//解析未成功
										data.msg = resfq000102.hostCodeMsg;
										callback(false,data);
										return false;
									}
									console.log("發送電文解析ＥＭＶ");
									console.log(resfq000102);
									console.log(resfq000102.qrtype);
									console.log(resfq000102.supportScheme);
									// 判斷支援的卡片公司
									var isT= findKey(resfq000102.supportScheme,'T');
									var isV= findKey(resfq000102.supportScheme,'V');
									var isM= findKey(resfq000102.supportScheme,'M');
									var isJ= findKey(resfq000102.supportScheme,'J');
			
									function findKey(supportScheme,key){
										if(supportScheme.indexOf(key) != -1){
											return true;
										}else{
											return false;
										}
									}
									var qrType = resfq000102.transType;
								
									if(qrType == "1"){
										// 有emv無taiwanPay
										//是否有V,M,J
										if(isV || isM || isJ){
												if(resfq000102.trnsRsltCode!='0'){
													//交易未成功
													data.msg = res.hostCodeMsg;
													returnObj.status = false;
													callback(false,returnObj);
													return false;
												}
												if(resfq000102.countryCode!="TW" || resfq000102.transactionCurrency!="901"){
													data.msg = "目前不支援境外交易";
													callback(false,data);
													return false;
												}
												$state.go('qrCodePayCardForm',{  
													trnsfrOutCard:'',
													qrcode:resfq000102
												},{location: 'replace'});
			
										}else{
											data.msg = 'QR Code掃描失敗';
											callback(false,data);
											return false;
										}
										}else if(qrType == "2"){
										// 有emv有taiwanPay
											//是否有V,M,J
											if(isV || isM || isJ){
												boundle.setData('fq000102Res',resfq000102);
												processSucess(jsonObj,'emv');
											}else{
												processSucess(jsonObj,'emv');
											}
											}else if(qrType == "3"){
											// 台灣pay
												boundle.setData('fq000102Res',resfq000102);
												processSucess(jsonObj,'emv');
											}
											else{
												// 非emv非台灣pay
													data.msg_code = 'FC0004_301'; 
													data.msg = '非emv非台灣pay';
													callback(false,data);
													return false;
												}
								});
							
							});
						}else{
							data.msg = 'QR Code掃描失敗';
							callback(false,data);
							return false;
						}
				}else{
					boundle.setData('isTwpay',"1");
					processSucess(jsonObj);
				}

				function processSucess(successQRCode,emvFlag){
                    //加入判斷繳費與繳稅
                    if (emvFlag=='emv'){
						var returnObj = {'status' : true};
					}else{
						var returnObj = MainClass.checkQRCode(successQRCode);
                    }
                    
                    if(PayType=='2'){
                        //避免財前面亂加東西先刪掉
                        var qrcode = jsonObj;
                        qrcode = qrcode.substring(qrcode.indexOf('https://paytax.nat.gov.tw/QRCODE.aspx?par='));
                        callback(true,returnObj);//??
                        return true;

                    }else{var qrcode = jsonObj;
                        qrcode = qrcode.substring(qrcode.indexOf('TWQRP'));
                        //S繳稅這段可以不用
                        if(returnObj.status){
                            //檢核完成發送電文取得內容
                            // var header = {
                            // 	SecurityType:'1'
                            // 	, SecurityPassword: '2345678900ugghdsjfa'
                            // }
                            
                            MainClass.getLoginInfo(function(res){
								if(emv =='1'){
									qrcode = qrcode.toString().replace(/\+/g,"%2B");
									emv ='0';
								}
								alert('eee'+qrcode);
								// if(qrcode.toString().indexOf('D11%') > 0  && qrcode.toString().indexOf('%3B11%') > 0){}
								// else{qrcode = qrcode.toString().replace(/\+/g,"%2B");}
								//qrcode = "TWQRP%3A%2F%2FAlipay+Company+Ltd%2F158%2F01%2FV1%3FD12%3D20191231153154%26D2%3DOutSale190423151509%26D11%3D00%2C95095010000300415695000001%3B11%2C95095010000300415695000001%26D3%3DAdFN2rb2Uk8C%26D1%3D158500%26D10%3D901";
								//qrcode = "TWQRP%3A%2F%2FAlipay+Company+Ltd%2F158%2F01%2FV1%3FD12%3D20191231153154%26D2%3DOutSale190423151509%26D11%3D00%2C95095010000300415695000001%3B11%2C95095010000300415695000001";
								
								// var n = qrcode.indexOf("26D11%3D");
								
								// var k2,k1,k,m ;
								
								// if(n>0){m = qrcode.substring(n);
								// 	k2 = m.indexOf("%26D");
								// 	if(k2>0){
								// 		k1 = qrcode.substring(n,n+k2);
								// 		k = k1.indexOf("11%2C");
								// 	}else{
								// 		k1=qrcode.substring(n);
								// 		k = k1.indexOf("11%2C");}
								// }
								
								// if(n>0 && k>0){}
								// else{qrcode = qrcode.toString().replace(/\+/g,"%2B");};

                                fq000104Req = {
                                    custId : res.custId,
                                    QRCode : qrcode
                                }
                                /**
                                 * 載入帳號和使用者設定
                                 */
                                qrCodePayTelegram.send('qrcodePay/fq000104', fq000104Req, function(res){
                                    if(res.trnsRsltCode!='0'){
                                        returnObj.msg = res.hostCodeMsg;
                                        returnObj.status = false;
                                        callback(false,returnObj);
                                        return false;
                                    }
                                    if(res.qrExpirydate!=null  && typeof(res.qrExpirydate)!='string' && res.qrExpirydate.length!=8){
                                        res.qrExpirydate = '';
                                    }
                                    returnObj.data = res;
                                    callback(true,returnObj);
                                    return true;
                                // }, header);
                                });
                            });					
                        }else{
                            callback(false,returnObj);
                            return false;
                        }
                        //E繳稅這段可以不用
                    }
                }
			};
			
			success_method(qrcodeTxT);

		}
	});
});
