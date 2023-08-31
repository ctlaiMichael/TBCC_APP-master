/**
 * [申請信用卡-卡片申辦選擇 Ctrl]
 * applyTypeCheckCtrl : 卡片申辦選擇
 */
define([
	'app'
	,'directive/checkDirective'
	,'service/messageServices'
	,'service/cardTypeCheckServices'
	,'service/cardServices'
	,"app_telegram/fc000305Telegram"
],function(MainApp){

/**
 * [applySelectCtrl] 卡片選擇
 * @param  {string} page  				[頁面]
 *                  index : 卡片介紹頁 		$state.go('apply',{page:'index'});
 *                  choose : 卡片更多選擇頁	$state.go('apply',{page:'choose'});
 * @param  {string} card_type 			[卡片分類] 請參照卡片設定檔
 * @param  {string} card_id 			[卡片編號] 請參照卡片設定檔
 * @param  {string} credit_type  信用卡種類 tcb => 合庫 other =>他行卡
 *  */
MainApp.register.controller('applyTCBCheckCtrl'
, function(
		$scope,$state,$stateParams,i18n,$element
		,cardTypeCheckServices
		,cardServices
		,messageServices
		,fc000305Telegram
){
	//==card class==//
	//MainUiTool.setSectionClass('has_subtitle');
	//==變數設定==//
	
	$scope.credit_type = $stateParams.credit_type; //以卡辦卡類別
	$scope.card_type = $stateParams.card_type; //卡片類型
	$scope.cardid = $stateParams.card_id; //卡片編號
	// //==卡片圖片資料==//
	$scope.card_path = cardServices.cardImgPath;
	// //==卡片資料取得==//
	$scope.card_data = cardServices.getCardType($scope.card_type,$scope.cardid);

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

	//==送出表單==//
	$scope.submitData = function(){

		let check_flag = false;
		$element.find('input[type=radio]').each(function(){
			if(!$element.find(this).is(':checked')){
				check_flag = true;
			}
		});
		if(check_flag){
			cardTypeCheckServices.getErrorMsg('AGREE_PROVISION_ONE');
			return false;
		}
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
		var result = cardTypeCheckServices.checkForm($scope.inp);
	
		if(!result.status){
			cardTypeCheckServices.getErrorMsg(result.msg);
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

		//資料整理送電文
		reqObj={
			custId:$scope.inp.idNo,
			creditCardNO:$scope.inp.cardNum,
			ValidMonthYear:$scope.inp.ymData,
			checkCode:$scope.inp.checkCode,
			birthDate:$scope.inp.birthday,
			captchaVal:$scope.inp.captchaVal,
			isSelf:"1"
		};
		fc000305Telegram.sendReq(reqObj,function(res,resultData){
			//電文回錯誤訊息
			if(res===true){
				$state.go("apply.card",{card_id:$scope.cardid,credit_type:$scope.credit_type,idno:$scope.inp.idNo});
				// $state.go("apply.card",{card_id:$scope.cardid});
			}else{
				
				cardTypeCheckServices.getErrorMsg(resultData.respCodeMsg,"");
				return false;
			}
		});
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
				cardTypeCheckServices.getErrorMsg('ERROR_CONNECTION');
			}
			return false;
		}
		//==圖形驗證碼==//
		if(!$scope.checkCaptchaData.check_method()){
			if(dialog_show){
				cardTypeCheckServices.getErrorMsg('CAPTCHA');
			}
			return false;
		}
		return $scope.checkCaptchaData.input;
	}

	$scope.goback=function(){	
		
		$state.go("applyTypeCheck",{card_id:$scope.cardid});
	}



});
//=====[applyTypeCheckCtrl END]=====//

});