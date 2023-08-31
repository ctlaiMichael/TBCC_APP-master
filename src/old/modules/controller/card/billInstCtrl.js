/**
 * [帳單分期Ctrl]
 * billInstCtrl : 帳單分期
 */
define([
	'app'
	,'directive/signatureDirective'
	,'directive/checkDirective'
	,'directive/billInstDirective'
	//==Services==//
	,'service/loginServices'
	,'service/formServices'
	,'service/payCardFeeServices'
	,'service/billServices'
],function(MainApp){

/**
 * [billInstCtrl] 帳單分期
 * @param  {[type]} $scope			[description]
 * @param  {[type]} $state			[description]
 */
MainApp.register.controller('billInstCtrl',function(
	$scope,$state,$element,$compile,i18n
	,loginServices,formServices,sysCtrl
	,payCardFeeServices,billServices
){
	$scope.inp = {};
	$scope.curStep = 0;
	var haveStep = 1;
	$scope.returnStepView = function(step,directive_name){
		if(haveStep < step && typeof directive_name === 'string'){
			var tmp_html = '<div  ng-if="curStep == '+step+'"><'+directive_name+'/></div>';
			$element.append($compile(tmp_html)($scope));
			haveStep++;
		}
		$scope.curStep = step;
	}

	//==需要登入==//
	var isLogin = loginServices.checkLogin({
		showLoginMenu : true //登入選單
	});
	if(isLogin){
		var getPayAmt_method = function(success,resultObj){
			if(!success || resultObj.maxInstallmentAmt <= 0){
				billServices.getErrorMsg('FC0009_001',resultObj.respCodeMsg);
				return false;
			}
			$scope.payment = resultObj;
			$scope.returnStepView(1);
		}

		//查電文
		userModel = sysCtrl.getUserModel();
		payCardFeeServices.getPayAmt(userModel.userId,getPayAmt_method);
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
			billServices.getErrorMsg('AGREE_PROVISION_ONE');
			return false;
		}
		$scope.returnStepView(2,"bill-inst-form-directive");
		$scope.billOptions = billServices.getBillOptions(true);
	}

	//==step3.==//
	$scope.onForm = function(){
		
		if((parseInt($scope.payment.payableAmt)-parseInt($scope.payment.lowestPayableAmt))<3000){
			billServices.getErrorMsg('扣除最低應繳金額後，餘額未達3,000元');
			return false;
		}
		var today = new Date();//獲得當前日期
		if(today.getDate()>20){
			billServices.getErrorMsg('已逾申請日期');
			return false;
		}
		// alert(parseInt($scope.payment.paidAmt) - parseInt($scope.payment.lowestPayableAmt));
		// alert('test1'+ (parseInt($scope.payment.paidAmt)));
		// alert('test2'+ (parseInt($scope.payment.lowestPayableAmt)));
		if(parseInt($scope.payment.paidAmt) < parseInt($scope.payment.lowestPayableAmt)){
			billServices.getErrorMsg('尚未繳足最低金額');
			return false;
		}
		
		if(typeof $scope.selectBill !== 'object'){
			billServices.getErrorMsg('FC0009_002');
			return false;
		}
		$scope.inp.payableAmt = $scope.payment.maxInstallmentAmt;
		$scope.inp.selectBill = (typeof $scope.selectBill === 'object') ? $scope.selectBill.value : '';
		var result = billServices.checkData($scope.inp);
		if(!result.status){
			billServices.getErrorMsg(result.msg);
			return false;
		}
		MainUiTool.openConfirm({
			title : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.NOTE_1'),
			content : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.NOTE_2'),
			success : function(){
				$scope.signatureSet = {
					check_name : i18n.getStringByTag('BTN.NEXT'),
					success : function(img){
						$scope.inp.upload_image = {};
						$scope.inp.upload_image['signiture'] = [];
						$scope.inp.upload_image['signiture'].push(img);
						$scope.returnStepView(4,"bill-inst-check-directive");
					}
				};
				$scope.returnStepView(3,'signature-directive');
			}
		});

	}
	//==step5.==//
	$scope.onCheck = function(){
		if(typeof $scope.inp.upload_image !== 'object'
			|| typeof $scope.inp.upload_image['signiture'] === 'undefined'
			|| $scope.inp.upload_image['signiture'].length !== 1
		){
			billServices.getErrorMsg('SIGN');
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
				billServices.getErrorMsg('FC0009_003',respCodeMsg);
				return false;
			}
			MainUiTool.openDialog('申請成功，目前進件審核中。');
			// MainUiTool.openConfirm({
			// 	title : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.NOTE_1'),
			// 	content : i18n.getStringByTag('申請成功，目前進件審核中。'),
			// 	success : function(){
			// 		$scope.signatureSet = {
			// 			check_name : i18n.getStringByTag('BTN.NEXT'),
			// 			success : function(img){
			// 				$scope.inp.upload_image = {};
			// 				$scope.inp.upload_image['signiture'] = [];
			// 				$scope.inp.upload_image['signiture'].push(img);
			// 				//$scope.returnStepView(4,"bill-inst-check-directive");
			// 			}
			// 		};
			// 		$scope.returnStepView(3,'signature-directive');
			// 	}
			// });


			$scope.result = i18n.getStringByTag('CTRL_INSTALLMENT.MSG.SUCCESS');
			$scope.returnStepView(5,"bill-inst-end-directive");
		};
		billServices.sendData($scope.inp,callBackMethod);
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
			billServices.getErrorMsg('INPUT_ERROR');
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
		var result = billServices.getBillAvg($scope.selectBill.value,$scope.payment.maxInstallmentAmt);
		if(result.list.length > 0){
			$scope.selectAvge = result;
		}
	}


});
//=====[billInstCtrl END]=====//


});
