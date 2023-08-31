/**
 * [掛失Ctrl]
 */
define([
	'app'
	,'directive/checkDirective'
	,'directive/activateDirective'
	,'service/activateCardServices'
	,'service/cardServices'
],function(MainApp){
//=====[lostFormCtrl START]=====//
MainApp.register.controller('lostFormCtrl',function(
	$scope,$state,$element,$compile
	,cardServices
	,activateCardServices
){
	var cardType = "";
	var sendData = {};
	$scope.inp = {};
	//導頁
	$scope.setNext = function(value){
		var tmp_html = "";
		//掛失表單
		if ("applyLost"==value){
			tmp_html = '<div><lost-form-directive/></div>';
			$element.html($compile(tmp_html)($scope));
		//卡片查詢
		}else if("queryCard"==value){
			tmp_html = '<div><lost-query-directive/></div>';
			$element.html($compile(tmp_html)($scope));
		}
	}

	//==step3:檢查身分==//
	$scope.checkLostEvent = function(){
		//==表單檢查==//
		$scope.error_msg_list = {};
		$scope.inp.idNo = $element.find('input[identity-mask-directive]').data('realvalue');
		//==檢核資料==//
		var result = activateCardServices.checkApplyLost($scope.inp);
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
		var getCardData_method = function(success,resultObj){
			if(!success || typeof success !== 'object'){
				$state.go('message',{
					title : resultObj.msg,
					content : resultObj.msg_content
				});
				return false;
			}
			$scope.cardOptions = success.options;
			$scope.cardList = success.cardList;
			$scope.setNext('queryCard');
		}
		activateCardServices.getCardData($scope.inp,getCardData_method);
	}


	//掛失結果
	$scope.setTransfer = function(url){
		//檢核圖形驗證碼是否輸入
		var captchaVal = checkCaptch(true);
		if(!captchaVal){
			return false;
		}

		if(typeof $scope.selectCard !== 'object'
		 || typeof $scope.cardList[$scope.selectCard.creditCardType] === 'undefined'){

			return false;
		}

		var cardList = $scope.cardList[cardType];
		var replaceCard = "0";
		if ("lostYresult"==url){
			replaceCard = "1";
		}
		var branchId = "";
		if (typeof($scope.branchId) != "undefined"){
			branchId = $scope.branchId;
		}else if(typeof($scope.branch_id) != "undefined"){
			branchId = $scope.branch_id;
		}


		var sendData = {};
		sendData = $scope.inp;
		sendData.creditCardType = $scope.selectCard.creditCardType;	//信用卡類別
		sendData.creditCardNO = $scope.selectCard.creditCardNO;		//信用卡號碼
		sendData.cardType = $scope.selectCard.cardType;				//正附卡類型
		sendData.replaceCard = replaceCard;							//是否補發卡片
		sendData.branchId = branchId;								//分行代碼
		sendData.captchaVal = captchaVal;							//圖形驗證碼的值

		var easyCard = cardServices.getCardType("2");	//悠遊卡
		var allinoneCard = cardServices.getCardType("3");	//一卡通
		$scope.show_status = '1'; //顯示結果: 1預設,2悠遊卡顯示,3一卡通顯示
		if(typeof easyCard[sendData.creditCardType] !== 'undefined'){
			//悠遊卡顯示
			$scope.show_status = '2';
		}else if(typeof allinoneCard[sendData.creditCardType] !== 'undefined'){
			//一卡通顯示
			$scope.show_status = '3';
		}

		var sendData_method = function(success,resultObj){
			if(!success){
				activateCardServices.getErrorMsg('FC0006_002',resultObj.respCodeMsg);
				return false;
			}
			tmp_html = '<div><lost-result-directive/></div>';
			$element.html($compile(tmp_html)($scope));
		}
		activateCardServices.sendData(sendData,sendData_method);
	}

	//==卡片變換事件==//
	$scope.changeCard = function(selectCard){
		if(typeof selectCard !== 'object' ){
			$scope.selectCard = {};
			return false;
		}
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
//=====[lostFormCtrl END]=====//
});
