/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
	, 'modules/service/qrcodePay/securityServices'
	, 'modules/directive/security/securitySelectorDirective.js'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('ForeignToTwCheckCtrl',
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
			//debugger;
			
			//FB000201-匯率查詢 
			function getF5000105() {
				var form = {};
				form.custId = $scope.custId;
				form.trnsfrDate =$scope.form9.date;
				var ymd = form.trnsfrDate.split('-');
				form.trnsfrDate=((ymd[0]-1911)+ymd[1]+ymd[2]);
				form.trnsfrOutAccnt =$scope.form9.OutacctNo;
				form.trnsfrOutCurr = $scope.form9.coin;
				form.trnsfrInAccnt =$scope.form9.InacctNo;
				form.trnsInSetType ="2";
				form.trnsfrInCurr ="TWD";
				form.trnsfrAmount =$scope.form9.trnsAmount;
				form.trnsfrCurr =$scope.form9.tcoin;
				form.subType= $scope.form9.config.substring(0,4);
				form.subTypeDscp =$scope.form9.config.substring(4);
				form.note = $scope.form9.status;
				form.trnsToken =$scope.form9.trnsToken;
				console.log(JSON.stringify(form));
				//alert(JSON.stringify(form));
				

				






				
				//$log.debug("fi000701 req:" + JSON.stringify(form));
				//qrCodePayTelegram.send('qrcodePay/f5000105', form, function (res, error) {
				securityServices.send('qrcodePay/f5000105', form, $scope.defaultSecurityType, function(res, error){
				$log.debug("f5000105 res:" + JSON.stringify(res));
					if (res) {
						// if (res.cardTime == null) {
						// 	chkReturnStatus(res.respCodeMsg);
						// 	return;
						// }
						var params = {
							form9:$scope.form,
							result:res
							// result:fq000201res
						};
						$state.go('ForeignToTwResult',params,{});
						
						
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

				//檢查SSL密碼填入
				//alert($scope.defaultSecurityType.key + $scope.sslkey +"111" );
				if($scope.defaultSecurityType.key=='SSL' && $scope.sslkey == ""){framework.alert("請輸入SSL密碼");}
				getF5000105();

				
				

			}


		});




		
	//=====[ END]=====//


});