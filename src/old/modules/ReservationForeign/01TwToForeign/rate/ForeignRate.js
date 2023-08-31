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
	MainApp.register.controller('ForeignRateCtrl',
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
			$scope.form6 = $stateParams.form6;

			
			//FB000201-匯率查詢 
			function getFB000201() {
				var form = {};
				var rates = [];
				//$log.debug("fi000701 req:" + JSON.stringify(form));
				qrCodePayTelegram.send('qrcodePay/fb000201', form, function (res, error) {
					$log.debug("fb000201 res:" + JSON.stringify(res));
					if (res) {
						if (res.cardTime == null) {
							chkReturnStatus(res.respCodeMsg);
							return;
						}

						rates = res.details.detail;
						rates = qrcodeTelegramServices.modifyResDetailObj(res.details.detail);
						//alert("111"+JSON.stringify(rates));
						$scope.ratess = [];
						var a=1;
						for(var key in rates){
						//alert(rates[key].type);
						if(rates[key].type == 0){
							if(JSON.stringify(rates[key].promptEx) == "{}") {rates[key].promptEx = "...";}
							if(JSON.stringify(rates[key].cashEx) == "{}" ) {rates[key].cashEx ="...";}
							$scope.ratess.push(rates[key]);}
						if(rates[key].type == 1){
							//alert(JSON.stringify(rates[key].promptEx));
							//alert(JSON.stringify(rates[key].promptEx) == "{}");
							if(JSON.stringify(rates[key].promptEx) == "{}") {rates[key].promptEx = "...";}
							if(JSON.stringify(rates[key].cashEx) == "{}" ) {rates[key].cashEx ="...";}
							$scope.ratess[key-a].tenD=rates[key].promptEx;
							$scope.ratess[key-a].thirtyD=rates[key].cashEx;

							a=a+1;
							//alert(JSON.stringify(rates[key].value));
							
						}
						//$scope.ratess.push(rates[key]);
						
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
				//alert("aaa");
				$scope.custId = res.custId;
				getFB000201();
				
			});
			


			

			

			function chkReturnStatus(msg) {
				var errorMsg = (msg != "") ? msg : "查無相關資料";
				framework.alert(errorMsg, function () {
					framework.backToNative();
					return;
				}, "");
			}

		$scope.clickDisAgree = function () {
			if($scope.form6.aa == '1'){
				
					//framework.backToNative();
					var params = {
					};
					$state.go('TwToForeignEdit', params, {});
				
			}else{
				var params = {
				};
				$state.go('ForeignToTwEdit', params, {});
			}
		}
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;


		});
	//=====[ END]=====//


});