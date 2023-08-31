/**
 * []
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
],function(MainApp){

//=====[ START]=====//
MainApp.register.controller('qrcodePayResultCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, framework
	,qrcodePayServices
	,qrCodePayTelegram
){
	//==參數設定==//
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	
	$scope.result = $stateParams.result;
	if(($scope.result.respCode == null || $scope.result.respCode == '') && $scope.result.trnsRsltCode!=null){
		$scope.result.respCode = $scope.result.trnsRsltCode;
	}
	if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.trnsRsltCodeMsg!=null){
		$scope.result.respCodeMsg = $scope.result.trnsRsltCodeMsg;
	}
	if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.hostCodeMsg!=null){
		$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
	}
	$scope.isAgreeQRCode = $stateParams.isAgreeQRCode;

	$scope.clickPay = function(){
		// if(OpenNactive && device.platform=='Android'){
		// 	plugin.bank.scan(function(){} ,function(){});
		// 	qrcodePayServices.closeActivity();
		// }else{
		// 	$state.go('qrcodePay',{});
		// }
		$state.go('qrcodePayScanNew',{});
	}
	
	
	/**
	 * 點選取消
	 */
	$scope.clickCancel = function(){
		qrcodePayServices.closeActivity();
	}
	//點選返回
	$scope.clickBack = $scope.clickCancel;
	document.addEventListener("backbutton", $scope.clickCancel, false);
});
//=====[ END]=====//


});
