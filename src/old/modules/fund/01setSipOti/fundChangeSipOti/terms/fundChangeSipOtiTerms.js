/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('fundChangeSipOtiTermsCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
		) {
			//==參數設定==//
			$css.add('ui/newMainPage/css/main.css');
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.numFmt = stringUtil.formatNum;

			$scope.defaultUnitType = "A";
			$scope.funds = [];
			$scope.fundsCountLT0 = false;
			//一頁的筆數大小
			$scope.pageSize = 100;
			//顯示第幾頁
			$scope.pageNumber = 0;
			//更多
			$scope.showMoreFlag = false;

			//庫存狀況
			$scope.fundStockType = [
				{
					Name: '有庫存',
					Type: "Y"
				},
				{
					Name: '無庫存',
					Type: "N"
				},
				{
					Name: '全部',
					Type: "A"
				}];
			$scope.fundStockTypeSelected = $scope.fundStockType[2].Type;

			//FI000701-定期(不)定額異動資料詢 
			function getFI000701(unitType) {
				var form = {};
				form.custId = $scope.custId;
				form.unitType = unitType; //Y有庫存 N無庫存 A全部
				form.investType = "2"; //1單筆 2定期(不)定額 3全部
				form.filterFlag = "Y"; //是否過濾中止扣款註記 Y:要 N:不要
				form.paginator = {};
				form.paginator.pageSize = $scope.pageSize;
				form.paginator.pageNumber = $scope.pageNumber;
				form.paginator.sortColName = "fundCode";
				form.paginator.sortDirection = "DESC";
				$log.debug("fi000701 req:" + JSON.stringify(form));
				qrCodePayTelegram.send('qrcodePay/fi000701', form, function (res, error) {
					$log.debug("fi000701 res:" + JSON.stringify(res));
					if (res) {
						if (res.respCode == '1') {
							chkReturnStatus(res.respCodeMsg);
							return;
						}

						//for 更多
						$scope.keepPageNumber = res.paginatedInfo.pageNumber;
						$scope.totalRowCount = res.paginatedInfo.totalRowCount;

						var countArray2 = 0;
						function mapping(fund) {
							if (countArray2 % 2 == 0) {
								fund.trClass = "invest";
							} else {
								fund.trClass = "invest2";
							}
							if (fund.debitStatus == "T" || fund.debitStatus == "S") {
								fund.debitStatusDesc = "暫停扣款";
							} else {
								fund.debitStatusDesc = "正常扣款";
							}
							var fi000702Param = {};
							fi000702Param.custId = $scope.custId;
							fi000702Param.transCode = fund.transCode;
							fi000702Param.trustAcnt = fund.trustAcnt;
							fi000702Param.fundName = fund.fundName;
							fi000702Param.fundCode = fund.fundCode;
							if (fund.iNCurrency === "NTD") {
								fi000702Param.iNCurrency = "TWD";
							} else {
								fi000702Param.iNCurrency = fund.iNCurrency;
							}
							if (fund.debitStatus === "S" || fund.debitStatus === "T") {
								fi000702Param.debitStatus = "S";
							} else {
								fi000702Param.debitStatus = "N";
							}
							fi000702Param.totalRowCount = $scope.totalRowCount;
							fi000702Param.keepPageNumber = $scope.keepPageNumber;
							fund.fi000702Param = fi000702Param;
							countArray2++;

							return fund;
						} 
						// if (typeof res.details.detail != "undefined") {
						// 	if ($scope.funds.length > 0) {
						// 		var moreFund = qrCodePayTelegram.toArray(res.details.detail).map(mapping);
						// 		var scopeFunds = $scope.funds;
						// 		var concatFunds = moreFund.concat(scopeFunds);
						// 		$scope.funds.length = 0;
						// 		$scope.funds = concatFunds;
						// 	}else {
						// 		$scope.funds = qrCodePayTelegram.toArray(res.details.detail).map(mapping);
						// 	}
						// }
						$scope.funds = $scope.funds.concat(qrCodePayTelegram.toArray(res.details.detail).map(mapping));

						$log.debug("$scope.funds.length:"+$scope.funds.length);
						// $log.debug(JSON.stringify($scope.funds));




						// var getFunds = res.details.detail;
						// $log.debug(JSON.stringify(getFunds));
						// // $scope.funds = [];
						// var countArray = 0;
						// var tmp_exit = "";
						// for (var key in getFunds) {
						// 	tmp_value = getFunds[key];
						// 	$log.debug(typeof tmp_value);

						// 	if (typeof tmp_value === 'object') {
						// 		if (getFunds[key].investType == "2") {
						// 			if (countArray % 2 == 0) {
						// 				getFunds[key].trClass = "invest";
						// 			} else {
						// 				getFunds[key].trClass = "invest2";
						// 			}
						// 			if (getFunds[key].debitStatus == "T" || getFunds[key].debitStatus == "S") {
						// 				getFunds[key].debitStatusDesc = "暫停扣款";
						// 			} else {
						// 				getFunds[key].debitStatusDesc = "正常扣款";
						// 			}
						// 			var fi000702Param = {};
						// 			fi000702Param.custId = $scope.custId;
						// 			fi000702Param.transCode = getFunds[key].transCode;
						// 			fi000702Param.trustAcnt = getFunds[key].trustAcnt;
						// 			fi000702Param.fundName = getFunds[key].fundName;
						// 			fi000702Param.fundCode = getFunds[key].fundCode;
						// 			if (getFunds[key].iNCurrency === "NTD") {
						// 				fi000702Param.iNCurrency = "TWD";
						// 			} else {
						// 				fi000702Param.iNCurrency = getFunds[key].iNCurrency;
						// 			}
						// 			if (getFunds[key].debitStatus === "S" || getFunds[key].debitStatus === "T") {
						// 				fi000702Param.debitStatus = "S";
						// 			} else {
						// 				fi000702Param.debitStatus = "N";
						// 			}
						// 			fi000702Param.totalRowCount = $scope.totalRowCount;
						// 			fi000702Param.keepPageNumber = $scope.keepPageNumber;
						// 			getFunds[key].fi000702Param = fi000702Param;
						// 			$scope.funds.push(getFunds[key]);
						// 			countArray++;
						// 		}
						// 	}else{
						// 		if (getFunds.investType == "2") {
						// 			getFunds.trClass = "invest2";
						// 			if (getFunds.debitStatus == "T" || getFunds.debitStatus == "S") {
						// 				getFunds.debitStatusDesc = "暫停扣款";
						// 			} else {
						// 				getFunds.debitStatusDesc = "正常扣款";
						// 			}
						// 			var fi000702Param = {};
						// 			fi000702Param.custId = $scope.custId;
						// 			fi000702Param.transCode = getFunds.transCode;
						// 			fi000702Param.trustAcnt = getFunds.trustAcnt;
						// 			fi000702Param.fundName = getFunds.fundName;
						// 			fi000702Param.fundCode = getFunds.fundCode;
						// 			if (getFunds.iNCurrency === "NTD") {
						// 				fi000702Param.iNCurrency = "TWD";
						// 			} else {
						// 				fi000702Param.iNCurrency = getFunds.iNCurrency;
						// 			}
						// 			if (getFunds.debitStatus === "S" || getFunds.debitStatus === "T") {
						// 				fi000702Param.debitStatus = "S";
						// 			} else {
						// 				fi000702Param.debitStatus = "N";
						// 			}
						// 			fi000702Param.totalRowCount = $scope.totalRowCount;
						// 			fi000702Param.keepPageNumber = $scope.keepPageNumber;
						// 			getFunds.fi000702Param = fi000702Param;
						// 			$scope.funds.push(getFunds);
						// 		}
						// 		tmp_exit = "Y";
						// 	}
						// 	if (tmp_exit == "Y") { break; }
						// }
						// $log.debug(JSON.stringify($scope.funds));
						if ($scope.funds.length <= 0) {
							$scope.fundsCountLT0 = true;
						}else{
							$scope.fundsCountLT0 = false;
						}

						var alreadyGetRecord = $scope.funds.length;
						$log.debug("record cnt2:" + $scope.totalRowCount + " --- " + alreadyGetRecord);
						if ($scope.totalRowCount <= alreadyGetRecord) {
							$scope.showMoreFlag = false;
						}else{
							$scope.showMoreFlag = true;
						}
					} else {
						framework.alert(error.respCodeMsg, function () {
							framework.backToNative();
						});
					}
				}, null, false);
			}

			//main
			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				$scope.custId = res.custId;
				if ($stateParams.paymentData instanceof Array) {
					// 次頁返回
					// $log.debug("$scope.funds:"+JSON.stringify($stateParams.paymentData));
					$log.debug("$scope.keepData:"+JSON.stringify($stateParams.keepData));
					$scope.funds.length = 0;
					$scope.funds = $stateParams.paymentData;
					$scope.keepData = $stateParams.keepData;
	
					$scope.fundStockTypeSelected = $scope.keepData.defaultUnitType;
					$scope.pageNumber = parseInt($scope.keepData.keepPageNumber);
					$scope.totalRowCount = parseInt($scope.keepData.totalRowCount);
	
					var alreadyGetRecord = $scope.funds.length;
					$log.debug("record cnt4:" + $scope.totalRowCount + " --- " + alreadyGetRecord);
					if ($scope.totalRowCount <= alreadyGetRecord) {
						$scope.showMoreFlag = false;
					}else{
						$scope.showMoreFlag = true;
					}
				} else {
					//FI000701(預設值"A")
					getFI000701("A");
				}
			});
			


			//選擇庫存狀況
			$scope.changeSelect = function (inp) {
				$scope.fundsCountLT0 = false;
				$scope.defaultUnitType = inp;
				$scope.funds.length = 0;
				$scope.pageNumber = 0;
				$scope.showMoreFlag = false;
				if (inp == "Y" || inp == "N" || inp == "A") {
				} else {
					inp = "Y";
				}
				getFI000701(inp);
			}

			$scope.selectDeleteTrans = function(index) {
				$scope.deleteTransIndex = index;
			}
			$scope.clickDelete = function() {
				if ($scope.deleteTransIndex == undefined) {
                    framework.alert('請選擇要刪除的交易');
                    return;
				}
				framework.confirm("您是否確定要刪除交易", function(ok){
					if(ok) {
						submitDelete();
					}
				});
			}
			function submitDelete() {
				var form = {};
				form.custId = $scope.custId;
				form.transCode = $scope.funds[$scope.deleteTransIndex].transCode;
                qrCodePayTelegram.send('qrcodePay/fi000711', form, function (res, error) {
					if (res) {
						$scope.funds.splice($scope.deleteTransIndex, 1);
					} else {
						framework.alert(error.respCodeMsg);
					}
                }, null, false);
			}

			//基金list編輯
			$scope.clickEdit = function (fi000702Param) {
				fi000702Param.defaultUnitType = $scope.defaultUnitType;
				var params = {
					'paymentData': $scope.funds
					, 'reqfi000702Param': fi000702Param
					, 'securityType': {}
				};
				// $log.debug(JSON.stringify(params));
				$state.go('fundEditSipOti', params, {});
			}

			//更多
			$scope.clickMore = function () {
				var alreadyGetRecord = $scope.funds.length;
				$log.debug("record cnt1:" + $scope.totalRowCount + " --- " + alreadyGetRecord);
				if ($scope.totalRowCount > alreadyGetRecord) {
					if ($scope.pageNumber == 0) {
						$scope.pageNumber = $scope.pageNumber + 2;
					}else{
						$scope.pageNumber = $scope.pageNumber + 1;
					}
					getFI000701($scope.defaultUnitType);
				}
			}

			function chkReturnStatus(msg) {
				var errorMsg = (msg != "") ? msg : "查無相關基金資料";
				framework.alert(errorMsg, function () {
					framework.backToNative();
					return;
				}, "");
			}

			$scope.clickDisAgree = function () {
				framework.backToNative();
			}
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;


		});
	//=====[ END]=====//


});