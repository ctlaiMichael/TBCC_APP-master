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
	MainApp.register.controller('fundChangeSipOtiCheckCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
			
		) {
			//==參數設定==//
			$scope.resfi000702Param = $stateParams.resfi000702Param;
			$scope.reqfi000702Param = $stateParams.reqfi000702Param;
			$scope.funds = $stateParams.paymentData;
			$scope.OutAC = $stateParams.OutAC;
			$scope.InAC = $stateParams.InAC;
            $scope.keepData = $stateParams.keepData;
            $scope.fi000703Param = $stateParams.fi000703Param;
			
			$css.add('ui/tcbbOldStyle/css/main.css');
			$css.add('ui/tcbbOldStyle/css/modify.css');
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {}

			$scope.aaa= true;
			$scope.bbb= true;			
			
			$scope.clickSubmit = function () {	
				if($scope.aaa == false && $scope.bbb == false){
					var params = {
						'paymentData': $scope.funds
						, 'OutAC': $scope.OutAC
						, 'InAC': $scope.InAC
						, 'resfi000702Param': $scope.resfi000702Param
						, 'reqfi000702Param': $scope.reqfi000702Param
						, 'keepData' : $scope.keepData
						, 'fi000703Param' : $scope.fi000703Param
					};
					$state.go('fundChangeSipOtiDetail', params, {});
			    }
				else{
					framework.alert("請確認取得與瞭解基金相關資訊。");
				}

			}


			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				//alert("aaa");
				$scope.custId = res.custId;
				
			});

			$scope.changeCategory1 = function(){
				// other stuff
				if($scope.aaa==true ){$scope.aaa=false;}
				else if($scope.aaa==false){$scope.aaa=true }
			  }

			$scope.changeCategory2 = function(){
				// other stuff
				if($scope.bbb==true ){$scope.bbb=false;}
				else if($scope.bbb==false){$scope.bbb=true }
			}

			$scope.clickBack = function(){
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
			$scope.clickCancel = $scope.clickBack
			//clickCancel
		});
	//=====[ END]=====//


});