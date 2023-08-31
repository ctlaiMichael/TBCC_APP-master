/**
 * [單筆分期Ctrl]
 * singleInstCtrl : 單筆分期
 */
define([
	'app'
	,'directive/signatureDirective'
	,'directive/checkDirective'
	,'directive/singleInstDirective'
	//==Services==//
	,'service/loginServices'
	,'service/formServices'
	,'service/singleInstServices'
],function(MainApp){

/**
 * [singleInstCtrl] 單筆分期
 * @param  {[type]} $scope			[description]
 * @param  {[type]} $state			[description]
 */
MainApp.register.controller('singleInstCtrl',function(
	$scope,$state,$element,$compile,formServices,i18n
	,loginServices,singleInstServices
){
	$scope.curStep = 0;
	$scope.inp = {};
	var haveStep = 1;
	$scope.returnStepView = function(step,directive_name){
		if(haveStep < step && typeof directive_name === 'string'){
			var tmp_html = '<div  ng-if="curStep == '+step+'"';
			if (step == '5') {
				// 強制固定高度，解決ios鍵盤問題
				tmp_html += 'style="display:block;min-height:125vh;"';
			}
			tmp_html += '><'+directive_name+'/></div>';
			$element.append($compile(tmp_html)($scope));
			haveStep++;
		}
		$scope.curStep = step;
	}

	var isLogin = loginServices.checkLogin({
		showLoginMenu : true //登入選單
	});
	if(isLogin){
		var getCallBack = function(success,resultObj){
			if(!success){
				singleInstServices.getErrorMsg('FC0007_001',resultObj.respCodeMsg);
				return false;
			}
			$scope.billDetails = success;
			$scope.curStep = 1;
		}
		//取得FC000701-信用卡本期帳單消費明細查詢電文
		singleInstServices.getBillDetails(getCallBack);
	}

	//==step2.==//
	$scope.setInst = function(billDetails){
		if(typeof billDetails !== 'object'){
			singleInstServices.getErrorMsg('FC0007_004');
			return false;
		}
		$scope.instItem = billDetails;
		$scope.returnStepView(2,'single-inst-agree-directive');
	}

	//==step3.==//
	$scope.onAgree = function(){
		var check_flag = false;
		$element.find('input[type=checkbox]').each(function(){
			if(!$element.find(this).is(':checked')){
				check_flag = true;
			}
		});
		if(check_flag){
			singleInstServices.getErrorMsg('AGREE_PROVISION_ONE');
			return false;
		}
		$scope.billOptions = singleInstServices.getBillOptions($scope.instItem.show_bill);
		$scope.returnStepView(3,'single-inst-form-directive');
	}
	//==step4.==//
	$scope.onForm = function(selectBill){
		if(typeof selectBill !== 'object'){
			singleInstServices.getErrorMsg('FC0007_002');
			return false;
		}
		$scope.selectBill = selectBill;

		$scope.inp = {};
		$scope.inp.consumptionDate = $scope.instItem.consumptionDate;
		$scope.inp.consumptionAmount = $scope.instItem.NTDollarAmount;
		$scope.inp.period = (typeof selectBill.value !== '') ? selectBill.value : '';
		var result = singleInstServices.checkData($scope.inp);
		if(!result.status){
			singleInstServices.getErrorMsg(result.msg);
			return false;
		}
		//==簽名檔資料設定==//
		$scope.signatureSet = {
			check_name : i18n.getStringByTag('BTN.NEXT'),
			success : function(img){
				$scope.inp.upload_image = {};
				$scope.inp.upload_image['signiture'] = [];
				$scope.inp.upload_image['signiture'].push(img);
				$scope.returnStepView(5,'single-inst-check-directive');
			}
		};
		$scope.returnStepView(4,'signature-directive');
	}

	$scope.onCheck = function(){
		if(typeof $scope.inp.upload_image !== 'object'
			|| typeof $scope.inp.upload_image['signiture'] === 'undefined'
			|| $scope.inp.upload_image['signiture'].length !== 1
		){
			singleInstServices.getErrorMsg('SIGN');
			return false;
		}
		//檢核圖形驗證碼是否輸入
		var captchaVal = checkCaptch();
		if(!captchaVal){
			return false;
		}
		$scope.inp.captchaVal = captchaVal;
		var callBackMethod = function(result,respCodeMsg){
			if(!result){
				singleInstServices.getErrorMsg('FC0007_003',respCodeMsg);
				return false;
			}
			$scope.result = result;
		};
		//發送FC000702-單筆分期電文
		singleInstServices.sendData($scope.inp,callBackMethod);
		$scope.returnStepView(6,"single-inst-end-directive");
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
			singleInstServices.getErrorMsg('INPUT_ERROR');
			return false;
		}
		return captchaValtemp;
	}
});
//=====[singleInstCtrl END]=====//


});