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
	,'service/loginServices'
	,'app_telegram/fc000305Telegram'
	

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
MainApp.register.controller('applyTypeCheckCtrl'
, function(
		$scope,$state,$stateParams,i18n,$element
		,cardTypeCheckServices
		,loginServices
		,cardServices
		,messageServices
		,fc000305Telegram
){
	//==card class==//
	//MainUiTool.setSectionClass('has_subtitle');
	//==變數設定==//
	$scope.applyTypeList={
		"00":{
			title:"以他行卡申請",
			subtitle:"以其他銀行信用卡進行驗證申請信用卡。",
			componentName:"otherCreditCard"
		},
		"01":{
			title:"以合庫卡申請",
			subtitle:"以合庫銀行信用卡進行驗證申請信用卡。",
			componentName:"tcbCreditCard"
		},
		"02":{
			title:"登入加辦",
			subtitle:"登入合庫網銀或信用卡會員加辦信用卡。",
			componentName:"apply.card"
		}
	}

	$scope.card_type = $stateParams.card_type; //卡片類型
	$scope.credit_type = $stateParams.credit_type; //以卡辦卡類別
	$scope.cardid = $stateParams.card_id; //卡片編號
	// //==卡片圖片資料==//
	$scope.card_path = cardServices.cardImgPath;
	// //==卡片資料取得==//
	$scope.card_data = cardServices.getCardType($scope.card_type,$scope.cardid);

	//執行清單
	$scope.doThePickedType=function(type){
		//type 00 => 他行 ; 01 => 合庫卡 ;02 => 正常流程
		$state.go(this.applyTypeList[type].componentName,{card_id:$scope.cardid});
	}
	//第一步驟開關
	// $scope.otherStep1=true;
	$element.find('.step_box1').css('display','block');
	//第二步驟開關
	// $scope.otherStep2=false;
	$element.find('.step_box2').css('display','none');
	//身分驗證區塊開關
	$scope.identityInfoStatus=true;

	//type 01 身分驗證事項說明 
	$scope.openInfo = function(){
		//info 開關
		$scope.identityInfoStatus=(this.identityInfoStatus===true)?false:true;
		/* popup
		MainUiTool.openPopupInformation({
			title: "身分驗證事項說明",
			content:"您可以使用以下銀行所發行之信用卡進行身分驗證：<br>中國信託商業銀行、玉山商業銀行、台新國際商業銀行、花旗(台灣)銀行、台北富邦商業銀行、聯邦商業銀行、永豐商業銀行、遠東國際商業銀行、華南商業銀行、第一商業銀行、臺灣新光商業銀行、元大銀行、匯豐(台灣)商業銀行、星展(台灣)商業銀行、兆豐國際商業銀行、彰化銀行、台灣樂天信用卡股份有限公司、台灣中小企業銀行、臺灣土地銀行、臺灣銀行、日盛國際商業銀行、台中商業銀行、陽信商業銀行、台灣永旺信用卡股份有限公司、三信商業銀行、高雄銀行、華泰商業銀行等。 "
		});*/

	}

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
	$scope.stepOne = function(){

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

		//基礎檢核過到下一步畫面

		$element.find('.step_box1').css('display','none');
		$element.find('.step_box2').css('display','block');
		angular.element('section').scrollTop(0);			
	}
	//送出資料發送電文驗證資料
	$scope.submitData = function(){
		
		let check_flag = false;
		$element.find('input[type=checkbox]').each(function(){
			if(!$element.find(this).is(':checked')){
				check_flag = true;
			}
		});
		if(check_flag){
			cardTypeCheckServices.getErrorMsg('AGREE_PROVISION_ONE');
			return false;
		}

		//資料整理送電文
		reqObj={
			custId:$scope.inp.idNo,
			creditCardNO:$scope.inp.cardNum,
			ValidMonthYear:$scope.inp.ymData,
			checkCode:$scope.inp.checkCode,
			birthDate:$scope.inp.birthday,
			captchaVal:$scope.inp.captchaVal,
			isSelf:"0"
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

	$scope.goBackstepOne = function(){

		$element.find('.step_box1').css('display','block');
		$element.find('.step_box2').css('display','none');
		
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