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
MainApp.register.controller('qrcodePayTermsCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, framework, stringUtil
	,qrcodeTelegramServices
	,qrcodePayServices
	,qrCodePayTelegram
){
	qrcodePayServices.requireLogin();
	$scope.form = {txnType:'S'};
	//避免末完成初始化就被按下按鈕
	$scope.disable = false;
	
	// qrcodePayServices.getLoginInfo(function(res){
	// 	$scope.form.custId = res.custId;
	// 	/**
	// 	 * 載入帳號和使用者設定
	// 	 */
	// 	qrCodePayTelegram.send('qrcodePay/fq000101', $scope.form, function(res, resultHeader){
	// 		//檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
	// 		if(res){
	// 			if(res.trnsOutAccts == null 
	// 				|| res.trnsOutAccts.trnsOutAcct == null ){
	// 				framework.alert("未開通晶片金融卡，請臨櫃申請");
	// 				qrcodePayServices.closeActivity();
	// 			}
	// 			var acts = res.trnsOutAccts.trnsOutAcct;
	// 			acts = qrcodeTelegramServices.modifyResDetailObj(res.trnsOutAccts.trnsOutAcct);
	// 			// //取得進行SmartPay開通功能開關
	// 			$scope.isAgreeQRCode = (res.isAgreeQRCode!=null && typeof(res.isAgreeQRCode)=='string' && res.isAgreeQRCode.toUpperCase()=='Y');
	// 			$scope.accts = [];
	// 			for(key in acts){
	// 				//檢查是否為預設SmartPay帳戶
	// 				if(acts[key].acctNo == res.defaultTrnsOutAcct){
	// 					acts[key].selected = true;
	// 				}
	// 				if(typeof(acts[key].enabledSmartPay)!='string'){
	// 					acts[key].enabledSmartPay='';
	// 				}
	// 				$scope.accts.push(acts[key]);
	// 			}
	// 			if($scope.accts.length==0){
	// 				framework.alert("未開通晶片金融卡，請臨櫃申請", function(){
	// 					qrcodePayServices.closeActivity();
	// 				});
	// 			}
	// 			$scope.defaultTrnsOutAcct =res.defaultTrnsOutAcct;
	// 			$scope.disable = false;
	// 		}else{
	// 			framework.alert(resultHeader.respCodeMsg, function(){
	// 				qrcodePayServices.closeActivity();
	// 			});
	// 		}

	// 	});
	// });
	

	/**
	 * 點選同意
	 */
	$scope.clickAgree = function(){
		$state.go('qrcodePay',{});
	}

	/**
	 * 點選不同意
	 */
	$scope.clickDisAgree = function(){
		qrcodePayServices.closeActivity();
	}
	//點選返回
	$scope.clickBack = $scope.clickDisAgree;
	

});
//=====[ END]=====//


});