/**
 * []
 */
define([
	'app'
	, 'modules/directive/epayLeftMenu/epayLeftMenuDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('qrcodePayBeScanShowCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, $log, stringUtil
			, qrcodePayServices, $window
			, qrCodePayTelegram
			, qrcodeTelegramServices
		) {
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.limitTime = parseInt(framework.getConfig("QRCODE_DURATION_TIME", 'I')); //被掃頁面停留3min = 180
			$scope.checkSS = parseInt(framework.getConfig("QRCODE_CHECK_TIME", 'I')); // x秒檢查一次被掃結果
			$scope.genQRCode = "";
			$scope.genBarcode = "";
			$scope.nowScreen = "qrcodePayBeScanShow";
			// var screenOk = function(res) {
			// 	// console.log('screenOk:'+JSON.stringify(res));
			// }
			// var screenNg = function(res) {
			// 	// console.log('screenNg:'+JSON.stringify(res));
			// }
			// if (typeof device === 'object' && typeof device.platform !== 'undefined' && device.platform == 'Android') {
			// 	framework.disabledScreenshotPrevention(screenOk,screenNg);
			// }
			var model = device.model;
			if (model.indexOf("iP") > -1 || model.indexOf("x86_64") > -1) {
				$scope.marginTop = "marginTop";
			}else {
				$scope.marginTop = "";
			}	

			//android實體鍵盤返回鍵
			$rootScope.leftThisPage = false;
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				if ($scope.onBigCode == true) {
					$scope.onBigCode = false;
					$scope.isLC = false;
					// if (typeof device === 'object' && typeof device.platform !== 'undefined' && device.platform == 'Android') {
					// 	framework.enabledScreenshotPrevention(screenOk,screenNg);
					// }
					$state.go('qrcodePayBeScanShow', {
						result: $stateParams.result
					});
				} else {
					clearInterval($scope.interval); //結束限制三分鐘後離開頁面
					$timeout.cancel($scope.mytimeout); //結束倒數秒數
					if (!$rootScope.leftThisPage) {
						// if (typeof device === 'object' && typeof device.platform !== 'undefined' && device.platform == 'Android') {
						// 	framework.enabledScreenshotPrevention(screenOk,screenNg);
						// }
						$rootScope.leftThisPage = true;
					}
					qrcodePayServices.closeActivity();
				}
			}

			//處理一維二維條碼
			$scope.result = $stateParams.result; //fq000302 一維二維
			$scope.result.respCode = $scope.result.trnsRsltCode;
			$scope.genQRCode = $scope.result.qrcode;
			$scope.genBarcode = $scope.result.barcode;
			$scope.createTime = $scope.result.createTime;
			// console.log(JSON.stringify($scope.result));


			//取得mobileBarcode
			qrcodePayServices.getLoginInfo(function (res) {
				$scope.custId = res.custId;

				var form = {txnType: 'T'};
				form.custId = $scope.custId;
				qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res) {
					// console.log(JSON.stringify(res));
					if (res) {
						$scope.defaultTrnsOutAcct = stringUtil.padLeft(res.defaultTrnsOutAcct, 16);
						// console.log($scope.defaultTrnsOutAcct + ' ' + $scope.defaultTrnsOutAcct.length);
						
						// 帳號模糊化 ex:"0560-***-***456"
						if(res.defaultTrnsOutAcct==null||res.defaultTrnsOutAcct==''||typeof(res.defaultTrnsOutAcct)=='object'){
						}else{
							var trnsAcctReFmt = res.defaultTrnsOutAcct;
							if (trnsAcctReFmt.length>13) {
								trnsAcctReFmt = trnsAcctReFmt.substr(-13,13);
							}
							trnsAcctReFmt = stringUtil.formatAcct(res.defaultTrnsOutAcct);
							trnsAcctReFmt = stringUtil.hideAcctInfo(trnsAcctReFmt); 
							$scope.myAcct = trnsAcctReFmt;
						}

						$scope.barcodeList = [];
						var tempList = {};
						let barcodeListCount = localStorage.getItem("defaultBarcode") != null ? localStorage.getItem("defaultBarcode") : 1;
						barcodeListCount = Number.parseInt(barcodeListCount);
						if ((res.mobileBarcode == "") || (typeof res.mobileBarcode == "undefined")) {
						} else {
							tempList = {};
							tempList.id = 'mobileBarcode';
							tempList.name = '雲端發票行動條碼';
							tempList.mobileBarcode = res.mobileBarcode;
							tempList.lvFoneSize = "";
							if (barcodeListCount === 2) {
								$scope.barcodeList[1] = tempList;
							} else {
								$scope.barcodeList[0] = tempList;
							}
						}
						if ((res.loveCode == "") || (typeof res.loveCode == "undefined")) {
						} else {
							tempList = {};
							tempList.id = 'loveCode';
							if ((res.loveCodeName == "") || (typeof res.loveCodeName == "undefined")) {
								tempList.name = '捐贈碼';
								tempList.lvFoneSize = "";
							}else {
								tempList.name = res.loveCodeName;
								tempList.lvFoneSize = "";
								if (tempList.name.length > 11) {
									tempList.lvFoneSize = "lvFoneSize";
								}
							}
							tempList.mobileBarcode = res.loveCode;
							if ($scope.barcodeList[0] != null) {
								$scope.barcodeList[1] = tempList;
							} else {
								$scope.barcodeList[0] = tempList;
							}
						}
						// console.log(JSON.stringify($scope.barcodeList));
						$scope.cardNoFlag = "N";
						$element.find('#swiperBeScanShow').css('display','none');
						$element.find('#swiper-pagination').css('display','none');
						$element.find('#BarcodeShow').css('display','');
						if ($scope.barcodeList.length > 0) {
							// console.log("list count:"+$scope.barcodeList.length);
							$scope.cardNoFlag = "Y";
							$element.find('#swiperBeScanShow').css('display','');
							$element.find('#swiper-pagination').css('display','');
							$element.find('#BarcodeShow').css('display','none');
						}
					} else {
						$scope.cardNoFlag = "N";
						$element.find('#swiperBeScanShow').css('display','none');
						$element.find('#swiper-pagination').css('display','none');
						$element.find('#BarcodeShow').css('display','');
					}
					//啟動時間控制
					controlTime();
				}, null, false);
			});


			//倒數控制
			function controlTime() {
				//限制三分鐘後離開頁面
				$scope.onTimeout = function () {
					framework.alert('停留時間已經超過三分鐘囉，\n即將回到台灣Pay首頁!\n\n如欲確認交易結果,請執行行動網銀存款查詢', function () {
						$timeout.cancel($scope.mytimeout); //結束倒數秒數
						// if (typeof device === 'object' && typeof device.platform !== 'undefined' && device.platform == 'Android') {
						// 	framework.enabledScreenshotPrevention(screenOk,screenNg);
						// }
						qrcodePayServices.closeActivity();
						return;
					});
				};
				$scope.mytimeout = $timeout($scope.onTimeout, $scope.limitTime * 1000);

				//倒數秒數
				var c = $scope.limitTime;
				var t;

				function showNext() {
					c = c - 1;
					if (c >= 0) {
						$scope.limitSec = c + "秒";
						if ((c % $scope.checkSS == 0) && (c > 19)) {
							// console.log(c);
							//檢查被掃結果
							checkBeScan();
						}
					} else {
						clearInterval($scope.interval); //結束限制三分鐘後離開頁面
					}
				}
				$scope.interval = window.setInterval(showNext, 1000); // 設定循環

				//檢查交易結果
				function checkBeScan() {
					var form = {};
					form.custId = $scope.custId;
					form.trnsGenerateTime = $scope.createTime;
					form.trnsfrOutAcct = $scope.defaultTrnsOutAcct;
					// console.log(JSON.stringify(form))
					qrCodePayTelegram.send('qrcodePay/fq000303', form, function (res) {
						// console.log(JSON.stringify(res));
						if (res) {
							if (res.trnsRsltCode == 0) {
								clearInterval($scope.interval); //結束限制三分鐘後離開頁面
								$timeout.cancel($scope.mytimeout); //結束倒數秒數
								// if (typeof device === 'object' && typeof device.platform !== 'undefined' && device.platform == 'Android') {
								// 	framework.enabledScreenshotPrevention(screenOk,screenNg);
								// }
								$state.go('qrcodePayBeScanResult', {
									result: res
								});
							} else {
								// console.log("303 errmsg:"+res.hostCodeMsg);
							}
						}
					}, null, true);
				}
			}

			//一維條碼 mobileBarcode 設定
			$scope.bc = {
				format: 'CODE39',
				lineColor: '#000000',
				width: 2,
				height: 100,
				displayValue: false,
				fontOptions: '',
				font: 'monospace',
				textAlign: 'center',
				textPosition: 'bottom',
				textMargin: 2,
				fontSize: 20,
				background: '#ffffff',
				margin: 0,
				marginTop: undefined,
				marginBottom: undefined,
				marginLeft: undefined,
				marginRight: undefined,
				valid: function (valid) {}
			};

			//一維條碼 genBarcode 設定
			$scope.bc128 = {
				format: 'CODE128B',
				lineColor: '#000000',
				width: 2,
				height: 100,
				displayValue: false,
				fontOptions: '',
				font: 'monospace',
				textAlign: 'center',
				textPosition: 'bottom',
				textMargin: 2,
				fontSize: 20,
				background: '#ffffff',
				margin: 0,
				marginTop: undefined,
				marginBottom: undefined,
				marginLeft: undefined,
				marginRight: undefined,
				valid: function (valid) {}
			};

			//沒有發票載具條碼
			$scope.getBarcode = function () {
				clearInterval($scope.interval); //結束限制三分鐘後離開頁面
				$timeout.cancel($scope.mytimeout); //結束倒數秒數
				// if (typeof device === 'object' && typeof device.platform !== 'undefined' && device.platform == 'Android') {
				// 	framework.enabledScreenshotPrevention(screenOk,screenNg);
				// }
				//導頁到查詢頁面
				$state.go('getBarcodeTerm', {});
			}

			//顯示大圖 - QRCode
			$scope.showBigQrcode = function () {
				$scope.onBigCode = true;
				$scope.isLC = false;
				var tmp = document.getElementById('getqr').children[0].toDataURL("image/png").split('base64,');
				$scope.outimg = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
				$scope.popShow = "pop_contentQR";
			}

			//顯示大圖 - Barcode
			$scope.showBigBarcode = function () {
				// console.log(typeof document.getElementById('getBarcode').children);
				// console.log(document.getElementById('getBarcode').children[0].src);
				$scope.onBigCode = true;
				$scope.isLC = false;
				var tmp = document.getElementById('getBarcode').children[0].src.split('base64,');
				$scope.outimg = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
				$scope.popShow = "pop_contentBar";
			}
			$scope.showBigBarcode1 = function (str) {
				$scope.onBigCode = true;
				$scope.isLC = false;

				if (str=="mobileBarcode") {
					var tmp = document.getElementById('mobileBarcode').children[0].src.split('base64,');
					$scope.outimg = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
					$scope.popShow = "pop_contentBar";
				}else if (str=="loveCode") {
					var tmp = document.getElementById('loveCode').children[0].src.split('base64,');
					$scope.outimg = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
					$scope.popShow = "pop_contentBar";
					$scope.isLC = true;
				}
				// var tmp = document.getElementById('getBarcode1').children[0].src.split('base64,');
				// $scope.outimg = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
				// $scope.popShow = "pop_contentBar";
			}
			$scope.clickBigCode = function (show) {
				$scope.onBigCode = show;
				$scope.isLC = false;
			}
			$scope.closeBigCode = function () {
				$scope.onBigCode = false;
				$scope.isLC = false;
			}

			// var swiper2 = new Swiper('.swiperBeScanShow .swiper-container', {
			// 	navigation: {
			// 		nextEl: '.swiper-button-next',
			// 		prevEl: '.swiper-button-prev',
			// 	},
			// 	observer: true, //修改swiper自己或子元素時，自動初始化swiper
			// 	observeParents: true, //修改swiper的父元素時，自動初始化swiper
			// });

			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				clearInterval($scope.interval); //結束限制三分鐘後離開頁面
				$timeout.cancel($scope.mytimeout); //結束倒數秒數
				// if (typeof device === 'object' && typeof device.platform !== 'undefined' && device.platform == 'Android') {
				// 	framework.enabledScreenshotPrevention(screenOk,screenNg);
				// }
				qrcodePayServices.closeActivity();
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;

		});
	//=====[ END]=====//


});
