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
	MainApp.register.controller('fundTermsStopPointCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
			, $css, $log
		) {
			$css.add('ui/newMainPage/css/main.css');
			$css.add('ui/newMainPage/css/fund.css');
			$scope.stopLossRegex = "^0*(0|100|\\d{1,2})$";
			$scope.takeProfitRegex = "^0*(0|999|\\d{1,2})$";
			
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.fundList = [];
			var canShowAlert = false;

			qrcodePayServices.getLoginInfo(function (res) {
				$scope.custId = res.custId;

				//停損獲利點設定查詢
				var form = {};
				form.custId = $scope.custId;
				qrCodePayTelegram.send('qrcodePay/fi000705', form, function (res, error) {
					if (res) {
						// alert(JSON.stringify(qrCodePayTelegram.toArray(res.details.detail)));
						if (res.respCode == '1') {
							chkReturnStatus(res.respCodeMsg);
							return;
						}

						$scope.trnsToken = res.trnsToken;
						//轉換欄位資料
						function mapping(fund) {
							fund.incomePoint = parseInt(fund.incomePoint) / 100;
							fund.profitPoint = parseInt(fund.profitPoint) / 100;

							if (fund.incomePoint != 0 || fund.profitPoint != 0) {
								fund.selected = true;
							} else {
								fund.selected = false;
							}

							// fund.webNotice = (fund.webNotice.toUpperCase() == 'Y');
							// fund.emailNotice = (fund.emailNotice.toUpperCase() == 'Y');
							fund.webNotice = (typeof fund.webNotice == "string" && fund.webNotice.toUpperCase() == 'Y');
							fund.emailNotice = (typeof fund.emailNotice == "string" && fund.emailNotice.toUpperCase() == 'Y');


							return fund;
						}

						$scope.fundList = qrCodePayTelegram.toArray(res.details.detail).map(mapping);
						if ($scope.fundList.length <= 0) {
							chkReturnStatus("");
							return;
						}
						console.log("$scope.fundList:" + JSON.stringify($scope.fundList));
					} else {
						framework.alert(error.respCodeMsg, function () {
							framework.backToNative();
						});
					}
				});
			});


			//檢查清單內是否已全部選取
			var checkAllSelected = function () {
				for (var i in $scope.fundList) {
					if (!$scope.fundList[i].selected) {
						return false;
					}
				}
				return true;
			}
			//點選新增基金
			$scope.clickAddFund = function (show) {
				if (checkAllSelected()) {
					framework.alert('無可新增標的');
				} else {
					$scope.onAddFund = show;
				}
			}
			//將選取的基金加入設定清單
			$scope.addFund = function (fund) {
				fund.selected = true;
				$scope.onAddFund = false;
			}

			//showAlert
			$scope.showAlert = function () {
				canShowAlert = true;
			}

			//停損點,獲利點 檢核
			$scope.onChange = function (str, regex) {
				var msg = "";
				// console.log(typeof str + " > " + str + " onChange " + new Date());

				if (str.length > 3) {
					msg = '停損/獲利點 長度有誤';
					checkVal(msg);
					return;
				}

				function checkVal(chkmsg) {
					if (chkmsg !== "") {
						if (canShowAlert) {
							framework.alert(chkmsg);
						}
					}
				}

				var patt = new RegExp(regex);
				if(!patt.test(str)){
					msg = '停損/獲利點 須為 整數';
					checkVal(msg);
					return;
				}

				// if (typeof str !== "number") {
				// 	msg = '停損/獲利點 須為 整數';
				// 	checkVal(msg);
				// 	return;
				// }

				// if (str.toString().indexOf(".") > -1) {
				// 	msg = '停損/獲利點 請輸入整數';
				// 	checkVal(msg);
				// 	return;
				// }


				return msg;
			}

			$scope.clickSave = function () {
				$scope.GoNext = true;
				canShowAlert = true;
				var form = {};
				form.custId = $scope.custId;
				form.trnsToken = $scope.trnsToken;
				form.details = {};
				form.details.detail = $scope.fundList.map(function (fund) {
					// if (fund.clean) {
					// 	fund.incomePoint = '0';
					// 	fund.profitPoint = '0';
					// }
					// fund.webNotice = fund.webNotice ? 'Y' : 'N';
					// fund.emailNotice = fund.emailNotice ? 'Y' : 'N';
					// delete fund.selected;
					// delete fund.clean;
					$log.debug('fund.incomePoint:',fund);
					
					var resFund = {};
					resFund.trustAcnt = fund.trustAcnt;
					resFund.transCode = fund.transCode;
					resFund.fundCode = fund.fundCode;
					resFund.capital = fund.capital;
					if (fund.clean) {
						resFund.incomePoint = '00000';
						resFund.profitPoint = '00000';
					} else {
						//click check
						if(fund.incomePoint==null){
							framework.alert('停損點需為0~100整數');
							$scope.GoNext = false;
							return;
						}
						if(fund.incomePoint.length==0){
							fund.incomePoint = 0;
						}
						var chkStatus = "";
						chkStatus = $scope.onChange(fund.incomePoint, $scope.stopLossRegex);
						if (chkStatus !== "") {
							$scope.GoNext = false;
							return;
						}
						if(fund.profitPoint==null){
							framework.alert('停利點需為0~999整數');
							$scope.GoNext = false;
							return;
						}
						if(fund.profitPoint.length==0){
							fund.profitPoint = 0;
						}
						chkStatus = "";
						chkStatus = $scope.onChange(fund.profitPoint, $scope.takeProfitRegex);
						if (chkStatus !== "") {
							$scope.GoNext = false;
							return;
						}

						//check ok
						function appendZeroStr(len) {
							var appendZeroStr = "";
							if (len == "1") {
								appendZeroStr = "00";
							} else if (len == "2") {
								appendZeroStr = "0";
							}
							return appendZeroStr;
						}
						var incomePointLength = fund.incomePoint.toString().length;
						resFund.incomePoint = appendZeroStr(incomePointLength) + fund.incomePoint + "00";
						var profitPointLength = fund.profitPoint.toString().length;
						resFund.profitPoint = appendZeroStr(profitPointLength) + fund.profitPoint + "00";
					}
					resFund.webNotice = fund.webNotice ? 'Y' : 'N';
					resFund.emailNotice = fund.emailNotice ? 'Y' : 'N';
					resFund.code = fund.code;
					resFund.investType = fund.investType;

					return resFund;
				});

				$log.debug(form);
				console.log("fi000706 req:" + JSON.stringify(form));
				if ($scope.GoNext === true) {
					qrCodePayTelegram.send('qrcodePay/fi000706', form, function (res, error) {
						console.log("fi000706 res:" + JSON.stringify(res));
						if (res) {
							$state.go('fundResultStopPoint', { result: res });
						} else {
							framework.alert(error.respCodeMsg, function () {
								framework.backToNative();
							});
						}
					});
				}
			}

			$scope.clickDisAgree = function () {
				framework.backToNative();
			}
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;

			
			$scope.checkInputKey = function(event){
				$log.debug('event',JSON.stringify(event));
				if ((event.which > 57 || event.which < 48) && (event.which != '8')) {
					alert('您點選的值不是 0~9 的數字喔'); 
					console.log(event.which + ' ' + event.key);
				};
			}

			$scope.changeInput = function(value ){
				$log.debug('value:',value);
			}
			$scope.checkRange = function( value, max){
				$log.debug('value:', value);
				if(value.length>3){
					value=value.slice(0,3);
				}
				if(value>max){
					value=max;
				};
			}

			function chkReturnStatus(msg) {
				var errorMsg = (msg != "") ? msg : "查無相關資料";
				framework.alert(errorMsg, function () {
					framework.backToNative();
					return;
				}, "");
			}

		});
	//=====[ END]=====//


});