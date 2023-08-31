/**
 * [開卡Ctrl]
 */
define([
	'app'
	,'directive/checkDirective'
	,'service/activateCardServices'
],function(MainApp){
//=====[activateFormCtrl START]=====//
MainApp.register.controller('activateFormCtrl',
function(
	$scope,$state,$element,i18n
	,activateCardServices
){
	$scope.inp = {};
	$scope.cardNumList = {
		'n1' : '',
		'n2' : '',
		'n3' : '',
		'n4' : ''
	};

	//==信用卡鍵盤事件==//
	$scope.checkCardEvent = function(type_num){
		type_num = parseInt(type_num);
		var key = 'n'+type_num;
		if(typeof $scope.cardNumList[key] === 'undefined'){
			return false;
		}
		var next_key = type_num + 1;
		var pre_key = type_num - 1;
		var obj = null;
		if(pre_key > 0 && $scope.cardNumList['n'+pre_key].length === 0){
			obj = $element.find('input[name=card_num_'+pre_key+']');
		}else if(next_key < 5 && $scope.cardNumList[key].length === 4){
			obj = $element.find('input[name=card_num_'+next_key+']');
		}
		if(obj && obj.length === 1){
			obj.focus();
		}
	}

	//==step2:==//
	$scope.sendTransfer = function(){
		//==表單檢查==//
		$scope.error_msg_list = {};
		$scope.inp.idNo = $element.find('input[identity-mask-directive]').data('realvalue');
		$scope.inp.cardNum = "";
		var i=1;
		for(i=1;i<5;i++){
			if(typeof $scope.cardNumList['n'+i] === 'undefined'){
				break;
			}
			$scope.inp.cardNum += $scope.cardNumList['n'+i];
		}
		//==檢核資料==//
		var result = activateCardServices.checkActivateForm($scope.inp);
		if(!result.status){
			activateCardServices.getErrorMsg(result.msg);
			$scope.error_msg_list = result.error_list;
			var captchaVal = checkCaptch(); //檢核圖形驗證碼是否輸入
			return false;
		}
		$scope.inp = result.inp; //重新處理資料內容
		//檢核圖形驗證碼是否輸入
		var captchaVal = checkCaptch(true);
		if(!captchaVal){
			return false;
		}
		$scope.inp.captchaVal = captchaVal;
		var getResult_method = function(sucess,resultObj){
			if(sucess){
				activateCardServices.getErrorMsg('FC0005_001',resultObj.respCodeMsg); //開卡成功
			}else{
				activateCardServices.getErrorMsg('FC0005_002',resultObj.respCodeMsg); //開卡失敗
			}
		}
		//發送電文
		activateCardServices.getResult($scope.inp,getResult_method);
	}


	/**
	 * [checkCaptch 驗證檢查]
	 * @return {[type]} [description]
	 */
	var checkCaptch = function(dialog_show){
		//==使用captchaDirective::checkCaptchaDirective即會產生==//
		if(typeof $scope.checkCaptchaData === 'undefined'
			|| typeof $scope.checkCaptchaData.check_method !== 'function'
		){
			if(dialog_show){
				activateCardServices.getErrorMsg('ERROR_CONNECTION');
			}
			return false;
		}
		//==圖形驗證碼==//
		if(!$scope.checkCaptchaData.check_method()){
			if(dialog_show){
				activateCardServices.getErrorMsg('CAPTCHA');
			}
			return false;
		}
		return $scope.checkCaptchaData.input;
	}

});
//=====[activateFormCtrl END]=====//
});
