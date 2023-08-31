/**
 * [使用條款Ctrl]
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
	,'modules/telegram/qrcodePay/telegramServices'
],function(MainApp){

//=====[ START]=====//
MainApp.register.controller('fundResultStopPointCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n, $log
	,$rootScope,$timeout, framework, stringUtil
	,qrcodeTelegramServices
	,qrcodePayServices
	,qrCodePayTelegram
){
	$scope.result = $stateParams.result;
	const DebugMode = framework.getConfig("OFFLINE", 'B');
	const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	//轉換欄位資料
	function mapping(fund) {
		fund.incomePoint = parseInt(fund.incomePoint) / 100; 
		fund.profitPoint = parseInt(fund.profitPoint) / 100; 

		if(fund.incomePoint!=0||fund.profitPoint!=0){
			fund.selected = true;
		}else{
			fund.selected = false;
		}
		
		// fund.webNotice = (fund.webNotice.toUpperCase()=='Y');
		// fund.emailNotice = (fund.emailNotice.toUpperCase()=='Y');
		fund.webNotice = (typeof fund.webNotice == "string" && fund.webNotice.toUpperCase() == 'Y');
		fund.emailNotice = (typeof fund.emailNotice == "string" && fund.emailNotice.toUpperCase() == 'Y');

		return fund;
	}
	$scope.fundList = qrCodePayTelegram.toArray($scope.result.rdetails.detail).map(mapping) ;
	$scope.pointFilter = function (fund) {
		return (fund.incomePoint > 0 || fund.profitPoint > 0);
	}

	//點選返回
	$scope.clickBack = function(){
		if(OpenNactive){
			// qrcodePayServices.closeActivity();
			framework.backToNative();
		}else{
			$state.go('fundTermsStopPoint',{});
		}
	}
	
	$scope.clickHome = function(){
		// alert(JSON.stringify($scope.result));
		framework.backToNative();
	}

});
//=====[ END]=====//


});