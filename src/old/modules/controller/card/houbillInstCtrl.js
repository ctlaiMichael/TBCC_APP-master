/**
 * [帳單分期Ctrl]
 * billInstCtrl : 帳單分期
 */
define([
	'app'
	,'directive/signatureDirective'
	,'directive/checkDirective'
	,'directive/houbillInstDirective'
	//==Services==//
	,'service/loginServices'
	,'service/formServices'
	,'service/payCardFeeServices'
	,'service/houbillServices'
],function(MainApp){

/**
 * [billInstCtrl] 帳單分期
 * @param  {[type]} $scope			[description]
 * @param  {[type]} $state			[description]
 */
MainApp.register.controller('houbillInstCtrl',function(
	$scope,$state,$element,$compile,i18n
	,loginServices,formServices,sysCtrl
	,payCardFeeServices,houbillServices
){
	$scope.inp = {};
	$scope.curStep = 0;
	var haveStep = 1;
	
	$scope.returnStepView = function(step,directive_name){
		if(haveStep < step && typeof directive_name === 'string'){
			// var tmp_html = '<div  ng-if="curStep == '+step+'"><'+directive_name+'/></div>';
			// $element.append($compile(tmp_html)($scope));
			// haveStep++;
			var tmp_html = '<div  class="step_box step'+step+'"><'+directive_name+'/></div>';
			$element.append($compile(tmp_html)($scope));
			$element.find('.step_box').css('display','none');
			$element.find('.step_box.step'+step).css('display','block');
			haveStep++;
		}
		$scope.curStep = step;
	}

	//==需要登入==//
	var isLogin = loginServices.checkLogin({
		showLoginMenu : true //登入選單
	});
	if(isLogin){
		// var getPayAmt_method = function(success,resultObj){
		// 	if(!success || resultObj.maxInstallmentAmt <= 0){
		// 		taxbillServices.getErrorMsg('FC0009_001',resultObj.respCodeMsg);
		// 		return false;
		// 	}
		// 	$scope.payment = resultObj;
			$scope.returnStepView(1);
		//}

		//查電文
		//userModel = sysCtrl.getUserModel();
		//payCardFeeServices.getPayAmt(userModel.userId,getPayAmt_method);
		// $scope.inp.custId = userModel.userId;
	}

	//==step2.==//
	$scope.onAgree = function(){
		
		var check_flag = false;
		$element.find('input[type=checkbox]').each(function(){
			if(!$element.find(this).is(':checked')){
				check_flag = true;
			}
		});
		if(check_flag){
			houbillServices.getErrorMsg('AGREE_PROVISION_ONE');
			return false;
		}
		$scope.returnStepView(2,"bill-inst-form-directive");
		$scope.billOptions = houbillServices.getBillOptions(true);
		//debugger;
	}

	//==step3.==//
	$scope.onForm = function(){
		if(typeof $scope.selectBill !== 'object'){
			houbillServices.getErrorMsg('FC0009_002');
			return false;
		}
		//$scope.inp.payableAmt = $scope.payment.maxInstallmentAmt;
		$scope.inp.selectBill = (typeof $scope.selectBill === 'object') ? $scope.selectBill.value : '';
		// var result = taxbillServices.checkData($scope.inp);
		// if(!result.status){
		// 	taxbillServices.getErrorMsg(result.msg);
		// 	return false;
		 //	}
		if(haveStep == 2){
		MainUiTool.openConfirm({
			title : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.NOTE_1'),
			content : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.NOTE_4'),
			success : function(){
				// $scope.signatureSet = {
				// 	check_name : i18n.getStringByTag('BTN.NEXT'),
				// 	success : function(img){
				// 		$scope.inp.upload_image = {};
				// 		$scope.inp.upload_image['signiture'] = [];
				// 		$scope.inp.upload_image['signiture'].push(img);
				// 		$scope.returnStepView(4,"bill-inst-check-directive");
				// 	}
				// };
				//$scope.returnStepView(3,'signature-directive');
				
				
					$scope.returnStepView(4,"bill-inst-check-directive");
					
				
				
			}
		});
	}
	}
	//==step5.==//
	$scope.onCheck = function(){
		// if(typeof $scope.inp.upload_image !== 'object'
		// 	|| typeof $scope.inp.upload_image['signiture'] === 'undefined'
		// 	|| $scope.inp.upload_image['signiture'].length !== 1
		// ){
		// 	taxbillServices.getErrorMsg('SIGN');
		// 	return false;
		// }

		//檢核圖形驗證碼是否輸入
		var captchaVal = checkCaptch();
		if(!captchaVal){
			return false;
		}
		$scope.inp.captchaVal = captchaVal;
		$scope.inp.payCategory = "11201";
		var callBackMethod = function(result,respCodeMsg){
			if(!result){
				houbillServices.getErrorMsg('FC0009_003',respCodeMsg);
				return false;
			}
			$scope.result = i18n.getStringByTag('CTRL_INSTALLMENT.MSG.SUCCESS');
			$scope.returnStepView(5,"bill-inst-end-directive");
		};
		houbillServices.sendData($scope.inp,callBackMethod);
	}
	/**
	 * [checkCaptch 驗證檢查]
	 * @return {[type]} [description]
	 */
	var checkCaptch = function(){
		var captchaValtemp = $element.find('check-captcha-directive .input_captcha input').val();
		var result = formServices.checkEmpty(captchaValtemp,true);
		if(!result){
			$element.find('check-captcha-directive .input_captcha').addClass('input_error');
			houbillServices.getErrorMsg('INPUT_ERROR');
			return false;
		}
		return captchaValtemp;
	}


	/**
	 * [onChange 利率選擇變換]
	 * @param  {[type]} selectBill [選擇的利率]
	 * @return {[type]}            [description]
	 */
	$scope.onChange = function(selectBill){
		if(typeof selectBill !== 'object'){
			return false;
		}
		$scope.selectBill = selectBill;
		// var result = taxbillServices.getBillAvg($scope.selectBill.value,$scope.payment.maxInstallmentAmt);
		// if(result.list.length > 0){
		// 	$scope.selectAvge = result;
		// }
	}


});
//=====[billInstCtrl END]=====//


});