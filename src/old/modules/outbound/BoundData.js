/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
	, ,'modules/service/qrcodePay/securityServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('BoundDataCtrl',
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
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				
			}
			$scope.result = $stateParams.result;

			// plugin.tcbb.getF1000101Data(function (json) {
			// 	alert("F1000101Data"+JSON.stringify(json));
			// 	alert("F1000101Data-PhoneNo"+JSON.stringify(json.value.PhoneNo));
			// 	$scope.result.phoneMobile=json.value.PhoneNo;
				
			// }, function (err) {
				
			// });
			
			function getFQ000421() {
				var form = {};
				if($scope.result.cixP33Flg == "Y"){form.P33z = '';}
				else{form.P33z ='Y';}
				if($scope.result.cixp3Cid == "Y"){form.authz = '';}
				else{form.authz = 'Y';}
				form.custId = $scope.custId;
				//alert(form.custId);
				form.p33phone = $scope.result.phoneMobile;
				form.trnsToken = $scope.result.trnsToken;
				$scope.defaultSecurityType = {key: "OTP",name: "OTP"};
				securityServices.send('qrcodePay/fq000421', form, $scope.defaultSecurityType, function(res, error){
					if(res){
						var params = {
							result:res
						};
						$state.go('outboundResult',params,{location: 'replace'});
					}else{
						framework.alert(error.respCodeMsg, function(){
							qrcodePayServices.closeActivity();
	
						});
					}
				});
			}
			

			$scope.clickSubmit = function () {	
				getFQ000421();
			}

			qrcodePayServices.getLoginInfo(function (res) {
				
				$scope.custId = res.custId;
				
			});

			$scope.clickBack = function () {
				framework.confirm('取消身分認證程序',function(ok){
					if(ok){framework.backToNative();};
				});
				
			}

		});
	//=====[ END]=====//


});