/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/service/qrcodePay/securityServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
],function(MainApp){

//=====[payCardFeeCtrl 自行輸入繳卡費 START]=====//
MainApp.register.controller('qrcodePayTaxCheckCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout ,framework
	,stringUtil
	,qrcodePayServices
	,qrCodePayTelegram
	,securityServices
){
	qrcodePayServices.requireLogin();

	$scope.qrcode = $stateParams.qrcode;
	$scope.paymentData = $stateParams.paymentData;
	$scope.securityType = $stateParams.securityType;
	$scope.numFmt = stringUtil.formatNum;

	/**
	 * 點選確認
	 */
	$scope.clickSubmit = function(){
		
		qrcodePayServices.getLoginInfo(function(info){
			if( ($scope.securityType.key=='NONSET') && (info.cn==null || info.cn=='')){
				framework.alert('您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。', function(){
					qrcodePayServices.closeActivity();
				});
				return;
			}
			$scope.paymentData.custId = info.custId;
			//debugger;
			var form = angular.copy($scope.paymentData);//因顯示和實際發出資料會有不同所以copy一份以免異常
			
			form.trnsAmount = form.trnsAmount*100;
			form.merchantName = encodeURI( $scope.qrcode.merchantName );
			//debugger;

			securityServices.send('qrcodePay/fq000106', form, $scope.securityType, function(res, error){
				
				if(res){
					var params = {
						qrcode:$scope.qrcode,
						result:res
					};
					
					$state.go('qrcodePayTaxResult',params,{location: 'replace'});
					
				}else{
					framework.alert(error.respCodeMsg, function(){
						qrcodePayServices.closeActivity();
					});
					
					// var params = {
					// 	result:error
					// };
					// $state.go('qrcodePayResult',params,{location: 'replace'});
				}
				
			});
		});
		
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
//=====[payCardFeeCtrl 自行輸入繳卡費 END]=====//


});
//=====[payCardFeeCtrl END]=====//