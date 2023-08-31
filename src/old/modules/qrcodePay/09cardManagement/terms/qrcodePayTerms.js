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
MainApp.register.controller('qrcodePayTermsCardCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, framework, stringUtil
	,qrcodeTelegramServices
	,qrcodePayServices
	,qrCodePayTelegram
){

	/**
	 * 點選同意
	 */
	$scope.clickAgree = function(){
		localStorage.setItem('firstAggreCard' ,"1");
		$state.go('cardAdd',{});
		return;
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