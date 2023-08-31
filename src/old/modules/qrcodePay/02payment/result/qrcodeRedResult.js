/**
 * []
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
],function(MainApp){

//=====[ START]=====//
MainApp.register.controller('qrcodeRedResultCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, stringUtil, framework, sysCtrl
	,qrcodePayServices
	,qrCodePayTelegram,$css
){
	//登出
	//$css.add('ui/newMainPage/css/main.css');
	$scope.logout = function(){
		// sysCtrl.logout();
		// framework.mainPage();
		qrcodePayServices.logout();
	}

	$scope.result = $stateParams.result;
	$scope.formatDate = stringUtil.formatDate;

	var uu=$scope.result.trnsfrOutAcct;
	var kk='恭喜發財紅包'+$scope.result.trnsfrAmount+'元.Hi,我已轉帳新台幣'+$scope.result.trnsfrAmount+'元給你了(帳號末五碼'+uu.substr(uu.length-5,uu.length)+'),請看看有沒有收到喔！';
	
	if($scope.result.payId != null){$scope.result.payId = $scope.result.payId.substr(0,3)+ "***"+$scope.result.payId.substr(6,11);}
	if(typeof($scope.result.trnsDateTime)=='number'){
		$scope.result.trnsDateTime = $scope.result.trnsDateTime.toString();
	}
	$scope.formatAcct = stringUtil.formatAcct;
	$scope.formatAcct11 = stringUtil.formatAcct11;
	if(typeof($scope.result.trnsfrOutAcct)=='number'){
		$scope.result.trnsfrOutAcct = $scope.result.trnsfrOutAcct.toString();
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
	if($scope.result.trnsAmount!=null && $scope.result.trnsAmount!=''){
		$scope.result.trnsAmount = $scope.result.trnsAmount;
	}

	if($scope.result.notePayee == '[object Object]'){$scope.result.notePayee = '';}
	if($scope.result.notePayer == '[object Object]'){$scope.result.notePayer = '';}
	//alert($scope.result.notePayee);
	$scope.qrcode = $stateParams.qrcode;
	
	/**
	 * 點選取消
	 */
	$scope.clickCancel = function(){
		//qrcodePayServices.closeActivity();
		plugin.tcbb.returnHome(function () {}, function () {});
	}
	//點選返回
	$scope.clickBack = $scope.clickCancel;
	document.addEventListener("backbutton", $scope.clickBack, false);

	//進入紅包編輯
	
	$scope.getred = function(){
		//發送參加紅包回饋註記電文

		var params = {
			
			kkk:kk
		};
		$state.go('qrcodeRedEnve',params,{location: 'replace'});
		
	}
	
});
//=====[ END]=====//


});
