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
	,$rootScope,$timeout, stringUtil, framework, sysCtrl,boundle
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
	$scope.means = $stateParams.means;
	$scope.formatDate = stringUtil.formatDate;
	var noDataDisplay = "--";

	//是否要申辦信用卡
	var today = new Date();
	if(boundle.getData('hasCards') == "0" && localStorage.getItem("nextAsk_applyCard") != today.getDate().toString()){
		MainUiTool.openConfirm({
			title: '訊息',
				content: "是否申請信用卡<br><input id='nextAsk' type='checkbox' style='margin-right:3px;'>本日不再提醒我",
				success: function(){
					//	下次是否詢問
					if($('#nextAsk').prop('checked')){
						localStorage.setItem("nextAsk_applyCard",today.getDate().toString());
					}else{
						localStorage.setItem("nextAsk_applyCard",'0');
					}
					plugin.main.creadit(function () { }, function () { });
				},
				cancel : function(){
					console.log("return;");
					return;
				}
		});
	}

	if($scope.result.respCode == 0){
		localStorage.setItem("defaultType",localStorage.getItem("pay_method"))
	}
	

	if ($stateParams.result.trnsDateTime == null || $stateParams.result.trnsDateTime == ''){
		$scope.result.trnsDateTime = noDataDisplay;
	}else {
		if(typeof($scope.result.trnsDateTime)=='number'){
			$scope.result.trnsDateTime = $scope.result.trnsDateTime.toString();
		}
		if($scope.means != "card"){
			$scope.result.trnsDateTime = stringUtil.formatDate($scope.result.trnsDateTime);
		}
		// $scope.result.trnsDateTime = stringUtil.formatDate($scope.result.trnsDateTime);
		if ($scope.result.trnsDateTime == null || $scope.result.trnsDateTime == ''){
			$scope.result.trnsDateTime = $stateParams.result.trnsDateTime;
		}
	}

	$scope.formatAcct = stringUtil.formatAcct;
	if ($stateParams.result.trnsfrOutAcct == null || $stateParams.result.trnsfrOutAcct == ''){
		$scope.result.trnsfrOutAcct = noDataDisplay;
	}else {
		if(typeof($scope.result.trnsfrOutAcct)=='number'){
			$scope.result.trnsfrOutAcct = $scope.result.trnsfrOutAcct.toString();
		}	
		$scope.result.trnsfrOutAcct = stringUtil.formatAcct($scope.result.trnsfrOutAcct);
		if ($scope.result.trnsfrOutAcct == null || $scope.result.trnsfrOutAcct == ''){
			$scope.result.trnsfrOutAcct = $stateParams.result.trnsfrOutAcct;
		}
	}

	$scope.numFmt = stringUtil.formatNum;
	if(($scope.result.respCode == null|| $scope.result.respCode == '') && $scope.result.trnsRsltCode!=null){
		$scope.result.respCode = $scope.result.trnsRsltCode;
	}
	if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.trnsRsltCodeMsg!=null){
		$scope.result.respCodeMsg = $scope.result.trnsRsltCodeMsg;
	}
	if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.hostCodeMsg!=null){
		$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
	}
	if ($stateParams.result.trnsAmount == null || $stateParams.result.trnsAmount == ''){
		$scope.result.trnsAmount = noDataDisplay;
	}else {
		if($scope.result.trnsAmount!=null && $scope.result.trnsAmount!=''){
			$scope.result.trnsAmount = $scope.result.trnsAmount/100;
		}
		$scope.result.trnsAmount = stringUtil.formatNum($scope.result.trnsAmount);
		if ($scope.result.trnsAmount == null || $scope.result.trnsAmount == ''){
			$scope.result.trnsAmount = $stateParams.result.trnsAmount;
		}
	}
	
	$scope.qrcode = $stateParams.qrcode;
	if ($stateParams.qrcode.merchantName == null || $stateParams.result.merchantName == ''){
		$scope.qrcode.merchantName = noDataDisplay;
	}
	if($scope.means == "card" && $stateParams.result.merchantName != ''){
		$scope.qrcode.merchantName = $stateParams.result.merchantName;
	}
	
	
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