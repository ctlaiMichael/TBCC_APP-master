/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/service/qrcodePay/securityServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
	,'modules/service/common/openAppUrlServices'
],function(MainApp){

//=====[payCardFeeCtrl 自行輸入繳卡費 START]=====//
MainApp.register.controller('barcodeMenuCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n, sysCtrl
	,$rootScope,$timeout, framework, $window,$log
	,stringUtil
	,qrcodePayServices
	,securityServices
	,qrCodePayTelegram
	,openAppUrlServices
){
	//==參數設定==//
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	qrcodePayServices.requireLogin();
	$scope.menu = [
		{
			url:"applyBarcodeEdit",
			name:"手機條碼申請"
		},{
			url:"getBarcodeEdit",
			name:"手機條碼查詢"
		}
	]

	// ,{
	// 	url:"changeBarcodeEdit",
	// 	name:"手機條碼異動"
	// }

	//登出
	$scope.logout = function(){
		qrcodePayServices.logout();
	}

	//android實體鍵盤返回鍵
	document.addEventListener("backbutton", onBackKeyDown, false);
	function onBackKeyDown() {
		qrcodePayServices.closeActivity();
	}

	var applyBarcode_URL = "https://www.einvoice.nat.gov.tw/APMEMBERVAN/GeneralCarrier/generalCarrier";

	/**
	 * 點選功能換頁
	 */
	$scope.clickMenu = function(url){
		if(url=='applyBarcodeEdit'){
			openAppUrlServices.openWeb(applyBarcode_URL); //開啟Web
			return;
		}
		if(url=='changeBarcodeEdit'){
			framework.alert('施工中...',function(){
				qrcodePayServices.closeActivity();
				return;
			});
		}
		$state.go(url,{});
	}
	
	/**
	 * 點選取消
	 */
	$scope.clickBack = function(){
		qrcodePayServices.closeActivity();
	}
	

});
//=====[payCardFeeCtrl 自行輸入繳卡費 END]=====//


});
//=====[payCardFeeCtrl END]=====//
