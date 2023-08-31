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
	MainApp.register.controller('PushMessageCtrl',
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
			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				
			}

			function getFI000607() {
				var form = {};
				//alert(localStorage.getItem("custId"));
				form.custId = $scope.custId;
				
				qrCodePayTelegram.send('qrcodePay/fi000607', form, function (res, error) {
					$log.debug("fi000607 res:" + JSON.stringify(res));
					
					if (res) {
						
						if(res.act=='2'){
							localStorage.setItem("pushmessage",'2')
							var params = {
								result:res
							};
							$state.go('fundHasPush',params,{location: 'replace'});
						};
						if(res.act=='1'){
							localStorage.setItem("pushmessage",'1')
							$state.go('fundNoPush',{});
						};
						if(res.act=='3'){
							var params = {
								result:res
							};
							$state.go('fundErrorPush',params,{location: 'replace'});
						};
						
					} else {
						
						framework.alert(error.respCodeMsg, function(){
							qrcodePayServices.closeActivity();});
					 }
				}, null, false);
				//framework.mainPage();
				//framework.backToNative();
			}
			

			$scope.clickSubmit = function () {	
				getFI000607();
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