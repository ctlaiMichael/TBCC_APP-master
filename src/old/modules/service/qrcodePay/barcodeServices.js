/**
 * 查詢手機條碼
 */
define([
	"app"
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/service/common/openAppUrlServices'
]
	, function (MainApp, HtStartApp) {
		MainApp.register.service("barcodeServices", function (
			framework
			, $window
			, $http
			, $log
			, $state
			, openAppUrlServices
			, qrcodePayServices
			, qrCodePayTelegram
			, qrcodeTelegramServices
		) {
			var MainClass = this;

			//==參數設定==//
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			var barcodeUrl = 'https://api.einvoice.nat.gov.tw';
			// var barcodeUrl = 'https://wwwtest.einvoice.nat.gov.tw'; //測試環境

			//亂數產生條碼
			function getStr() {
				var poolStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-.";
				var maxNum = 39;
				var minNum = 0;
				var outStr = "/";
				for(var i=1;i<=7;i++){  
					var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum; 
					// console.log(n +' ### '+ poolStr.substr(n-1,1));
					outStr = outStr + poolStr.substr(n-1,1);
				} 
				// console.log(outStr);  
				return outStr;
			}

			/**
			 * 查詢手機條碼 
			 * @param url   // app json scheme
			 * 
			 * 1.appID: 向財政部財政資訊中心申請取得之應用程式帳號
			 * 2.phoneNo: 手機號碼
			 * 3.verificationCode: 手機條碼驗證碼
			 */
			this.getBarcode = function (form) {
				// console.log('form:' + JSON.stringify(form));
				var appID = form.appID;
				var phoneNo = form.phoneNo;
				var verificationCode = form.verificationCode;

				if (OpenNactive) {
					var dt = new Date();
					var timestamp = parseInt((dt.getTime() + 10000).toString().substr(0, 10));
					var mergeParams = 'action=getBarcode&' +
						'appID=' + appID + '&' +
						'phoneNo=' + phoneNo + '&' +
						'timeStamp=' + timestamp + '&' +
						'uuid=' + device.uuid + '&' +
						'verificationCode=' + verificationCode + '&' +
						'version=1.0';

					var reqUrl = barcodeUrl + '/PB2CAPIVAN/Carrier/AppGetBarcode?' + mergeParams;
					// console.log("reqUrl:" + reqUrl);
					
					$http.post(reqUrl)
						.then(function (res) {
							//---[POST SUCCESS]---//
							var data = res.data;
							// console.log("http res:" + JSON.stringify(data));
							if (typeof data != "object") {
								framework.alert("發票載具條碼 更新失敗");
								qrcodePayServices.closeActivity();
								return;
							}
							if (data.code == "910") {
								var title = '此手機號碼與驗證碼查無手機條碼';
								var message = '到財政部申請電子發票(手機條碼)？';
								framework.confirm(message, function (ok) {
									if (ok) {
										var applyBarcode_URL = "https://www.einvoice.nat.gov.tw/APMEMBERVAN/GeneralCarrier/generalCarrier";
										openAppUrlServices.openWeb(applyBarcode_URL); //開啟Web
									} else {
										qrcodePayServices.closeActivity();
									}
								}, title);
							} else {
								if (data.code == '200') {
									//此手機號碼與驗證碼查到手機條碼
									if ((typeof data.cardNo == "string" && data.cardNo != "")) {
										qrcodePayServices.getLoginInfo(function (res) {
											var form = {};
											form.custId = res.custId;
											form.mobileBarcode = data.cardNo; //"/AB56P5Q";
											// console.log(JSON.stringify(form));
											qrCodePayTelegram.send('qrcodePay/fq000301', form, function (res) {
												// console.log(JSON.stringify(res));
												if (res) {
													var result = {};
													result.cardNo = data.cardNo; //"/AB56P5Q";
													result.code = (res.trnsRsltCode == 4001 || res.trnsRsltCode == 0)? 4001:res.trnsRsltCode;
													result.msg = res.respCodeMsg; //res.hostCodeMsg;
													// console.log(JSON.stringify(result));
													$state.go('getBarcodeResult', { result: result });
												} else {
													framework.alert("發票載具條碼 更新失敗");
													qrcodePayServices.closeActivity();
												}
											}, null, false);
										});
									}else {
										framework.alert("發票載具條碼 更新失敗");
										qrcodePayServices.closeActivity();
									}									
								} else {
									//其他error
									var result = {};
									result.cardNo = "";
									result.code = data.code;
									result.msg = data.msg;
									result.result = "1";
									result.respCode = "";
									result.respCodeMsg = "";
									$state.go('getBarcodeResult', { result: result });

									//for test
									//此手機號碼與驗證碼查到手機條碼
									// qrcodePayServices.getLoginInfo(function (res) {
									// 	var form = {};
									// 	form.custId = res.custId;
									// 	form.mobileBarcode = getStr();
									// 	// console.log(JSON.stringify(form) + ' ' +typeof form.mobileBarcode);
									// 	qrCodePayTelegram.send('qrcodePay/fq000301', form, function (res) {
									// 		// console.log(JSON.stringify(res));
									// 		if (res) {
									// 			var result = {};
									// 			result.cardNo = form.mobileBarcode;
									// 			result.code = (res.trnsRsltCode == 4001 || res.trnsRsltCode == 0)? 4001:res.trnsRsltCode;
									// 			result.msg = res.respCodeMsg; //res.hostCodeMsg;
									// 			// console.log(JSON.stringify(result));
									// 			$state.go('getBarcodeResult', { result: result });
									// 		} else {
									// 			framework.alert("發票載具條碼 更新失敗");
									// 			qrcodePayServices.closeActivity();
									// 		}
									// 	}, null, false);
									// });
								}
							}
						}
							, function (err) {
								// console.log('get barcode err:' + JSON.stringify(err));
								var result = {};
								result.cardNo = "";
								result.code = "999";
								result.msg = "連線 電子發票整合服務平台 失敗";
								result.result = "1";
								result.respCode = "";
								result.respCodeMsg = "";
								$state.go('getBarcodeResult', { result: result });
							});
				} else {
					//platform = "Android";
				}
			};



		});
	});
