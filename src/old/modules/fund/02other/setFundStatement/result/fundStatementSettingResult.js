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
MainApp.register.controller('fundResultNoticeTypeCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, framework, stringUtil
	,qrcodeTelegramServices
	,qrcodePayServices
	,qrCodePayTelegram
){
	$scope.result = $stateParams.result;
	$scope.clickConfirm = function(){
		framework.backToNative();
	}

	$scope.clickDisAgree = function(){
		$state.go('fundTermsNoticeType',{});
	}
	//點選返回
	$scope.clickBack = $scope.clickDisAgree;
	
	$scope.getMailOutName = function(){
		if($scope.result.mailOut=='1'){
			return '自取';
		}else if($scope.result.mailOut=='2'){
			return '寄發紙本';
		}else if($scope.result.mailOut=='3'){
			return '寄發電子郵件';
		}
	}
});
//=====[ END]=====//


});