/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	,'directive/checkDirective'
	,'directive/payResultDirective'
	,'service/brankServices'
	,'service/payCardFeeServices'
],function(MainApp){

//=====[payCardFeeCtrl 自行輸入繳卡費 START]=====//
MainApp.register.controller('payCardFeeCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout
	,brankServices,payCardFeeServices
){
	//==預設參數設定==//
	$scope.byPassage = 1;
	$scope.error_msg_list = {};
	$scope.inp = {};
	$scope.inp.cardnum = ''; //銷編
	var page_step_set = {
		'form' : '',
		'check' : 'pay-check-directive',
		'result' : 'pay-result-directive'
	};
	//導頁
	$scope.showStep = 'from';
	$scope.setNext = function(step){
		if(typeof page_step_set[step] !== 'undefined'){
			$scope.showStep = step;
			var directive_name = page_step_set[step];
			if(typeof directive_name !== '' && $element.find(directive_name).length <= 0){
				var tmp_html = '<'+directive_name+'/>';
				$element.html($compile(tmp_html)($scope));
			}
		}
	}

	//==表單資料設定==//
	$scope.applyFormList = payCardFeeServices.getSetData($scope.byPassage);
	brankServices.setCitySelect('#bank_list');

	//==參數檢查==//
	if(typeof $stateParams.byPassage !== 'undefined'
		&& $stateParams.byPassage !== 1
		&& typeof $scope.applyFormList['byPassage'][$stateParams.byPassage] !== 'undefined'
	){
		//==通路別檢查==//
		var result = payCardFeeServices.checkByPassage($stateParams);
		// console.log(result);
		if(!result.status){
			$scope.byPassage = 1;
			$scope.paymentData = {};
		}else{
			//==標題設定==//
			$rootScope.head_fix_title = true;
			$rootScope.head_title = result.title;
			// console.log('head_title:'+result.title);

			$scope.byPassage = result.byPassage;
			$scope.paymentData = result.paymentData;
			$scope.inp.cardnum = result.cardnum;
			//==取得銀行帳戶==//
			if($scope.byPassage === 2){
				var getAcntData_method = function(success,resultObj){
					if(success){
						$scope.acntOptions = success;
						$scope.onSelectBank($scope.inp.selectBank);
					}else{
						payCardFeeServices.getErrorMsg('取得帳戶失敗');
					}
				}
				payCardFeeServices.getAcntData(getAcntData_method);
			}
		}
	}

	//==產生銷帳編號==//
	$scope.getChnum = function(){
		var custId = $element.find('input[identity-mask-directive]').data('realvalue');
		var result = payCardFeeServices.getCardNum(custId);
		if(result.status){
			$scope.inp.cardnum = result.data;
			$scope.inp.idNo = custId;
		}else{
			$scope.error_msg_list.idNo = result.msg;
			payCardFeeServices.getErrorMsg(result.msg);
		}
	}

	$scope.onSelectBank = function(selectBank){
		var select_box = $element.find('#acnt_box_select');
		var input_box = $element.find('#acnt_box');
		select_box.css('display','none');
		input_box.css('display','');
		if($scope.byPassage === 2 && $scope.acntOptions && selectBank === '006'){
			select_box.css('display','');
			input_box.css('display','none');
		}
	}

	//==表單資料檢查==//
	$scope.checkData = function(){
		// console.log($scope.inp);
		//==表單檢查==//
		$scope.error_msg_list = {};
		if($scope.paymentData && $scope.inp.selectAmt){
			$scope.inp.paymentData = $scope.paymentData;
		}
		var result = payCardFeeServices.checkForm($scope.byPassage,$scope.inp);
		if(!result.status){
			$scope.error_msg_list = result.error_list;
			payCardFeeServices.getErrorMsg(result.msg);
			return false;
		}
		$scope.inp = result.inp;
		$scope.inp.show.selectBank = brankServices.getData('key_obj',$scope.inp.selectBank);
		//==go to check==//
		$scope.setNext('check');
	}

	//==確認繳卡費==//
	$scope.sendTransfer = function(){
		//檢核圖形驗證碼是否輸入
		var captchaVal = checkCaptch();
		if(!captchaVal){
			return false;
		}
		$scope.inp.captchaVal = $scope.checkCaptchaData.input;
		var sendData_method = function(success,resultObj,headerObj){
			var resHeader = headerObj;
			var result = resultObj;
			$scope.res = {};
			$scope.res.cardnum = result.bussNO;
			$scope.res.payAcnt = result.trnsfrOutAccnt;
			$scope.res.payAmt = result.trnsfrAmount;
			$scope.res.payBank = brankServices.getData('key_obj',result.trnsfrOutBank);
			$scope.res.payDate = resHeader.responseTime;
			$scope.res.selectAmt = (typeof $scope.applyFormList['paymentType'][result.paymentType] !== 'undefined') ? $scope.applyFormList['paymentType'][result.paymentType]['name'] : '';

	
			$scope.res.success = success
			$scope.res.respCodeMsg = '';
			if(success){
				$scope.res.result = i18n.getStringByTag('CTRL_PAY.SUCCESS'); //繳費成功
			}else{
				$scope.res.result = i18n.getStringByTag('CTRL_PAY.ERROR'); //繳費失敗
				$scope.res.respCodeMsg = result.respCodeMsg;
			}
			$scope.setNext('result');
		}
		//發送電文
		$scope.inp.byPassage = $scope.byPassage;
		var result = payCardFeeServices.sendData($scope.inp,sendData_method);
		if(!result.status){
			$scope.error_msg_list = result.error_list;
			payCardFeeServices.getErrorMsg(result.msg);
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
			payCardFeeServices.getErrorMsg('ERROR_CONNECTION');
			return false;
		}
		//==圖形驗證碼==//
		if(!$scope.checkCaptchaData.check_method()){
			payCardFeeServices.getErrorMsg('CAPTCHA');
			return false;
		}
		return $scope.checkCaptchaData.input;
	}

});
//=====[payCardFeeCtrl 自行輸入繳卡費 END]=====//


