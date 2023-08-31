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
	MainApp.register.controller('NoPushCtrl',
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

			
			function getFI000608() {
				var form = {};
				//alert(localStorage.getItem("custId"));
				form.custId = $scope.custId;
				form.CPKind = '1';
				
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
			

			$scope.clickSubmit = function () {	
				getFI000608();
			}

			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				//alert("aaa");
				$scope.custId = res.custId;
				
			});

			$scope.clickBack = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				framework.confirm('取消信託業務推介',function(ok){
					if(ok){framework.backToNative();};
					//return;
				});
				
			}

		});
	//=====[ END]=====//


});