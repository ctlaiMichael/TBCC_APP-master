/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/service/qrcodePay/securityServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
],function(MainApp){

//=====[ START]=====//
MainApp.register.controller('qrCodePaySettingConfirmCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, framework
	,qrcodePayServices
	,securityServices
	,qrCodePayTelegram
){
	$scope.form = $stateParams.form;
	qrcodePayServices.requireLogin();
	qrcodePayServices.getLoginInfo(function(res){
		$scope.form.custId = res.custId;
	});

	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	

	var verifyCodeCheck = function(){
		var code = $scope.form.verifyCode;
		if(code==null || code.length==0){
			$('.inner_table_frame').addClass("active_warnning");
			// framework.alert('請輸入登入密碼');
			return false;
		}
		return true;
	}

	var submit = function(){
		//發送設定
		qrCodePayTelegram.send('qrcodePay/fq000103', $scope.form, function(res, error){
			if(res){
				//進入結果頁
				var params = {result: res,
					isAgreeQRCode: $scope.form.isAgreeQRCode
				};
				$state.go('qrcodePaySettingResult',params,{location: 'replace'});
			}else{
				// alert(error.respCodeMsg);
				// alert(JSON.stringify(error));
				var params = {result: error,
					isAgreeQRCode: $scope.form.isAgreeQRCode
				};
				$state.go('qrcodePaySettingResult',params,{location: 'replace'});
			}
		});
	}
	/**
	 * 點選確認
	 */
	$scope.clickSubmit = function(){
		if(!verifyCodeCheck()){
			return;
		}
		if(OpenNactive){
			//數位信封加密
			securityServices.digitalEnvelop($scope.form.verifyCode, function(signedText){
				//取得加密內容
				$scope.form.verifyCode=signedText;
				submit();
			}, function(error){
				//加密失敗
			})
		}else{
			submit();
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