//=====[payFormLoginCtrl START]=====//
MainApp.register.controller('loginPayCardFeeCtrl', function(
	$scope,$state,$element
	,loginServices,payCardFeeServices,sysCtrl
){

	/**
	 * 繳卡費不可以使用信用卡登入!
	 * 因為要取得個網登入的本人本行合庫帳戶
	 */
	// var isLogin = loginServices.checkLogin(); //沒登入重來
	var isLogin = loginServices.checkLogin({
		showLoginMenu : true //登入選單
	});
	if(isLogin){
		var getPayAmt_method = function(success,resultObj){
			if(success){
				if(resultObj.payableAmt <= 0){
					payCardFeeServices.getErrorMsg('FC0004_002'); //無本期應繳金額
					return false;
				}
				var set_data = {
					byPassage : 2, //通路別
					paymentData : {}, //選擇繳費清單
					check_key : '' //檢查項目
				};
				set_data.paymentData.payableAmt = resultObj.payableAmt;
				set_data.paymentData.lowestPayableAmt = resultObj.lowestPayableAmt;
				if (parseInt(set_data.paymentData.payableAmt) < parseInt(set_data.paymentData.lowestPayableAmt)){
					//set_data.paymentData.lowestPayableAmt = set_data.paymentData.payableAmt;
					set_data.paymentData.lowestPayableAmt = set_data.paymentData.payableAmt;
				}
				set_data.paymentData.cardnum = resultObj.cardnum;
				set_data.check_key = payCardFeeServices.getByPassageKey(set_data.byPassage);

				$state.go('payForm',set_data);
			}else{
				payCardFeeServices.getErrorMsg('FC0004_001',resultObj.respCodeMsg);
			}
		}
		payCardFeeServices.getPayAmt('',getPayAmt_method);
	}

});
//=====[payFormLoginCtrl END]=====//
});
//=====[payCardFeeCtrl END]=====//
