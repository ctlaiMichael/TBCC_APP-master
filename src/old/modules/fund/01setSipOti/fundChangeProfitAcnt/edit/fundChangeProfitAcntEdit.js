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
	MainApp.register.controller('fundChangeProfitAcntEditCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $sce, $log
			, qrcodePayServices
			, qrcodeTelegramServices
			, qrCodePayTelegram
			, securityServices
		) {
			//==參數設定==//
			$scope.noSSL = false;
			$scope.noOTP = true;
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.numFmt = stringUtil.formatNum;
			$scope.funds = $stateParams.paymentData;
			$scope.OutAC = $stateParams.OutAC;
			$scope.InAC = $stateParams.InAC;
			$scope.reqfi000702Param = $stateParams.reqfi000702Param;
			$scope.tempName = $scope.reqfi000702Param.transCode + '<br>' + $scope.reqfi000702Param.fundName;
			$scope.fundTarget = $sce.trustAsHtml($scope.tempName);

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

			//main main main
			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				$scope.custId = res.custId;
				
				getFI000702($scope.reqfi000702Param);
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
					$scope.YYYMMDD =  $scope.year + $scope.month + $scope.date;
					return $scope.year + '/' + $scope.month + '/' + $scope.date;
				}
			}

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
				if (str.indexOf(",") > -1){
					str = str.split(",").join("日,");
					str = str + "日";
				}else{
					str = str + "日";
				}
				return str;
			}

			//扣款狀態對應
			function getPayTypeFlag(status) {
				for (var i in $scope.payTypeFlagMenu) {
					if ( ($scope.payTypeFlagMenu[i].DebitStatusFlag == status) && (status != "N") ) {
						return $scope.payTypeFlagMenu[i].DebitStatus;
					}
				}
				return "正常";
			}


			//F5000101-台幣活存約定轉出及轉入帳號查詢
			function getF5000101() {
				var temp_INCurrency = "TWD"
				var currencyType = "B"; //台幣
				if ($scope.resfi000702Param.INCurrency == "NTD") {
					temp_INCurrency = "TWD"
					currencyType = "B"; //台幣
				}else{
					temp_INCurrency = $scope.resfi000702Param.INCurrency;
					currencyType = "1"; //外幣
				}
				var form = {};
				form.custId = $scope.custId; //$scope.resfi000702Param.custId;
				form.type = currencyType;

				qrCodePayTelegram.send('qrcodePay/f5000101', form, function (res, error) {
					// $log.debug("f5000101:"+JSON.stringify(res));
					if (res) {
						//$scope.trnsToken = res.trnsToken; //先用702明細的token

						var actsOut = qrCodePayTelegram.toArray(res.trnsOutAccts.trnsOutAcct);
						$scope.InAC = [];
						for (key in actsOut) {
							if (temp_INCurrency == "TWD"){
								if (actsOut[key].trnsOutCurr.indexOf(temp_INCurrency) > -1){
									var tempIn = {};
									tempIn.acctNo = actsOut[key].trnsfrOutAccnt;
									$scope.InAC.push(tempIn);
								}
							}else {
								if (actsOut[key].trnsOutCurr.indexOf("TWD") == -1){
									var tempIn = {};
									tempIn.acctNo = actsOut[key].trnsfrOutAccnt;
									$scope.InAC.push(tempIn);
								}
							}
						}
						// $log.debug(JSON.stringify($scope.InAC));
						// $log.debug("in:" + $scope.InAC.length);

						//現金收益帳號
						var orgCreditAcct = $scope.resfi000702Param.profitAcnt; //現金收益帳號對應
						$scope.orgCreditAcct = $scope.resfi000702Param.profitAcnt;
						$scope.SelectCreditAcctSelected = orgCreditAcct;
						//for fi000704 電文	
						genfi000704param($scope.resfi000702Param);
						//for 結果頁 欄位顯示	
						gendisplayParam($scope.resfi000702Param);
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
						//扣款日期
						var temp_DebitDate = [];
						if ( res.payDate1 !== "00" && res.payDate1 !== "") {
							temp_DebitDate.push(parseInt(res.payDate1));
						}
						if ( res.payDate2 !== "00" && res.payDate2 !== "") {
							temp_DebitDate.push(parseInt(res.payDate2));
						}
						if ( res.payDate3 !== "00" && res.payDate3 !== "") {
							temp_DebitDate.push(parseInt(res.payDate3));
						}
						if ( res.payDate4 !== "00" && res.payDate4 !== "") {
							temp_DebitDate.push(parseInt(res.payDate4));
						}
						if ( res.payDate5 !== "00" && res.payDate5 !== "") {
							temp_DebitDate.push(parseInt(res.payDate5));
						}
						$scope.DebitDateStr = removeLenZero(temp_DebitDate).toString(); //日期陣列元素整理(value無值則移除)
						//F5000101-台幣活存約定轉出帳號查詢
						getF5000101(); //F5000101-台幣活存約定轉出帳號查詢
					} else {
						framework.alert(error.respCodeMsg, function () {
							framework.backToNative();
						});
					}
				}, null, false);
			}

			//for 確定變更 電文
			function genfi000704param(fi000702Param) {
				// $log.debug(">>>>>>>>>>>>fi000702Param:" + JSON.stringify(fi000702Param));
				$scope.fi000704Param = {};
				$scope.fi000704Param.custId = $scope.custId; //fi000702Param.custId;
				$scope.fi000704Param.trustAcnt = fi000702Param.trustAcnt;
				$scope.fi000704Param.transCode = fi000702Param.transCode;
				$scope.fi000704Param.fundCode = fi000702Param.fundCode;
				$scope.fi000704Param.INCurrency = fi000702Param.INCurrency;
				$scope.fi000704Param.amount = fi000702Param.purchAmnt;
				$scope.fi000704Param.unit = 1;
				var orgCreditAcct = fi000702Param.profitAcnt; //現金收益帳號對應
				$scope.fi000704Param.oriProfitAcnt = orgCreditAcct;
				$scope.fi000704Param.profitAcnt = orgCreditAcct;
				$scope.fi000704Param.trnsToken = fi000702Param.trnsToken;
			}

			//for 確定變更 欄位顯示
			function gendisplayParam(fi000702Param) {
				// $log.debug(">>>>>>>>>>>>fi000702Param:" + JSON.stringify(fi000702Param));
				$scope.displayParam = {};
				$scope.displayParam.fromFlag = "2";
				$scope.displayParam.fundName = fi000702Param.fundCode + $scope.reqfi000702Param.fundName;
				$scope.displayParam.transCode = fi000702Param.transCode;
				$scope.displayParam.applyDT = TWYearFormat(); //當日
				// $scope.displayParam.iNCurrency = fi000702Param.INCurrency;
				// $scope.displayParam.amount = parseInt(fi000702Param.purchAmnt);
				// $scope.displayParam.debitDT = addDayWroding($scope.DebitDateStr); //add "日"
				// $scope.displayParam.payTypeFlag = getPayTypeFlag($scope.reqfi000702Param.debitStatus); //扣款狀態中文
				$scope.displayParam.payAcnt = $scope.fi000704Param.oriProfitAcnt;
				$scope.displayParam.profitAcnt = fi000702Param.profitAcnt;
				// $log.debug(">>>>>>>>>>>>$scope.displayParam:" + JSON.stringify($scope.displayParam));
			}


			//確定變更
			$scope.clickSubmit = function () {
				//重整狀態
				$scope.fi000704Param.profitAcnt = $scope.SelectCreditAcctSelected; //重整fi000704Param最新狀態
				$scope.displayParam.profitAcnt = $scope.SelectCreditAcctSelected;  //重整displayParam最新狀態
				$log.debug("= = =>req fi000704Param:" + JSON.stringify($scope.fi000704Param));

				if ($scope.fi000704Param.profitAcnt !== $scope.fi000704Param.oriProfitAcnt) {
					securityServices.send('qrcodePay/fi000704', $scope.fi000704Param, $scope.defaultSecurityType, function (res, error) {
						$log.debug("- - ->res fi000704Param:" + JSON.stringify(res));
						if (res) {
							var params = {
								  'displayParam': $scope.displayParam
								, 'response': res
								, 'securityType': {}
							};
							$state.go('fundResultProfitAcnt', params, {});
						} else {
							framework.alert(error.respCodeMsg, function () {
								framework.backToNative();
							});
						}
					}, $scope.sslkey);
				}else {
					framework.alert('您未變更任何資料．．．',function(){
						return;
					});
				}
			}

			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				var params = {
					'paymentData': $scope.funds
					, 'keepData' : $scope.reqfi000702Param
					, 'securityType': {}
				};
				$state.go('fundTermsProfitAcnt', params, {});
			}
			
			$scope.clickDisAgree = function () {
				var params = {
					'paymentData': $scope.funds
					, 'keepData' : $scope.reqfi000702Param
					, 'securityType': {}
				};
				$state.go('fundTermsProfitAcnt', params, {});
			}
			//回上頁
			$scope.clickCancel = $scope.clickDisAgree;
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;

		});
	//=====[ END]=====//


});