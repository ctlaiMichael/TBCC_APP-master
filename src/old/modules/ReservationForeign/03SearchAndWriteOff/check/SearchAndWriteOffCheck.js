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
	, 
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('SearchAndWriteOffCheckCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log,$sce
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
			//alert($scope.form9.note);
			if($scope.form9.note == '[object Object]'){$scope.form9.note = "成交匯率"}
			//debugger;

			// $scope.sslkey= "";
			
			// if($scope.form9.defaultSecurityType == "SSL" && $scope.sslkey != ""){
			// 	$scope.sslkey = $scope.sslkey;
			// }
			
			//FB000201-匯率查詢 
			function getF5000107() {
				var form = {};
				form.custId = $scope.custId;
				form.trnsfrDate= $scope.form9.trnsfrDate;
				form.orderNo= $scope.form9.orderNo;
				form.trnsToken= $scope.form9.trnsToken;
				form.trnsfrOutAccnt= $scope.form9.trnsfrOutAccnt;
				form.trnsfrInAccnt= $scope.form9.trnsfrInAccnt;
				form.trnsfrCurr= $scope.form9.trnsfrCurr;
				form.subType= $scope.form9.subType;
				form.note= $scope.form9.note;
				var yy=$scope.form9.trnsfrDate;
				//form = form.Replace("\"","");

				//alert(JSON.stringify(form));
				//alert($scope.custId);
				//alert(yy);
				//$log.debug("fi000701 req:" + JSON.stringify(form));
				securityServices.send('qrcodePay/f5000107', form, $scope.defaultSecurityType, function(res, error){
				//qrCodePayTelegram.send('qrcodePay/f5000107', form, $scope.defaultSecurityType,function (res, error) {
					$log.debug("f5000107 res:" + JSON.stringify(res));
					if (res) {
						if (res.trnsfrDate == null) {
							chkReturnStatus(res.respCodeMsg);
							return;
						}

						var params = {
							form9:$scope.form9,
							result:res
							// result:fq000201res
						};
			           $state.go('SearchAndWriteOffResult',params,{location: 'replace'});
						
						
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
				//getF5000107();
				
			});
			



			function chkReturnStatus(msg) {
				var errorMsg = (msg != "") ? msg : "查無相關資料";
				framework.alert(errorMsg, function () {
					framework.backToNative();
					return;
				}, "");
			}

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
				getF5000107();
				

			}


		});




		
	//=====[ END]=====//


});