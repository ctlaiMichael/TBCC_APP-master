/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
	, 'modules/directive/security/securitySelectorDirective.js'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('fixBuyCheckCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
			
		) {
			//==參數設定==//
			$css.add('ui/newMainPage/css/main.css');
			$css.add('ui/newMainPage/css/fund.css');
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			//$scope.form6 = $stateParams.form6;

			
			$scope.result = $stateParams.result;
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {}

			// $scope.clickSetDays = function () {
				
			// 	$state.go('fundSettingSipOtiSetPayDate', {});

			// }

			$scope.aaa= true;
			$scope.bbb= true;			
			
			$scope.clickSubmit = function () {	
				if($scope.aaa == false && $scope.bbb == false){
				getFi000709();}
				else{
					framework.alert("請確認取得與瞭解基金相關資訊。");
				}

			}


			function getFi000709() {
				var form3 = {};
				form3 = $scope.result;
				//alert(JSON.stringify(form3));
				qrCodePayTelegram.send('qrcodePay/fi000709', form3, function (res, error) {
					$log.debug("f1000709 res:" + JSON.stringify(res));
					
					if (res) {
						var params = {
							result : $scope.result,
							result1 : res
						};
	
						$state.go('fixBuyCheck2',params,{location: 'replace'});
					}

					else{
						framework.alert(error.respCodeMsg, function () {
							//framework.backToNative();
						})
						

					}


				}, null, false)

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
				// other stuff
				
				$state.go('fixBuy', {});
					
			  }

			
			$scope.clickCancel = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				
				$state.go('fixBuy', {});
				
			}
			//clickCancel
		});
	//=====[ END]=====//


});