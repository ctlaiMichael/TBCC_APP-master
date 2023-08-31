/**
 * []
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('transQueryRefundCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, $log, stringUtil
			, qrcodePayServices, $window
			, qrCodePayTelegram
			, qrcodeTelegramServices
		) {
			//==參數設定==//
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

			$scope.limitTime = parseInt(framework.getConfig("QRCODE_DURATION_TIME", 'I')); //被掃頁面停留3min = 180
			$scope.checkSS = parseInt(framework.getConfig("QRCODE_CHECK_TIME", 'I'));      // x秒檢查一次被掃結果
			$scope.genQRCode = "";
			$scope.genBarcode = "";

			qrcodePayServices.getLoginInfo(function (res) {
				$scope.custId = res.custId;
			});	

			//處理一維二維條碼
			// console.log(typeof $stateParams.result);
			$scope.result = $stateParams.result; 
			$scope.result.respCode = $scope.result.trnsRsltCode;
			if ($scope.result.QR.mode =='0') {
				$scope.genQRCode = encodeURI($scope.result.qrcode);
				$scope.genBarcode = ""; 
			}else if ($scope.result.QR.mode =='1') {
				$scope.genQRCode = $scope.result.qrcode;
				$scope.genBarcode = $scope.result.barcode; 
			}
			// console.log(JSON.stringify($scope.result));

			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				if ($scope.onBigCode == true) {
					$scope.onBigCode = false;
					// $state.go('qrcodePayBeScanShow', { result: $stateParams.result });
					
					clearInterval($scope.interval); //結束限制三分鐘後離開頁面
					$timeout.cancel($scope.mytimeout); //結束倒數秒數
					var from = {};
					qrcodePayServices.backToQRTransList(from);
				} else {
					// qrcodePayServices.closeActivity();
					
					clearInterval($scope.interval); //結束限制三分鐘後離開頁面
					$timeout.cancel($scope.mytimeout); //結束倒數秒數
					
					var from = {};
					qrcodePayServices.backToQRTransList(from);
				}
			}
			function backToQRTransList() {
				var form = {};
				form.keepData = $scope.result.keepData;
				// console.log(JSON.stringify(form));
				qrcodePayServices.backToQRTransList(form);
			}

			//啟動時間控制
			controlTime();

			//倒數控制
			function controlTime() {
				//限制三分鐘後離開頁面
				$scope.onTimeout = function () {
					framework.alert('停留時間已經超過三分鐘囉，\n即將回到交易紀錄!\n\n如欲確認交易結果,請執行交易結果查詢進行確認', function () {
						$timeout.cancel($scope.mytimeout); //結束倒數秒數
						
						//返回list
						backToQRTransList();
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
						// if ((c % $scope.checkSS == 0) && (c <= 160)) {
							// console.log(c);
							//檢查被掃結果
							checkBeScan();
						}
					} else {
						clearInterval($scope.interval); //結束限制三分鐘後離開頁面
					}
				}
				$scope.interval = window.setInterval(showNext, 1000);  // 設定循環

				//檢查交易結果
				function checkBeScan() {
					var form = {};
					form.custId = $scope.custId;
					form.qrcodeSN = $scope.result.qrcodeSN;
					// console.log(JSON.stringify(form))
					qrCodePayTelegram.send('qrcodePay/fq000307', form, function (chkres,error) {
						// console.log(JSON.stringify(chkres));
						if (chkres) {
							if (chkres.trnsRsltCode !== '2') {
								clearInterval($scope.interval); //結束限制三分鐘後離開頁面
								$timeout.cancel($scope.mytimeout); //結束倒數秒數
								if (chkres.trnsRsltCode == '0') {
									chkres.QR = $scope.result.QR;
								}
								// console.log(JSON.stringify(chkres))
								$state.go('transQueryRefundResult', { result: chkres });
							}
						}else{
							framework.alert(error.respCodeMsg, function () {
								//返回list
								backToQRTransList();
								return;
							});
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
				valid: function (valid) {
				}
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
				var tmp = document.getElementById('getqr').children[0].toDataURL("image/png").split('base64,');
				$scope.outimg = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
				$scope.popShow = "pop_contentQR";
			}

			//顯示大圖 - Barcode
			$scope.showBigBarcode = function () {
				$scope.onBigCode = true;
				var tmp = document.getElementById('getBarcode').children[0].src.split('base64,');
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
				// qrcodePayServices.closeActivity();

				clearInterval($scope.interval); //結束限制三分鐘後離開頁面
				$timeout.cancel($scope.mytimeout); //結束倒數秒數

				//返回list
				backToQRTransList();
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;

		});
	//=====[ END]=====//


});