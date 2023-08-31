/**
 * []
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('fundChangeSipOtiResultCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, stringUtil, framework, sysCtrl
			, qrcodePayServices
			, qrCodePayTelegram
		) {
			//==參數設定==//
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.numFmt = stringUtil.formatNum;
			
			$scope.response = $stateParams.response;
			$scope.keepData = $stateParams.keepData;

			//android實體鍵盤返回鍵lock
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				$state.go('fundResultSipOti',{},{location: 'replace'});
			}

			//---[日期格式:YYYMMDD(民國年)]---//
			function TWYearFormat() {
				var dt = new Date();
				var timestamp = dt.getTime();
				if (timestamp) {
					$scope.month = dt.getMonth() + 1;
					$scope.month = ('0' + $scope.month).substr(-2);
					$scope.date = ('0' + dt.getDate()).substr(-2);
					$scope.year = dt.getFullYear() - 1911;
					$scope.year = ('00' + $scope.year).substr(-3);
					$scope.YYYMMDD =  $scope.year + $scope.month + $scope.date;
					return $scope.year + '/' + $scope.month + '/' + $scope.date;
				}
			}
			$scope.todayDt = TWYearFormat();

			//日期陣列元素整理(value無值則移除)
			function removeLenZero(tempArr) {
				var j = 0;
				var outArr = [];
				for (i = 0; i < tempArr.length; i++) {
					if (tempArr[i].length != 0) {
						outArr[j] = tempArr[i];
						j += 1;
					}
				}
				return outArr;
			}

			//日期字串處理：加入日
			function addDayWroding(str) {
				if (str.indexOf(",") > -1) {
					str = str.split(",").join("日,");
					str = str + "日";
				} else {
					str = str + "日";
				}
				return str;
			}

			//扣款狀態
			$scope.payTypeFlagMenu = [
				{
					DebitStatusFlag: "N",
					DebitStatus: '不變更'
				},
				{
					DebitStatusFlag: "S",
					DebitStatus: '暫停扣款'
				},
				{
					DebitStatusFlag: "R",
					DebitStatus: '恢復扣款'
				}
			];
			//扣款狀態對應
			function getPayTypeFlag(status) {
				if (status == "") { status = "N"; }
				$scope.DebitStatusFlagStr = "正常";
				for (var i in $scope.payTypeFlagMenu) {
					if ($scope.payTypeFlagMenu[i].DebitStatusFlag == status) {
						if (status != "N") {
							$scope.DebitStatusFlagStr = $scope.payTypeFlagMenu[i].DebitStatus;
						}
						return $scope.payTypeFlagMenu[i].DebitStatusFlag;
					}
				}
				return status;
			}

			function setDebitDate() {
                if ($scope.keepData.debitDateType === "month") {
                    $scope.debitDateTitle = "每月";
                    $scope.debitDate = $scope.response.payDate31;
                } else {
                    $scope.debitDateTitle = "每週";
                    $scope.debitDate = $scope.response.payDate5W;
                }
            }

			//下行電文 回覆訊息顯示
			$scope.result = {};
			$scope.result.respCode = $scope.response.respCode;
			$scope.result.trnsRsltCode = $scope.response.trnsRsltCode;
			$scope.result.respCodeMsg = $scope.response.respCodeMsg;
			$scope.result.trnsRsltCodeMsg = $scope.response.trnsRsltCodeMsg;
			$scope.result.hostCodeMsg = $scope.response.hostCodeMsg;
			$scope.result.hostCode = $scope.response.hostCode;

			if (($scope.result.respCode == null || $scope.result.respCode == '') && $scope.result.trnsRsltCode != null) {
				$scope.result.respCode = $scope.result.trnsRsltCode;
			}
			if (($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.trnsRsltCodeMsg != null) {
				$scope.result.respCodeMsg = $scope.result.trnsRsltCodeMsg;
			}
			if (($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.hostCodeMsg != null) {
				$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
			}

			if ($scope.result.respCode == '0') {
				//基金名稱
				$scope.fundInfo = $scope.response.fundCode + $scope.response.fundName;

				//扣款日期
				var temp_DebitDate = [];
				if ($scope.response.payDate1 !== "00" && $scope.response.payDate1 !== "") {
					temp_DebitDate.push($scope.response.payDate1);
				}
				if ($scope.response.payDate2 !== "00" && $scope.response.payDate2 !== "") {
					temp_DebitDate.push($scope.response.payDate2);
				}
				if ($scope.response.payDate3 !== "00" && $scope.response.payDate3 !== "") {
					temp_DebitDate.push($scope.response.payDate3);
				}
				if ($scope.response.payDate4 !== "00" && $scope.response.payDate4 !== "") {
					temp_DebitDate.push($scope.response.payDate4);
				}
				if ($scope.response.payDate5 !== "00" && $scope.response.payDate5 !== "") {
					temp_DebitDate.push($scope.response.payDate5);
				}
				var DebitDateStr = removeLenZero(temp_DebitDate).toString();
				$scope.DebitDateStr = addDayWroding(DebitDateStr);
				setDebitDate();

				//每次投資金額
				$scope.investAmnt = parseInt($scope.response.investAmnt/100);
				//扣款狀態
				getPayTypeFlag($scope.response.payTypeFlag);
			}


			$scope.clickDisAgree = function () {
				framework.backToNative();
			}
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;


		});
	//=====[ END]=====//


});