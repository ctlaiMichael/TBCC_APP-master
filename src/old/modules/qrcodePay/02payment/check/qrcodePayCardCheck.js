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
MainApp.register.controller('qrcodePayCardCheckCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, framework
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
			//debugger;
			$scope.paymentData.custId = info.custId;
			var form = angular.copy($scope.paymentData);//因顯示和實際發出資料會有不同所以copy一份以免異常
			form.txnAmt = form.txnAmt*100;
			if($scope.qrcode.charge != null && typeof($scope.qrcode.charge )== 'object' ) { form.charge  = "";}
			else{form.charge = $scope.qrcode.charge;}
			//form.charge = $scope.qrcode.charge;
			//form.noticeNbr = $scope.qrcode.noticeNbr; 
			if($scope.qrcode.noticeNbr != null && typeof($scope.qrcode.noticeNbr) == 'object' ) { form.noticeNbr  = "";}
			else{form.noticeNbr = $scope.qrcode.noticeNbr;}
			if($scope.qrcode.otherInfo != null && typeof($scope.qrcode.otherInfo) == 'object' ) { form.otherInfo  = "";}
			else{form.otherInfo = encodeURI($scope.qrcode.otherInfo);}
			//form.otherInfo = encodeURI($scope.qrcode.otherInfo);
			//form.otherInfo = $scope.qrcode.otherInfo;
			if($scope.qrcode.feeInfo != null && typeof($scope.qrcode.feeInfo) == 'object' ) { form.feeInfo  = "";}
			else{form.feeInfo = $scope.qrcode.feeInfo;}
			//form.feeInfo = $scope.qrcode.feeInfo;
			if($scope.qrcode.feeName != null && typeof($scope.qrcode.feeName) == 'object' ) { form.feeName  = "";}
			else{form.feeName = encodeURI($scope.qrcode.feeName);}
			//form.feeName = encodeURI($scope.qrcode.feeName);
			//form.feeName = $scope.qrcode.feeName;
			form.trnsfrOutBank = "006";
			form.merchantName = encodeURI($scope.qrcode.merchantName);
			//form.merchantName = $scope.qrcode.merchantName;
			if($scope.qrcode.deadlinefinal != null && typeof($scope.qrcode.deadlinefinal) == 'object' ) { form.deadlinefinal  = "";}
			else if($scope.qrcode.deadlinefinal == '[object Object]'){form.deadlinefinal  = "";}
			else{form.deadlinefinal = $scope.qrcode.deadlinefinal;}
			//form.deadlinefinal = $scope.qrcode.deadlinefinal;

			//debugger;
			securityServices.send('qrcodePay/fq000107', form, $scope.securityType, function(res, error){
				if(res){
					//debugger;
					var params = {
						qrcode:$scope.qrcode,
						result:res
					};

					$state.go('qrcodePayCardResult',params,{location: 'replace'});
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