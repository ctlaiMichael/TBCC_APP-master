/**
 * []
 */
define([
	'app'
	, 'modules/directive/epayLeftMenu/epayLeftMenuDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	// , 'modules/directive/scaleQRCode/showQrcodeDirective'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('qrcodeGetBeScanEditCtrl',
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
			$scope.checkSS = parseInt(framework.getConfig("QRCODE_CHECK_TIME", 'I'));      // x秒檢查一次被掃結果
			$scope.genQRCode = "";
			$scope.genBarcode = "";
			$scope.nowScreen = "qrcodeGetBeScanEdit";
			$scope.logo = "ui/newMainPage/image/tcbicon.png";

			$scope.result = $stateParams.result; //fq000302 一維二維
			//$scope.result.respCode = $scope.result.trnsRsltCode;
			$scope.result.respCode = '';
			$scope.defaultTrnsOutAcct= '';
			// if(($scope.result.respCode == null|| $scope.result.respCode == '') && $scope.result.trnsRsltCode!=null){
			// 	$scope.result.respCode = $scope.result.trnsRsltCode;
			// }
			// if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.trnsRsltCodeMsg!=null){
			// 	$scope.result.respCodeMsg = $scope.result.trnsRsltCodeMsg;
			// }
			// if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.hostCodeMsg!=null){
			// 	$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
			// } 
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				if ($scope.onBigCode == true) {
					$scope.onBigCode = false;
					$state.go('qrcodeGetBeScanEdit', { result: $stateParams.result });
				}else{
					clearInterval($scope.interval); //結束限制三分鐘後離開頁面
					$timeout.cancel($scope.mytimeout); //結束倒數秒數
					qrcodePayServices.closeActivity();
				}
			}
			var encodeURI = function(str){
				return encodeURIComponent(str);
			}
			


			//取得mobileBarcode
			qrcodePayServices.getLoginInfo(function (res) {
				$scope.custId = res.custId;

				var form = { txnType: 'T' };
				form.custId = $scope.custId;
				qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res) {
					// console.log(JSON.stringify(res));
					if (res) {
						$scope.defaultTrnsOutAcct = stringUtil.padLeft(res.defaultTrnsOutAcct,16);
						// 帳號模糊化 ex:"0560-***-***456"
						var trnsAcctReFmt = stringUtil.formatAcct(res.defaultTrnsOutAcct);
						trnsAcctReFmt = stringUtil.hideAcctInfo(trnsAcctReFmt);
						$scope.myAcct = trnsAcctReFmt;
						$scope.result.respCode = res.trnsRsltCode;
						// console.log($scope.defaultTrnsOutAcct + ' ' + $scope.defaultTrnsOutAcct.length);
						if ((res.mobileBarcode == "")||(typeof res.mobileBarcode == "undefined")) {
							$scope.mobileBarcode = ""; //發票載具條碼 目前沒有值
							$scope.cardNoFlag = "N";
						} else {
							$scope.mobileBarcode = res.mobileBarcode;
							//alert($scope.mobileBarcode);
							$scope.cardNoFlag = "Y";
						}
					} else {
						$scope.mobileBarcode = "";
						$scope.cardNoFlag = "N";
					}

					//處理一維二維條碼
					//alert($scope.defaultTrnsOutAcct);
					//alert($scope.genQRCode);
					$scope.genQRCode = "TWQRP://個人轉帳/158/02/V1?D5=006&D6="+$scope.defaultTrnsOutAcct;
					$scope.genQRCode = encodeURI($scope.genQRCode);
					//alert($scope.genQRCode);
					$scope.genBarcode = $scope.result.barcode;
					//alert(JSON.stringify($scope.result));
					$scope.createTime = $scope.result.createTime;
					//console.log(JSON.stringify($scope.result));
					//啟動時間控制
					//controlTime();
				}, null, false);
			});


			//倒數控制
			// function controlTime() {
			// 	//限制三分鐘後離開頁面
			// 	$scope.onTimeout = function () {
			// 		framework.alert('停留時間已經超過三分鐘囉，\n即將回到台灣Pay首頁!\n\n如欲確認交易結果,請執行行動網銀存款查詢', function () {
			// 			$timeout.cancel($scope.mytimeout); //結束倒數秒數
			// 			qrcodePayServices.closeActivity();
			// 			return;
			// 		});
			// 	};
			// 	$scope.mytimeout = $timeout($scope.onTimeout, $scope.limitTime * 1000);

			// 	//倒數秒數
			// 	var c = $scope.limitTime;
			// 	var t;
			// 	function showNext() {
			// 		c = c - 1;
			// 		if (c >= 0) {
			// 			$scope.limitSec = c + "秒";
			// 			if ((c % $scope.checkSS == 0) && (c > 19)) {
			// 				// console.log(c);
			// 				//檢查被掃結果
			// 				checkBeScan();
			// 			}
			// 		} else {
			// 			clearInterval($scope.interval); //結束限制三分鐘後離開頁面
			// 		}
			// 	}
			// 	$scope.interval = window.setInterval(showNext, 1000);  // 設定循環

			// 	//檢查交易結果
			// 	function checkBeScan() {
			// 		var form = {};
			// 		form.custId = $scope.custId;
			// 		form.trnsGenerateTime = $scope.createTime;
			// 		form.trnsfrOutAcct = $scope.defaultTrnsOutAcct;
			// 		// console.log(JSON.stringify(form))
			// 		qrCodePayTelegram.send('qrcodePay/fq000303', form, function (res) {
			// 			// console.log(JSON.stringify(res));
			// 			if (res) {
			// 				if (res.trnsRsltCode == 0) {
			// 					clearInterval($scope.interval); //結束限制三分鐘後離開頁面
			// 					$timeout.cancel($scope.mytimeout); //結束倒數秒數
			// 					$state.go('qrcodePayBeScanResult', { result: res });
			// 				}else{
			// 					// console.log("303 errmsg:"+res.hostCodeMsg);
			// 				}
			// 			}
			// 		}, null, true);
			// 	}
			// }

			//一維條碼 mobileBarcode 設定
			// $scope.bc = {
			// 	format: 'CODE39',
			// 	lineColor: '#000000',
			// 	width: 2,
			// 	height: 100,
			// 	displayValue: false,
			// 	fontOptions: '',
			// 	font: 'monospace',
			// 	textAlign: 'center',
			// 	textPosition: 'bottom',
			// 	textMargin: 2,
			// 	fontSize: 20,
			// 	background: '#ffffff',
			// 	margin: 0,
			// 	marginTop: undefined,
			// 	marginBottom: undefined,
			// 	marginLeft: undefined,
			// 	marginRight: undefined,
			// 	valid: function (valid) {
			// 	}
			// };

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
				valid: function (valid) {
				}
			};

			//沒有發票載具條碼
			$scope.getBarcode = function () {
				//導頁到查詢頁面
				$state.go('getBarcodeEdit', {});
			}

			//顯示大圖 - QRCode
			$scope.showBigQrcode = function () {
				$scope.onBigCode = true;
				var tmp = document.getElementById('getqr').children[1].toDataURL("image/png").split('base64,');
				$scope.outimg = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
				$scope.popShow = "pop_contentQR";
			}

			//顯示大圖 - Barcode
			$scope.showBigBarcode = function () {
				// console.log(typeof document.getElementById('getBarcode').children);
				// console.log(document.getElementById('getBarcode').children[0].src);
				$scope.onBigCode = true;
				var tmp = document.getElementById('getBarcode').children[0].src.split('base64,');
				$scope.outimg = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
				$scope.popShow = "pop_contentBar";
			}
			$scope.showBigBarcode1 = function () {
				$scope.onBigCode = true;
				var tmp = document.getElementById('getBarcode1').children[0].src.split('base64,');
				$scope.outimg = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
				$scope.popShow = "pop_contentBar";
			}
			$scope.clickBigCode = function (show) {
				$scope.onBigCode = show;
			}
			$scope.closeBigCode = function () {
				$scope.onBigCode = false;
			}

			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				clearInterval($scope.interval); //結束限制三分鐘後離開頁面
				$timeout.cancel($scope.mytimeout); //結束倒數秒數
				qrcodePayServices.closeActivity();
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;

		});
	//=====[ END]=====//


});
