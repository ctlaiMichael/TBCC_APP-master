/**
 * [QR Code 繳卡費Ctrl]
 * qrCode4FeeCtrl : QR Code 繳卡費
 */
define([
	'app'
	//==Services==//
	,'service/qrCode4FeeServices'
	,'service/payCardFeeServices'
],function(MainApp){

/**
 * [qrCode4FeeCtrl] QR Code 繳卡費
 * @param  {[type]} $scope			[description]
 * @param  {[type]} $state			[description]
 */
MainApp.register.controller('qrCode4FeeCtrl',function(
	$scope,$state,$rootScope,framework
	,qrCode4FeeServices,payCardFeeServices
){
	$scope.$on('$destroy', function () {
		//離開畫面前要關閉camera
		framework.closeEmbedQRCodeReader(function(){ });
	 });
	$scope.androidPlatform = true;
	switch (device.platform) {
		// case "Android":
		// 	$scope.androidPlatform = true;
		// 	break;
		case "iOS":
			$scope.androidPlatform = false;
			break;
	}

	$rootScope.notDisplayFlag = true;
	MainUiTool.setSectionClass('notDisplayHeaderFooter');

	var callback_method = function(success,resultObj){
		$rootScope.notDisplayFlag = false;
		MainUiTool.setSectionClass('notDisplayHeaderFooter',true);
		
		if(!success || !resultObj.status){

			if (resultObj.msg === 'CAMERA_ACCESS_DENIED') {
				resultObj.msg = '權限不足請至設定開啟';
			}

			payCardFeeServices.getErrorMsg(resultObj.msg_code,resultObj.msg);
			return false;
		}
		var paymentData = resultObj.data;

		var set_data = {
			byPassage : 3, //通路別
			paymentData : paymentData, //選擇繳費清單
			check_key : '' //檢查項目
		};
		set_data.check_key = payCardFeeServices.getByPassageKey(set_data.byPassage);
		$state.go('payForm',set_data);
	}
	qrCode4FeeServices.getCameraEventNew(callback_method);

	//android實體鍵盤返回鍵
	document.addEventListener("backbutton", onBackKeyDown, false);
	function onBackKeyDown() {
		$scope.cancel();
		return ;
	}
	$scope.cancel = function() {
		//離開畫面前要關閉camera
		framework.closeEmbedQRCodeReader(function(){ });
		//顯示header/footer
		$rootScope.notDisplayFlag = false;
		//mainbox還原
		MainUiTool.setSectionClass('notDisplayHeaderFooter',true);
		//顯示錯誤訊息
		payCardFeeServices.getErrorMsg('FC0004_302','');
		return false;
	}

});
//=====[qrCode4FeeCtrl END]=====//


});
