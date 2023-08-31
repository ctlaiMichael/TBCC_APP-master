/**
 * []
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
],function(MainApp){

//=====[ START]=====//
MainApp.register.controller('qrcodePayTaxResultCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, stringUtil, framework, sysCtrl
	,qrcodePayServices
	,qrCodePayTelegram
){
	//登出
	$scope.logout = function(){
		// sysCtrl.logout();
		// framework.mainPage();
		qrcodePayServices.logout();
	}

	$scope.result = $stateParams.result;
	$scope.formatDate = stringUtil.formatDate;
	if($scope.result.respCode == 0){
		localStorage.setItem("defaultType",localStorage.getItem("pay_method"))
	}
	
	if($scope.result.payId != null){$scope.result.payId = $scope.result.payId.substr(0,3)+ "***"+$scope.result.payId.substr(6,11);}
	if(typeof($scope.result.trnsDateTime)=='number'){
		$scope.result.trnsDateTime = $scope.result.trnsDateTime.toString();
	}
	$scope.formatAcct = stringUtil.formatAcct;
	$scope.formatAcct11 = stringUtil.formatAcct11;
	if(typeof($scope.result.trnsfrOutAcct)=='number'){
		$scope.result.trnsfrOutAcct = $scope.result.trnsfrOutAcct.toString();
	}
	$scope.numFmt = stringUtil.formatNum11;
	if(($scope.result.respCode == null|| $scope.result.respCode == '') && $scope.result.trnsRsltCode!=null){
		$scope.result.respCode = $scope.result.trnsRsltCode;
	}
	if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.trnsRsltCodeMsg!=null){
		$scope.result.respCodeMsg = $scope.result.trnsRsltCodeMsg;
	}
	if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.hostCodeMsg!=null){
		$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
	}
	if($scope.result.trnsAmount!=null && $scope.result.trnsAmount!=''){
		$scope.result.trnsAmount = $scope.result.trnsAmount;
	}
	$scope.qrcode = $stateParams.qrcode;
	
	/**
	 * 點選取消
	 */
	$scope.clickCancel = function(){
		qrcodePayServices.closeActivity();
	}
	//點選返回
	$scope.clickBack = $scope.clickCancel;
	document.addEventListener("backbutton", $scope.clickBack, false);

});
//=====[ END]=====//


});
