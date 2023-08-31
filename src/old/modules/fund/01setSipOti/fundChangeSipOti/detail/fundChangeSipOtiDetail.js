define([
    'app'
	, 'modules/directive/security/securitySelectorDirective.js'
    , 'modules/service/qrcodePay/qrcodePayServices'
    , 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/service/qrcodePay/securityServices'
], function (MainApp) {

    //=====[ START]=====//
    MainApp.register.controller('fundChangeSipOtiDetailCtrl',
        function (
            $scope, $stateParams, $state, $element, $compile, i18n
            , $rootScope, $timeout, stringUtil, framework, sysCtrl
            , qrcodePayServices
            , qrCodePayTelegram
			, securityServices
        ) {
			$scope.noSSL = false;
			$scope.noOTP = true;
			$scope.resfi000702Param = $stateParams.resfi000702Param;
			$scope.reqfi000702Param = $stateParams.reqfi000702Param;
			$scope.funds = $stateParams.paymentData;
			$scope.OutAC = $stateParams.OutAC;
			$scope.InAC = $stateParams.InAC;
            $scope.keepData = $stateParams.keepData;
            $scope.fi000703Param = $stateParams.fi000703Param;
            $scope.numFmt = stringUtil.formatNum;
            $scope.noSSL = false;
			$scope.noOTP = true;

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
            function setPayTypeFlag(status) {
                if (status == "") { status = "N"; }
                $scope.DebitStatusFlagStr = "正常";
                for (var i in $scope.payTypeFlagMenu) {
                    if ($scope.payTypeFlagMenu[i].DebitStatusFlag == status) {
                        if (status != "N") {
                            $scope.DebitStatusFlagStr = $scope.payTypeFlagMenu[i].DebitStatus;
                        }
                    }
                }
            }
            function setDebitDate() {
                if ($scope.keepData.debitDateType === "month") {
                    $scope.debitDateTitle = "每月";
                    $scope.debitDate = $scope.fi000703Param.payDate31;
                } else {
                    $scope.debitDateTitle = "每週";
                    $scope.debitDate = $scope.fi000703Param.payDate5W;
                }
            }

            $scope.clickSubmit = function() {
                if ($scope.fi000703Param.payFundFlag === "Y" && $scope.agree !== "YES") {
                    framework.alert('請同意重要內容簽署');
                    return;
                }
                securityServices.send('qrcodePay/fi000703', $scope.fi000703Param, $scope.defaultSecurityType, function (res, error) {
                    if (res) {
                        initDeclineAndGain(res);
                        var params = {
                            'response': res
                            , 'securityType': $scope.defaultSecurityType
                            , 'keepData': $scope.keepData
                        };
                        $state.go('fundResultSipOti', params, {});
                    } else {
                        framework.alert(error.respCodeMsg, function () {
                            framework.backToNative();
                        });
                    }
                }, $scope.sslkey);
            }

            function initDeclineAndGain(res) {
				res.decline1 = (typeof res.decline1).toString() === "object" ? 0 : Number(res.decline1);
				res.decline2 = (typeof res.decline2).toString() === "object" ? 0 : Number(res.decline2);
				res.decline3 = (typeof res.decline3).toString() === "object" ? 0 : Number(res.decline3);
				res.decline4 = (typeof res.decline4).toString() === "object" ? 0 : Number(res.decline4);
				res.decline5 = (typeof res.decline5).toString() === "object" ? 0 : Number(res.decline5);
				res.gain1 = (typeof res.gain1).toString() === "object" ? 0 : Number(res.gain1);
				res.gain2 = (typeof res.gain2).toString() === "object" ? 0 : Number(res.gain2);
				res.gain3 = (typeof res.gain3).toString() === "object" ? 0 : Number(res.gain3);
				res.gain4 = (typeof res.gain4).toString() === "object" ? 0 : Number(res.gain4);
                res.gain5 = (typeof res.gain5).toString() === "object" ? 0 : Number(res.gain5);
            }

			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				var params = {
					'paymentData': $scope.funds
					, 'OutAC': $scope.OutAC
					, 'InAC': $scope.InAC
					, 'resfi000702Param': $scope.resfi000702Param
					, 'reqfi000702Param': $scope.reqfi000702Param
					, 'keepData': $scope.keepData
				};
				$state.go('fundEditSipOti', params, {});
			}
            $scope.clickCancel = onBackKeyDown;

            $scope.todayDt = TWYearFormat();
            //每次投資金額
            $scope.investAmnt = parseInt($scope.fi000703Param.investAmnt / 100);
            //扣款狀態
            setPayTypeFlag($scope.fi000703Param.payTypeFlag);
            setDebitDate();

        });
    //=====[ END]=====//


});