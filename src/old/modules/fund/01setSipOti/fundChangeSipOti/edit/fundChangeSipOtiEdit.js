/**
 * []
 */
define([
	'app'
	, 'modules/directive/security/securitySelectorDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
	, 'modules/service/qrcodePay/securityServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('fundChangeSipOtiEditCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $sce, $log, $css
			, qrcodePayServices
			, qrCodePayTelegram
			, qrcodeTelegramServices
			, securityServices
		) {
			//==參數設定==//
			$scope.noSSL = false;
			$scope.noOTP = true;
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.numFmt = stringUtil.formatNum;
			$scope.funds = $stateParams.paymentData;
			$scope.reqfi000702Param = $stateParams.reqfi000702Param;
			$scope.tempName = $scope.reqfi000702Param.transCode + '<br>' + $scope.reqfi000702Param.fundName;
			$scope.fundTarget = $sce.trustAsHtml($scope.tempName);
			$css.add('ui/tcbbOldStyle/css/main.css');
			$css.add('ui/tcbbOldStyle/css/modify.css');

			//扣款狀態
			$scope.payTypeFlagMenu = [
				{
					DebitStatusFlag: "N",
					DebitStatus: '正常扣款'
				},
				{
					DebitStatusFlag: "S",
					DebitStatus: '暫停扣款'
				}
			];

			//main main main
			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				$scope.custId = res.custId;
				
				if (typeof $stateParams.keepData.dateIsChange !== "undefined") {
					$scope.defaultSecurityType = $stateParams.securityType;
					$scope.keepData = $stateParams.keepData;
					$scope.resfi000702Param = $stateParams.resfi000702Param;
					$scope.reqfi000702Param = $stateParams.reqfi000702Param;
					$scope.OutAC = $stateParams.OutAC;
					$scope.InAC = $stateParams.InAC;
					// $log.debug("$stateParams.keepData:" + JSON.stringify($stateParams.keepData));
					// $log.debug("$scope.resfi000702Param:" + JSON.stringify($scope.resfi000702Param));
					//每次投資金額
					$scope.purchAmnt = $scope.keepData.new.purchAmnt;
					//扣款日期
					$scope.DebitDateShow = $scope.keepData.new.Date;
					//扣款狀態
					$scope.payTypeFlagSelected = $scope.keepData.new.payTypeFlag;
					//扣款帳號
					$scope.SelectDebitAcctSelected = $scope.keepData.new.payAcnt;
					//現金收益帳號
					$scope.SelectCreditAcctSelected = $scope.keepData.new.profitAcnt;
				} else {
					//FI000702-投資設定查詢
					getFI000702($scope.reqfi000702Param);
				}
			});
			

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
					$scope.YYYMMDD = $scope.year + $scope.month + $scope.date;
					return $scope.year + '/' + $scope.month + '/' + $scope.date;
				}
			}
			TWYearFormat();
			var todayDt = $scope.YYYMMDD;

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

			//扣款狀態對應
			function getPayTypeFlag(status) {
				if (status == "S" || status == "R") {
				} else {
					status = "N";
				}
				for (var i in $scope.payTypeFlagMenu) {
					if ($scope.payTypeFlagMenu[i].DebitStatusFlag == status) {
						return $scope.payTypeFlagMenu[i].DebitStatusFlag;
					}
				}
				return status;
			}

			//設定完成前，判斷是否有異動
			function checkOriNewChange() {
				var isChanged = "N";
				// 個數不同
				if ($scope.keepData.ori.Date.split(",").length !== $scope.keepData.new.Date.split(",").length) {
					isChanged = "Y";
					$scope.keepData.dateIsChange = isChanged;
					return;
				}
				// 個數相同，值異
				var temp_DebitDate = $scope.keepData.ori.Date.split(",");
				for (i = 0; i < $scope.keepData.new.Date.split(",").length; i++) {
					if (temp_DebitDate.indexOf($scope.keepData.new.Date.split(",")[i]) === -1) {
						isChanged = "Y";
						$scope.keepData.dateIsChange = isChanged;
						return;
					}
				}
				$scope.keepData.dateIsChange = isChanged;
				return;
			}



			//F5000101-台幣活存約定轉出及轉入帳號查詢
			function getF5000101(temp_INCurrency) {
				var currencyType = "B"; //台幣
				if (temp_INCurrency == "NTD" || temp_INCurrency == "TWD") {
					temp_INCurrency = "TWD"
					currencyType = "B"; //台幣
				} else {
					currencyType = "1"; //外幣
				}
				var form = {};
				form.custId = $scope.custId; //$scope.reqfi000702Param.custId;
				form.type = currencyType;

				qrCodePayTelegram.send('qrcodePay/f5000101', form, function (res, error) {
					// $log.debug("f5000101:" + JSON.stringify(res));
					if (res) {

						var actsOut = qrCodePayTelegram.toArray(res.trnsOutAccts.trnsOutAcct);
						$scope.OutAC = [];
						for (key in actsOut) {
							if (temp_INCurrency == "TWD"){
								if (actsOut[key].trnsOutCurr.indexOf(temp_INCurrency) > -1) {
									var tempOut = {};
									tempOut.trnsOutAcct = actsOut[key].trnsfrOutAccnt;
									$scope.OutAC.push(tempOut);
								}
							}else {
								if (actsOut[key].trnsOutCurr.indexOf("TWD") == -1) {
									var tempOut = {};
									tempOut.trnsOutAcct = actsOut[key].trnsfrOutAccnt;
									$scope.OutAC.push(tempOut);
								}
							}
						}
						var actsIn = qrCodePayTelegram.toArray(res.trnsOutAccts.trnsOutAcct);
						$scope.InAC = [];
						for (key in actsIn) {
							if (temp_INCurrency == "TWD"){
								if (actsIn[key].trnsOutCurr.indexOf(temp_INCurrency) > -1) {
									var tempIn = {};
									tempIn.acctNo = actsIn[key].trnsfrOutAccnt;
									$scope.InAC.push(tempIn);
								}
							}else {
								if (actsIn[key].trnsOutCurr.indexOf("TWD") == -1) {
									var tempIn = {};
									tempIn.acctNo = actsIn[key].trnsfrOutAccnt;
									$scope.InAC.push(tempIn);
								}
							}
						}
						// $log.debug(JSON.stringify($scope.InAC));
						// $log.debug("in:" + $scope.InAC.length);

						//扣款帳號
						$scope.SelectDebitAcctSelected = $scope.resfi000702Param.payAcnt; //扣款帳號帳號對應
						//現金收益帳號
						$scope.SelectCreditAcctSelected = $scope.resfi000702Param.profitAcnt; //現金收益帳號對應
						//for keepParam a.本頁>傳遞到日期編輯>本頁 b.本頁>確定變更	
						keepParam($scope.resfi000702Param);
						setDeclineAndGain();
					} else {
						framework.alert(error.respCodeMsg, function () {
							framework.backToNative();
						});
					}
				}, null, false);
			}

			//FI000702-投資設定查詢
			function getFI000702(reqfi000702Param) {
				var form = {};
				form.custId = $scope.custId; //reqfi000702Param.custId;
				form.transCode = reqfi000702Param.transCode;
				form.trustAcnt = reqfi000702Param.trustAcnt;

				qrCodePayTelegram.send('qrcodePay/fi000702', form, function (res, error) {
					$log.debug("fi000702 res:" + JSON.stringify(res));
					if (res) {
						$scope.resfi000702Param = res;
						//明細的token
						$scope.trnsToken = res.trnsToken;
						//每次投資金額
						$scope.purchAmnt = parseInt(res.purchAmnt);
						//扣款日期
						var temp_DebitDate = [];
						if (res.payDate1 !== "00" && res.payDate1 !== "") {
							temp_DebitDate.push(parseInt(res.payDate1));
						}
						if (res.payDate2 !== "00" && res.payDate2 !== "") {
							temp_DebitDate.push(parseInt(res.payDate2));
						}
						if (res.payDate3 !== "00" && res.payDate3 !== "") {
							temp_DebitDate.push(parseInt(res.payDate3));
						}
						if (res.payDate4 !== "00" && res.payDate4 !== "") {
							temp_DebitDate.push(parseInt(res.payDate4));
						}
						if (res.payDate5 !== "00" && res.payDate5 !== "") {
							temp_DebitDate.push(parseInt(res.payDate5));
						}

						if ((typeof res.payDate31).toString() !== "object" && res.payDate31.length > 0) {
							$scope.temp_DebitDateStr = res.payDate31;
						} else {
							$scope.temp_DebitDateStr = removeLenZero(temp_DebitDate).toString(); //日期陣列元素整理(value無值則移除)
						}
						$scope.DebitDateShow = $scope.temp_DebitDateStr;
						//扣款狀態
						// $scope.payTypeFlagSelected = $scope.payTypeFlagMenu[0].DebitStatusFlag;
						$scope.payTypeFlagSelected = getPayTypeFlag($scope.reqfi000702Param.debitStatus); //??暫用??
						//F5000101-台幣活存約定轉出帳號查詢
						getF5000101($scope.reqfi000702Param.INCurrency); //F5000101-台幣活存約定轉出帳號查詢
						initDeclineAndGain();
						getFI000402();
					} else {
						framework.alert(error.respCodeMsg, function () {
							framework.backToNative();
						});
					}
				}, null, false);
			}

			$scope.changeFundType = function(fundType) {
				$scope.compCode = "";
				$scope.keepData.newFund = "";
				$scope.keepData.fundType = fundType;
			};

			$scope.changeSelectfund = function(selectfund) {
				$scope.compCode = "";
				$scope.keepData.newFund = "";
				$scope.keepData.selectfund = selectfund;
				getFI000402();
			};

			$scope.changeCompCode = function () {
				$scope.keepData.newFund = "";
				getFI000402();
			};

			$scope.changeFund = function () {
				if ($scope.keepData.newFund === "") {
					$scope.keepData.INCurrency = $scope.resfi000702Param.INCurrency;
					$scope.INCurrencyMessage = "";
					setDeclineAndGain();
					return;
				}
				$scope.keepData.INCurrency = $scope.keepData.newFund.currency;
				$scope.purchAmnt = 0;
				if (($scope.keepData.newFund.currency !== "NTD" || $scope.keepData.newFund.currency !== "TWD")
				        && $scope.resfi000702Param.INCurrency !== $scope.keepData.newFund.currency) {
					$scope.INCurrencyMessage = "投資標的已變更，請重新確認扣款金額";
				} else {
					$scope.INCurrencyMessage = "";
				}
				getF5000101($scope.keepData.newFund.currency);
			};

			var declineAndGainList = [
				{currency : "TWD", data : [1000, 2000, 3000, 4000, 5000]},
				{currency : "USD", data : [100, 200, 300, 400, 500]},
				{currency : "AUD", data : [100, 200, 300, 400, 500]},
				{currency : "CAD", data : [100, 200, 300, 400, 500]},
				{currency : "CHF", data : [100, 200, 300, 400, 500]},
				{currency : "EUR", data : [100, 200, 300, 400, 500]},
				{currency : "GBP", data : [100, 200, 300, 400, 500]},
				{currency : "HKD", data : [1000, 2000, 3000, 4000, 5000]},
				{currency : "JPY", data : [10000, 20000, 30000, 40000, 50000]},
				{currency : "SEK", data : [1000, 2000, 3000, 4000, 5000]},
				{currency : "CNY", data : [1000, 2000, 3000, 4000, 5000]},
				{currency : "ZAR", data : [1000, 2000, 3000, 4000, 5000]},
				{currency : "NZD", data : [100, 200, 300, 400, 500]},
				{currency : "SGD", data : [100, 200, 300, 400, 500]}
			];
			function setDeclineAndGain() {
				if ($scope.keepData.investType !== "D") {
					return;
				}
				$scope.keepData.declineAndGain = declineAndGainList.find(function (element) {
					return element.currency === $scope.keepData.INCurrency;
				});
				if ((typeof $scope.keepData.declineAndGain).toString() === "undefined") {
					$scope.keepData.declineAndGain = {currency : "TWD", data : [1000, 2000, 3000, 4000, 5000]};
				}
			}
			function initDeclineAndGain() {
				$scope.resfi000702Param.decline1Cd = (typeof $scope.resfi000702Param.decline1Cd).toString() === "object" ? "-" : $scope.resfi000702Param.decline1Cd;
				$scope.resfi000702Param.decline1 = (typeof $scope.resfi000702Param.decline1).toString() === "object" ? 0 : Number($scope.resfi000702Param.decline1);
				$scope.resfi000702Param.decline2Cd = (typeof $scope.resfi000702Param.decline2Cd).toString() === "object" ? "-" : $scope.resfi000702Param.decline2Cd;
				$scope.resfi000702Param.decline2 = (typeof $scope.resfi000702Param.decline2).toString() === "object" ? 0 : Number($scope.resfi000702Param.decline2);
				$scope.resfi000702Param.decline3Cd = (typeof $scope.resfi000702Param.decline3Cd).toString() === "object" ? "-" : $scope.resfi000702Param.decline3Cd;
				$scope.resfi000702Param.decline3 = (typeof $scope.resfi000702Param.decline3).toString() === "object" ? 0 : Number($scope.resfi000702Param.decline3);
				$scope.resfi000702Param.decline4Cd = (typeof $scope.resfi000702Param.decline4Cd).toString() === "object" ? "-" : $scope.resfi000702Param.decline4Cd;
				$scope.resfi000702Param.decline4 = (typeof $scope.resfi000702Param.decline4).toString() === "object" ? 0 : Number($scope.resfi000702Param.decline4);
				$scope.resfi000702Param.decline5Cd = (typeof $scope.resfi000702Param.decline5Cd).toString() === "object" ? "-" : $scope.resfi000702Param.decline5Cd;
				$scope.resfi000702Param.decline5 = (typeof $scope.resfi000702Param.decline5).toString() === "object" ? 0 : Number($scope.resfi000702Param.decline5);
				$scope.resfi000702Param.gain1Cd = (typeof $scope.resfi000702Param.gain1Cd).toString() === "object" ? "+" : $scope.resfi000702Param.gain1Cd;
				$scope.resfi000702Param.gain1 = (typeof $scope.resfi000702Param.gain1).toString() === "object" ? 0 : Number($scope.resfi000702Param.gain1);
				$scope.resfi000702Param.gain2Cd = (typeof $scope.resfi000702Param.gain2Cd).toString() === "object" ? "+" : $scope.resfi000702Param.gain2Cd;
				$scope.resfi000702Param.gain2 = (typeof $scope.resfi000702Param.gain2).toString() === "object" ? 0 : Number($scope.resfi000702Param.gain2);
				$scope.resfi000702Param.gain3Cd = (typeof $scope.resfi000702Param.gain3Cd).toString() === "object" ? "+" : $scope.resfi000702Param.gain3Cd;
				$scope.resfi000702Param.gain3 = (typeof $scope.resfi000702Param.gain3).toString() === "object" ? 0 : Number($scope.resfi000702Param.gain3);
				$scope.resfi000702Param.gain4Cd = (typeof $scope.resfi000702Param.gain4Cd).toString() === "object" ? "+" : $scope.resfi000702Param.gain4Cd;
				$scope.resfi000702Param.gain4 = (typeof $scope.resfi000702Param.gain4).toString() === "object" ? 0 : Number($scope.resfi000702Param.gain4);
				$scope.resfi000702Param.gain5Cd = (typeof $scope.resfi000702Param.gain5Cd).toString() === "object" ? "+" : $scope.resfi000702Param.gain5Cd;
				$scope.resfi000702Param.gain5 = (typeof $scope.resfi000702Param.gain5).toString() === "object" ? 0 : Number($scope.resfi000702Param.gain5);

				$scope.$watch("resfi000702Param.decline1", function(val) {
					if (val !== 0 && (val % $scope.keepData.declineAndGain.data[0] !== 0)) {
						$scope.decline1Woring = $scope.keepData.declineAndGain.data[0] + "倍數";
					} else {
						$scope.decline1Woring = "";
					}
				});
				$scope.$watch("resfi000702Param.decline2", function(val) {
					if (val !== 0 && (val % $scope.keepData.declineAndGain.data[0] !== 0)) {
						$scope.decline2Woring = $scope.keepData.declineAndGain.data[0] + "倍數";
					} else {
						$scope.decline2Woring = "";
					}
				});
				$scope.$watch("resfi000702Param.decline3", function(val) {
					if (val !== 0 && (val % $scope.keepData.declineAndGain.data[0] !== 0)) {
						$scope.decline3Woring = $scope.keepData.declineAndGain.data[0] + "倍數";
					} else {
						$scope.decline3Woring = "";
					}
				});
				$scope.$watch("resfi000702Param.decline4", function(val) {
					if (val !== 0 && (val % $scope.keepData.declineAndGain.data[0] !== 0)) {
						$scope.decline4Woring = $scope.keepData.declineAndGain.data[0] + "倍數";
					} else {
						$scope.decline4Woring = "";
					}
				});
				$scope.$watch("resfi000702Param.decline5", function(val) {
					if (val !== 0 && (val % $scope.keepData.declineAndGain.data[0] !== 0)) {
						$scope.decline5Woring = $scope.keepData.declineAndGain.data[0] + "倍數";
					} else {
						$scope.decline5Woring = "";
					}
				});
				$scope.$watch("resfi000702Param.gain1", function(val) {
					if (val !== 0 && (val % $scope.keepData.declineAndGain.data[0] !== 0)) {
						$scope.gain1Woring = $scope.keepData.declineAndGain.data[0] + "倍數";
					} else {
						$scope.gain1Woring = "";
					}
				});
				$scope.$watch("resfi000702Param.gain2", function(val) {
					if (val !== 0 && (val % $scope.keepData.declineAndGain.data[0] !== 0)) {
						$scope.gain2Woring = $scope.keepData.declineAndGain.data[0] + "倍數";
					} else {
						$scope.gain2Woring = "";
					}
				});
				$scope.$watch("resfi000702Param.gain3", function(val) {
					if (val !== 0 && (val % $scope.keepData.declineAndGain.data[0] !== 0)) {
						$scope.gain3Woring = $scope.keepData.declineAndGain.data[0] + "倍數";
					} else {
						$scope.gain3Woring = "";
					}
				});
				$scope.$watch("resfi000702Param.gain4", function(val) {
					if (val !== 0 && (val % $scope.keepData.declineAndGain.data[0] !== 0)) {
						$scope.gain4Woring = $scope.keepData.declineAndGain.data[0] + "倍數";
					} else {
						$scope.gain4Woring = "";
					}
				});
				$scope.$watch("resfi000702Param.gain5", function(val) {
					if (val !== 0 && (val % $scope.keepData.declineAndGain.data[0] !== 0)) {
						$scope.gain5Woring = $scope.keepData.declineAndGain.data[0] + "倍數";
					} else {
						$scope.gain5Woring = "";
					}
				});
			}

			function getFI000402() {
				var form = {};
				form.custId = $scope.custId;
				form.investType = $scope.keepData.investType;// A:單筆申購/ B:小額申購(定期定額)/ C:轉換/ D:小額申購(定期不定額)
				form.fundType = $scope.keepData.fundType;// 業務別 C:國內基金 F
				form.selectfund = $scope.keepData.selectfund;// 是否精選
				form.compCode = (form.selectfund === "Y" ? "" : $scope.compCode);// 基金公司代碼
				//form.fundCode = $scope.keepData.new.fundCode;// 轉出基金代碼
				qrCodePayTelegram.send('qrcodePay/fi000402', form, function (res, error) {
					$log.debug("fi000402 res:" + JSON.stringify(res));
					if (res) {
						$scope.keepData.fundList = {};
						if (res.companyLists) {
							$scope.keepData.companyList = res.companyLists.companyList;
						}
						if (res.fundLists) {
							$scope.keepData.fundList = res.fundLists.fundList;
						}
					} else {
                        framework.alert(error.respCodeMsg);
					}
				}, null, false);
			}

			//for 確定變更 欄位顯示
			function keepParam(resfi000702Param) {
				// $log.debug(">>>>>>>>>>>>resfi000702Param:" + JSON.stringify(resfi000702Param));
				$scope.keepData = {};
				$scope.keepData.iNCurrency = resfi000702Param.INCurrency;
				$scope.keepData.dateIsChange = "N";
				$scope.keepData.payTypeIsChanged = "N";
				$scope.keepData.fundType = resfi000702Param.fundType;
				$scope.keepData.selectfund = "Y";
				$scope.keepData.investType = ((typeof resfi000702Param.code).toString() === "object" && Object.keys(resfi000702Param.code).length === 0 ? "B" : "D");
				$scope.keepData.debitDateType = (typeof resfi000702Param.payDate31).toString() !== "object" ? "month" : "week";
				$scope.keepData.INCurrency = $scope.resfi000702Param.INCurrency;
				$scope.keepData.multipleWeek = (typeof $scope.resfi000702Param.payDate5W).toString() === "string" ? $scope.resfi000702Param.payDate5W.split(",") : [];
				$scope.keepData.evaCDText = $scope.resfi000702Param.evaCD === "01" ? "前五營業日淨值/平均成本" : "前五日平均淨值/年平均淨值";
				$scope.keepData.ori = {};
				$scope.keepData.ori.purchAmnt = parseInt(resfi000702Param.purchAmnt);
				$scope.keepData.ori.payTypeFlag = getPayTypeFlag($scope.reqfi000702Param.debitStatus); //??暫用??
				$scope.keepData.ori.Date = $scope.temp_DebitDateStr;
				$scope.keepData.ori.payAcnt = resfi000702Param.payAcnt;
				$scope.keepData.ori.profitAcnt = resfi000702Param.profitAcnt;
				$scope.keepData.new = {};
				$scope.keepData.new.purchAmnt = $scope.keepData.ori.purchAmnt;
				$scope.keepData.new.payTypeFlag = $scope.keepData.ori.payTypeFlag;
				$scope.keepData.new.Date = $scope.keepData.ori.Date;
				$scope.keepData.new.payAcnt = $scope.keepData.ori.payAcnt;
				$scope.keepData.new.profitAcnt = $scope.keepData.ori.profitAcnt;
			}

			//genfi000703Param最新狀態
			function genfi000703Param(chk, inp) {
				//regen keepData
				//每次投資金額
				// $log.debug(typeof $scope.purchAmnt);
				if (typeof $scope.purchAmnt !== "number") {
					framework.alert('每次投資金額須為數字');
					return;
				}
				var tmpPurchAmnt = $scope.purchAmnt;
				if (tmpPurchAmnt.toString().indexOf(".") > -1) {
					framework.alert('請輸入整數');
					return;
				}
				if ($scope.purchAmnt == null || $scope.purchAmnt.length == 0) {
					framework.alert('請輸入每次投資金額');
					return;
				}
				if ($scope.purchAmnt <= 0) {
					framework.alert('每次投資金額須大於0');
					return;
				}
				if ($scope.DebitDateShow === "" && $scope.keepData.multipleWeek.length === 0) {
					framework.alert('請選擇扣款日期');
					return;
				}
				$scope.keepData.new.purchAmnt = parseInt($scope.purchAmnt);
				//扣款狀態
				$scope.keepData.new.payTypeFlag = $scope.payTypeFlagSelected;
				//扣款帳號
				$scope.keepData.new.payAcnt = $scope.SelectDebitAcctSelected;
				//現金收益帳號
				$scope.keepData.new.profitAcnt = $scope.SelectCreditAcctSelected;

				//gen fi000703Param
				if (chk === "GO") {
					$scope.fi000703Param = {};
					$scope.fi000703Param.custId = $scope.custId; //inp.custId;
					$scope.fi000703Param.trustAcnt = (typeof inp.trustAcnt).toString() === "object" ? "" : inp.trustAcnt;
					$scope.fi000703Param.transCode = $scope.reqfi000702Param.transCode;
					$scope.fi000703Param.fundCode = inp.fundCode;
					$scope.fi000703Param.investAmntFlag = "N";
					$scope.fi000703Param.investAmnt = parseInt(inp.purchAmnt);
					$scope.fi000703Param.payDateFlag = "N";
					$scope.fi000703Param.payDate1 = inp.payDate1;
					$scope.fi000703Param.payDate2 = inp.payDate2;
					$scope.fi000703Param.payDate3 = inp.payDate3;
					$scope.fi000703Param.payDate4 = inp.payDate4;
					$scope.fi000703Param.payDate5 = inp.payDate5;
					$scope.fi000703Param.payTypeFlag = "N";
					$scope.fi000703Param.changeBegin = todayDt;
					$scope.fi000703Param.changeEnd = todayDt;
					$scope.fi000703Param.payAcntStatus = "N";
					$scope.fi000703Param.payAcnt = inp.payAcnt; //扣款帳號帳號對應
					$scope.fi000703Param.profitAcntFlag = "N";
					$scope.fi000703Param.oriProfitAcnt = inp.profitAcnt; //現金收益帳號對應
					$scope.fi000703Param.profitAcnt = inp.profitAcnt; //現金收益帳號對應
					$scope.fi000703Param.effectDate = todayDt;
					$scope.fi000703Param.INCurrency = inp.INCurrency;
					$scope.fi000703Param.trnsToken = inp.trnsToken;

					if ($scope.keepData.newFund && $scope.keepData.newFund !== "" && $scope.reqfi000702Param.fundCode !== $scope.keepData.newFund.fundCode) {
						$scope.fi000703Param.payFundFlag = "Y";
						$scope.keepData.fundName = $scope.keepData.newFund.fundName;
						$scope.fi000703Param.newFund = $scope.keepData.newFund.fundCode;
					} else {
						$scope.fi000703Param.payFundFlag = "N";
						$scope.keepData.fundName = $scope.reqfi000702Param.fundName;
						$scope.fi000703Param.newFund = $scope.reqfi000702Param.fundCode;
					}

					if ($scope.keepData.investType === "D") {
						$scope.fi000703Param.payEvaFlag = "Y";
						$scope.fi000703Param.decline1Cd = (typeof $scope.resfi000702Param.decline1Cd).toString() === "object" ? "" : $scope.resfi000702Param.decline1Cd;
						$scope.fi000703Param.decline1 = (typeof $scope.resfi000702Param.decline1).toString() === "object" ? "" : $scope.resfi000702Param.decline1;
						$scope.fi000703Param.decline2Cd = (typeof $scope.resfi000702Param.decline2Cd).toString() === "object" ? "" : $scope.resfi000702Param.decline2Cd;
						$scope.fi000703Param.decline2 = (typeof $scope.resfi000702Param.decline2).toString() === "object" ? "" : $scope.resfi000702Param.decline2;
						$scope.fi000703Param.decline3Cd = (typeof $scope.resfi000702Param.decline3Cd).toString() === "object" ? "" : $scope.resfi000702Param.decline3Cd;
						$scope.fi000703Param.decline3 = (typeof $scope.resfi000702Param.decline3).toString() === "object" ? "" : $scope.resfi000702Param.decline3;
						$scope.fi000703Param.decline4Cd = (typeof $scope.resfi000702Param.decline4Cd).toString() === "object" ? "" : $scope.resfi000702Param.decline4Cd;
						$scope.fi000703Param.decline4 = (typeof $scope.resfi000702Param.decline4).toString() === "object" ? "" : $scope.resfi000702Param.decline4;
						$scope.fi000703Param.decline5Cd = (typeof $scope.resfi000702Param.decline5Cd).toString() === "object" ? "" : $scope.resfi000702Param.decline5Cd;
						$scope.fi000703Param.decline5 = (typeof $scope.resfi000702Param.decline5).toString() === "object" ? "" : $scope.resfi000702Param.decline5;
						$scope.fi000703Param.gain1Cd = (typeof $scope.resfi000702Param.gain1Cd).toString() === "object" ? "" : $scope.resfi000702Param.gain1Cd;
						$scope.fi000703Param.gain1 = (typeof $scope.resfi000702Param.gain1).toString() === "object" ? "" : $scope.resfi000702Param.gain1;
						$scope.fi000703Param.gain2Cd = (typeof $scope.resfi000702Param.gain2Cd).toString() === "object" ? "" : $scope.resfi000702Param.gain2Cd;
						$scope.fi000703Param.gain2 = (typeof $scope.resfi000702Param.gain2).toString() === "object" ? "" : $scope.resfi000702Param.gain2;
						$scope.fi000703Param.gain3Cd = (typeof $scope.resfi000702Param.gain3Cd).toString() === "object" ? "" : $scope.resfi000702Param.gain3Cd;
						$scope.fi000703Param.gain3 = (typeof $scope.resfi000702Param.gain3).toString() === "object" ? "" : $scope.resfi000702Param.gain3;
						$scope.fi000703Param.gain4Cd = (typeof $scope.resfi000702Param.gain4Cd).toString() === "object" ? "" : $scope.resfi000702Param.gain4Cd;
						$scope.fi000703Param.gain4 = (typeof $scope.resfi000702Param.gain4).toString() === "object" ? "" : $scope.resfi000702Param.gain4;
						$scope.fi000703Param.gain5Cd = (typeof $scope.resfi000702Param.gain5Cd).toString() === "object" ? "" : $scope.resfi000702Param.gain5Cd;
						$scope.fi000703Param.gain5 = (typeof $scope.resfi000702Param.gain5).toString() === "object" ? "" : $scope.resfi000702Param.gain5;
					} else {
						$scope.fi000703Param.payEvaFlag = "N";
						$scope.fi000703Param.decline1Cd = (typeof $scope.resfi000702Param.decline1Cd).toString() === "object" ? "" : $scope.resfi000702Param.decline1Cd;
						$scope.fi000703Param.decline1 = (typeof $scope.resfi000702Param.decline1).toString() === "object" ? "" : $scope.resfi000702Param.decline1;
						$scope.fi000703Param.decline2Cd = (typeof $scope.resfi000702Param.decline2Cd).toString() === "object" ? "" : $scope.resfi000702Param.decline2Cd;
						$scope.fi000703Param.decline2 = (typeof $scope.resfi000702Param.decline2).toString() === "object" ? "" : $scope.resfi000702Param.decline2;
						$scope.fi000703Param.decline3Cd = (typeof $scope.resfi000702Param.decline3Cd).toString() === "object" ? "" : $scope.resfi000702Param.decline3Cd;
						$scope.fi000703Param.decline3 = (typeof $scope.resfi000702Param.decline3).toString() === "object" ? "" : $scope.resfi000702Param.decline3;
						$scope.fi000703Param.decline4Cd = (typeof $scope.resfi000702Param.decline4Cd).toString() === "object" ? "" : $scope.resfi000702Param.decline4Cd;
						$scope.fi000703Param.decline4 = (typeof $scope.resfi000702Param.decline4).toString() === "object" ? "" : $scope.resfi000702Param.decline4;
						$scope.fi000703Param.decline5Cd = (typeof $scope.resfi000702Param.decline5Cd).toString() === "object" ? "" : $scope.resfi000702Param.decline5Cd;
						$scope.fi000703Param.decline5 = (typeof $scope.resfi000702Param.decline5).toString() === "object" ? "" : $scope.resfi000702Param.decline5;
						$scope.fi000703Param.gain1Cd = (typeof $scope.resfi000702Param.gain1Cd).toString() === "object" ? "" : $scope.resfi000702Param.gain1Cd;
						$scope.fi000703Param.gain1 = (typeof $scope.resfi000702Param.gain1).toString() === "object" ? "" : $scope.resfi000702Param.gain1;
						$scope.fi000703Param.gain2Cd = (typeof $scope.resfi000702Param.gain2Cd).toString() === "object" ? "" : $scope.resfi000702Param.gain2Cd;
						$scope.fi000703Param.gain2 = (typeof $scope.resfi000702Param.gain2).toString() === "object" ? "" : $scope.resfi000702Param.gain2;
						$scope.fi000703Param.gain3Cd = (typeof $scope.resfi000702Param.gain3Cd).toString() === "object" ? "" : $scope.resfi000702Param.gain3Cd;
						$scope.fi000703Param.gain3 = (typeof $scope.resfi000702Param.gain3).toString() === "object" ? "" : $scope.resfi000702Param.gain3;
						$scope.fi000703Param.gain4Cd = (typeof $scope.resfi000702Param.gain4Cd).toString() === "object" ? "" : $scope.resfi000702Param.gain4Cd;
						$scope.fi000703Param.gain4 = (typeof $scope.resfi000702Param.gain4).toString() === "object" ? "" : $scope.resfi000702Param.gain4;
						$scope.fi000703Param.gain5Cd = (typeof $scope.resfi000702Param.gain5Cd).toString() === "object" ? "" : $scope.resfi000702Param.gain5Cd;
						$scope.fi000703Param.gain5 = (typeof $scope.resfi000702Param.gain5).toString() === "object" ? "" : $scope.resfi000702Param.gain5;
					}

					//扣款日期
					checkOriNewChange();

					if ($scope.keepData.debitDateType === "week") {
						$scope.fi000703Param.payDate5W = $scope.keepData.multipleWeek.toString();
						$scope.fi000703Param.payDateFlag = "Y";

					} else {
						var tmp_fundDateSelected = [];
						if ($scope.keepData.dateIsChange === "Y") {
							tmp_fundDateSelected = $scope.keepData.new.Date.split(",");
							$scope.fi000703Param.payDate31 = $scope.keepData.new.Date;
							$scope.fi000703Param.payDateFlag = "Y";
						} else {
							tmp_fundDateSelected = $scope.keepData.ori.Date.split(",");
							$scope.fi000703Param.payDate31 = $scope.keepData.ori.Date;
							$scope.fi000703Param.payDateFlag = "N";
						}
						$scope.fi000703Param.payDate1 = "00";
						$scope.fi000703Param.payDate2 = "00";
						$scope.fi000703Param.payDate3 = "00";
						$scope.fi000703Param.payDate4 = "00";
						$scope.fi000703Param.payDate5 = "00";
						function checkDTlength(dtStr) {
							if (dtStr.length == 1) {
								return "0" + dtStr;
							} else {
								return dtStr;
							}
						}
						for (i = 0; i < tmp_fundDateSelected.length; i++) {
							if (i == 0) {
								$scope.fi000703Param.payDate1 = checkDTlength(tmp_fundDateSelected[i]);
							}
							if (i == 1) {
								$scope.fi000703Param.payDate2 = checkDTlength(tmp_fundDateSelected[i]);
							}
							if (i == 2) {
								$scope.fi000703Param.payDate3 = checkDTlength(tmp_fundDateSelected[i]);
							}
							if (i == 3) {
								$scope.fi000703Param.payDate4 = checkDTlength(tmp_fundDateSelected[i]);
							}
							if (i == 4) {
								$scope.fi000703Param.payDate5 = checkDTlength(tmp_fundDateSelected[i]);
							}
						}
					}

					//扣款狀態
					if ($scope.keepData.ori.payTypeFlag !== $scope.keepData.new.payTypeFlag) {
						$scope.keepData.payTypeIsChanged = "Y";
						if ($scope.keepData.ori.payTypeFlag == "N") {
							$scope.fi000703Param.payTypeFlag = "S";  // N->S=S
						}
						if ($scope.keepData.ori.payTypeFlag == "S") {
							$scope.fi000703Param.payTypeFlag = "R";  // S->N=R
						}
					} else {
						$scope.keepData.payTypeIsChanged = "N";
						$scope.keepData.new.payTypeIsChanged = $scope.keepData.ori.payTypeFlag;
						$scope.fi000703Param.payTypeFlag = "N"; // N->N=N;S->S=N
					}
					//扣款帳號
					if ($scope.keepData.ori.payAcnt !== $scope.keepData.new.payAcnt) {
						$scope.fi000703Param.payAcntStatus = "Y";
						$scope.fi000703Param.payAcnt = $scope.keepData.new.payAcnt;
					} else {
						$scope.fi000703Param.payAcntStatus = "N";
						$scope.fi000703Param.payAcnt = $scope.keepData.ori.payAcnt;
					}
					//現金收益帳號
					if ($scope.keepData.ori.profitAcnt !== $scope.keepData.new.profitAcnt) {
						$scope.fi000703Param.profitAcntFlag = "Y";
						$scope.fi000703Param.profitAcnt = $scope.keepData.new.profitAcnt;
					} else {
						$scope.fi000703Param.profitAcntFlag = "N";
						$scope.fi000703Param.profitAcnt = $scope.keepData.ori.profitAcnt;
					}
					//每次投資金額
					if ($scope.keepData.ori.purchAmnt !== $scope.keepData.new.purchAmnt) {
						$scope.fi000703Param.investAmntFlag = "Y";
						$scope.fi000703Param.investAmnt = (parseInt($scope.keepData.new.purchAmnt) * 100) + "";
					} else {
						$scope.fi000703Param.investAmntFlag = "N";
						$scope.fi000703Param.investAmnt = (parseInt($scope.keepData.ori.purchAmnt) * 100) + "";
					}

					if ($scope.fi000703Param.payDateFlag == "Y" ||
						$scope.fi000703Param.investAmntFlag == "Y" ||
						$scope.keepData.payTypeIsChanged == "Y" ||
						$scope.fi000703Param.payAcntStatus == "Y" ||
						$scope.fi000703Param.profitAcntFlag == "Y" ||
						$scope.fi000703Param.payFundFlag == "Y" ||
						$scope.fi000703Param.payEvaFlag == "Y") {
							var params = {
								'paymentData': $scope.funds
								, 'OutAC': $scope.OutAC
								, 'InAC': $scope.InAC
								, 'resfi000702Param': $scope.resfi000702Param
								, 'reqfi000702Param': $scope.reqfi000702Param
								, 'keepData' : $scope.keepData
								, 'fi000703Param' : $scope.fi000703Param
							};
							$state.go('fundChangeSipOtiCheck', params, {});
					} else {
						framework.alert('您未變更任何資料．．．', function () {
							return;
						});
					}
				}
				// $log.debug("=====>fi000703Param:" + JSON.stringify($scope.fi000703Param));
			}


			//扣款日期變更
			$scope.clickChgDebitDate = function () {
				//gen最新狀態
				genfi000703Param(""); //genfi000703Param最新狀態

				var params = {
					'paymentData': $scope.funds
					, 'OutAC': $scope.OutAC
					, 'InAC': $scope.InAC
					, 'resfi000702Param': $scope.resfi000702Param
					, 'reqfi000702Param': $scope.reqfi000702Param
					, 'keepData': $scope.keepData
					, 'securityType': {}
				};
				$state.go('fundSettingSipOtiSetPayDate', params, {});
			}


			//確定變更
			$scope.clickSubmit = function () {
				// $log.debug("$scope.resfi000702Param  :" + JSON.stringify($scope.resfi000702Param));
				genfi000703Param("GO", $scope.resfi000702Param); //genfi000703Param最新狀態
				$log.debug("= = =>req fi000703Param:" + JSON.stringify($scope.fi000703Param));

			}

			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				var params = {
					'paymentData': $scope.funds
					, 'keepData': $scope.reqfi000702Param
					, 'securityType': {}
				};
				$state.go('fundTermsSipOti', params, {});
			}

			$scope.clickDisAgree = function () {
				var params = {
					'paymentData': $scope.funds
					, 'keepData': $scope.reqfi000702Param
					, 'securityType': {}
				};
				$state.go('fundTermsSipOti', params, {});
			}
			//回上頁
			$scope.clickCancel = $scope.clickDisAgree;
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;


		});
	//=====[ END]=====//


});