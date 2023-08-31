/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/directive/security/securitySelectorDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
	, 'modules/service/qrcodePay/securityServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('ForeignInsuranceCheckCtrl',
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
			$scope.noSSL = false;
			$scope.noOTP = true;
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.form9 = $stateParams.form9;
			// $scope.sslkey = null;
			//debugger;
			$scope.defaultSecurityType = $stateParams.securityType;
			
			function getF5000202() {
				var form = {};
				form = $scope.form9;
				
				console.log(JSON.stringify(form));
				//alert(JSON.stringify(form));
				
				//$log.debug("fi000701 req:" + JSON.stringify(form));
				//qrCodePayTelegram.send('qrcodePay/f5000105', form, function (res, error) {
				securityServices.send('qrcodePay/f5000202', form, $scope.defaultSecurityType, function(res, error){
				$log.debug("f5000202 res:" + JSON.stringify(res));
					if (res) {
						// if (res.cardTime == null) {
						// 	chkReturnStatus(res.respCodeMsg);
						// 	return;
						// }
						var params = {
							
							result:res
							// result:fq000201res
						};
						$state.go('ForeignInsuranceResult',params,{location: 'replace'});
						
						
					} else {
						framework.alert(error.respCodeMsg, function () {
							framework.backToNative();
						});
					 }
				
			}, $scope.sslkey);
			}

			//main
			qrcodePayServices.getLoginInfo(function (res) {
				
				//保留 custId
				//alert("aaa");
				$scope.custId = res.custId;
				
				//getFB000201();
				
			});
			


			

			

			// function chkReturnStatus(msg) {
			// 	var errorMsg = (msg != "") ? msg : "查無相關資料";
			// 	framework.alert(errorMsg, function () {
			// 		framework.backToNative();
			// 		return;
			// 	}, "");
			// }

			$scope.clickDisAgree = function () {
				framework.confirm("您是否確定要取消交易", function(ok){
					if(ok){framework.backToNative();}
				})
				//var params = {
				//};
				//qrcodePayServices.closeActivity();
				//$state.go('mainPageMenu',params,{}); //返回首頁
				
			}
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;


			$scope.clickSubmit = function () {
				// alert("999"+$scope.defaultSecurityType);
				// alert("999"+JSON.stringify($scope.defaultSecurityType));
				//檢查SSL密碼填入
				//alert($scope.defaultSecurityType.key + $scope.sslkey +"111" );
				// if($scope.defaultSecurityType.key=='SSL' && $scope.sslkey == ""){framework.alert("請輸入SSL密碼");}
				getF5000202();

				
				

			}


		});




		
	//=====[ END]=====//


});