/**
 * []
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/directive/scaleQRCode/showQrcodeDirective'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('qrcodePayBeScanResultCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil
			, qrcodePayServices, $window
			, qrCodePayTelegram
			, qrcodeTelegramServices
		) {
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				qrcodePayServices.closeActivity();
			}

			$scope.result = $stateParams.result;
			$scope.result.respCode = $scope.result.trnsRsltCode;
			$scope.result.hostCode = $scope.result.trnsRsltCode;
			$scope.result.respCodeMsg = $scope.result.hostCodeMsg;

			// console.log(JSON.stringify($scope.result));
			if($scope.result.respCode == 0){
				localStorage.setItem("defaultType",localStorage.getItem("pay_method"))
			}

			qrcodePayServices.getLoginInfo(function (res) {
				$scope.custId = res.custId;
				var form = { txnType: 'T' };
				form.custId = $scope.custId;
				qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res) {
					// console.log(JSON.stringify(res));
					if (res) {
						$scope.defaultTrnsOutAcct = stringUtil.formatAcct(res.defaultTrnsOutAcct);
						$scope.genQRCodeTime = TWYearFormat($scope.result.trnsCompleteTime);
						// $scope.amount = stringUtil.formatNum(parseInt($scope.result.trnsAmount)/100);
						$scope.amount = stringUtil.formatNum(parseInt($scope.result.trnsAmount));
						$scope.TSN = $scope.result.TSN;
					} else {
						framework.alert('取得預設轉出帳號失敗!', function () {
							qrcodePayServices.closeActivity();
							return;
						});
					}
				}, null, false);
			});

			//---[日期格式:YYYMMDD(民國年)]---//
			function TWYearFormat(srcDate) {
				var rtnDate = '';
				if (srcDate == null || srcDate === '') {
					return rtnDate;
				}

				if (srcDate instanceof Date) {
					rtnDate = srcDate.getFullYear() - 1911 + "/" +
						stringUtil.padLeft(srcDate.getMonth() + 1, 2) +
						"/" + stringUtil.padLeft(srcDate.getDate(), 2) +
						" " + stringUtil.padLeft(srcDate.getHours(), 2) +
						":" + stringUtil.padLeft(srcDate.getMinutes(), 2) +
						":" + stringUtil.padLeft(srcDate.getSeconds(), 2);
					return rtnDate;
				}

				//yyyyMMddHHmmss -> yyy/MM/dd HH:mm:ss
				rtnDate = parseInt(srcDate.substr(0, 4)) - 1911 + 
					"/" + srcDate.substr(4, 2) +
					"/" + srcDate.substr(6, 2) +
					" " + srcDate.substr(8, 2) +
					":" + srcDate.substr(10, 2) +
					":" + srcDate.substr(12, 2);
				return rtnDate;
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
	//=====[ END]=====//


});