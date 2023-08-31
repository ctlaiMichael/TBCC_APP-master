/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
],function(MainApp){

//=====[ START]=====//
MainApp.register.controller('qrcodePaySettingCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, framework
	,qrcodePayServices
	,qrCodePayTelegram
){
	qrcodePayServices.requireLogin();
	
	$scope.accts = $stateParams.accts;
	$scope.selectedAcct = null;
	$scope.isAgreeQRCode = false;


	$scope.form = {isAgreeQRCode: 'Y'};
	//設定原來指定的帳號
	$scope.originAcct=null;
	for(i in $scope.accts){
		if($scope.accts[i].selected){
			$scope.originAcct = $scope.accts[i];
		}
	}
	
	/**
	 * 點選帳號動作(設定為單選)
	 */
	$scope.selectAcct = function(acct){
		$scope.selectedAcct = acct;
		for(i in $scope.accts){
			$scope.accts[i].selected = ($scope.accts[i]==acct);
		}
	}

	/**
	 * 檢查所選帳戶是否開通SmartPay
	 * @param {*} acct 
	 */
	var checkAcctPermission = function(acct){
		if(acct.enabledSmartPay.toUpperCase()=='Y'){
			return true;
		}
		return false;
	}

	/**
	 * 點選確認
	 */
	$scope.clickNextStep = function(){
		var nextSetp = function(){
			$scope.form.acctNo = $scope.selectedAcct.acctNo;
			$scope.form.isOpenSmartPay = $scope.selectedAcct.enabledSmartPay=='Y'?'N':'Y';
			//進入密碼輸入
			var params = {form: $scope.form};
			$state.go('qrCodePaySettingConfirm',params,{location: 'replace'});
		};
		//未變更
		if($scope.selectedAcct==null || $scope.originAcct==$scope.selectedAcct){
			framework.alert("無變更");
			return;
		}
		//檢查所選帳戶是否開通SmartPa
		if(checkAcctPermission($scope.selectedAcct)){
			nextSetp();
		}else{
			framework.confirm('您所選取之交易帳號尚未進行SmartPay開通，請問您是否同意開通?', function(ok){
				if(ok){nextSetp();}
				else{return;}
			});
		}
	}
	
	/**
	 * 點選取消
	 */
	$scope.clickCancel = function(){
		qrcodePayServices.closeActivity();
	}
	//點選返回
	$scope.clickBack = $scope.clickCancel;
	


});
//=====[END]=====//
});
