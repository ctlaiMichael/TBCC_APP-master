/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('fundChangeSipOtiSetSettingPayDateCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil
			, qrcodePayServices
			, qrCodePayTelegram
		) {
			//==參數設定==//
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.numFmt = stringUtil.formatNum;
			$scope.resfi000702Param = $stateParams.resfi000702Param;
			$scope.reqfi000702Param = $stateParams.reqfi000702Param;
			$scope.funds = $stateParams.paymentData;
			$scope.OutAC = $stateParams.OutAC;
			$scope.InAC = $stateParams.InAC;
			$scope.keepData = $stateParams.keepData;
			$scope.defaultSecurityType = $stateParams.securityType;
			$scope.Message = "";

			//android實體鍵盤返回鍵lock
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				$state.go('fundSettingSipOtiSetPayDate', {}, { location: 'replace' });
			}

			//日期button
			$scope.fundDateMenu = [];
			function genDateMenu() {
				$scope.fundDateMenu.length = 0;
				for (var i = 1; i <= 31; i++) {
					var tempFundDateMenu = {};
					tempFundDateMenu.dt = i;
					if ($scope.fundDateSelected.indexOf(i) > -1) {
						tempFundDateMenu.dtClass = "date_color";
					} else {
						tempFundDateMenu.dtClass = "";
					}
					$scope.fundDateMenu.push(tempFundDateMenu);
				}
				// console.log(JSON.stringify($scope.fundDateMenu));
			}

			//更新筆數
			$scope.fundDateSelected = $scope.keepData.new.Date.split(",").map(function(item) {
				return parseInt(item);
			});
			$scope.dtSelectCount = $scope.fundDateSelected.length;
			// console.log("$scope.fundDateSelected.length:"+$scope.fundDateSelected.length);
			// console.log(JSON.stringify($scope.fundDateSelected));
			//挑選日期
			$scope.clickMenu = function (dt) {
				$scope.Message = "";

				var pos = $scope.fundDateSelected.indexOf(dt);
				if (pos == -1) { //不存在於[]
					$scope.fundDateSelected.push(dt); //add
					$scope.fundDateMenu[dt - 1].dtClass = "date_color"; //change color
				}
				if (pos > -1) { //存在於[]
					if ($scope.fundDateSelected.length == 1) {
						$scope.Message = "至少需設定一筆日期!!";
						return;
					}
					$scope.fundDateSelected.splice(pos, 1); //del
					$scope.fundDateMenu[dt - 1].dtClass = ""; //remove color
				}
				//[]重新排序
				$scope.fundDateSelected.sort(function (a, b) { return a - b; });
				//更新筆數 
				$scope.dtSelectCount = $scope.fundDateSelected.length;
				//產生日期[]
				genDateMenu();
				// console.log(JSON.stringify($scope.fundDateSelected));
			}

			//產生日期[]
			genDateMenu();


			//設定完成
			$scope.clickSubmit = function () {
				$scope.keepData.new.Date = $scope.fundDateSelected.toString();
				// console.log("clickSubmit:"+$scope.fundDateSelected.toString());
				// console.log("======$scope.keepData:" + JSON.stringify($scope.keepData));

				var params = {
					'paymentData': $scope.funds
					, 'OutAC': $scope.OutAC
					, 'InAC': $scope.InAC
					, 'resfi000702Param': $scope.resfi000702Param
					, 'reqfi000702Param': $scope.reqfi000702Param
					, 'keepData': $scope.keepData
					, 'securityType': $scope.defaultSecurityType
				};
				$state.go('fundEditSipOti', params, {});
			}


			$scope.clickDisAgree = function () {
				var params = {
					'paymentData': $scope.funds
					, 'OutAC': $scope.OutAC
					, 'InAC': $scope.InAC
					, 'resfi000702Param': $scope.resfi000702Param
					, 'reqfi000702Param': $scope.reqfi000702Param
					, 'keepData': $scope.keepData
					, 'securityType': $scope.defaultSecurityType
				};
				$state.go('fundEditSipOti', params, {});
			}
			//取消
			$scope.clickCancel = $scope.clickDisAgree;
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;



		});
	//=====[END]=====//
});
