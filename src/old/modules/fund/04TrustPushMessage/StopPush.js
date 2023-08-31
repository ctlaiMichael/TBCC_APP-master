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
	MainApp.register.controller('StopPushCtrl',
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
			//$scope.form6 = $stateParams.form6;

			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				
			}

			var Today=new Date();

			$scope.year2=Today.getFullYear();
			$scope.month2=Today.getMonth()+1;
			$scope.day2=Today.getDate();

			function getFI000608() {
				var form = {};
				//alert(localStorage.getItem("custId"));
				form.custId = $scope.custId;
				form.CPKind = '3';
				
				qrCodePayTelegram.send('qrcodePay/fi000608', form, function (res, error) {
					$log.debug("fi000608 res:" + JSON.stringify(res));
					
					if (res) {
						$state.go('fundAgreePush',{});
					} else {
						framework.alert(error.respCodeMsg, function(){
							qrcodePayServices.closeActivity();});
					 }
				}, null, false);
				//framework.mainPage();
				//framework.backToNative();
			}

			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				//alert("aaa");
				$scope.custId = res.custId;
				
			});

			$scope.clickSubmit = function () {	
				getFI000608();
			}

			

			$scope.clickBack = function () {
				if(ok){framework.mainPage();;
				
			}

		}

	});	
	//=====[ END]=====//


});