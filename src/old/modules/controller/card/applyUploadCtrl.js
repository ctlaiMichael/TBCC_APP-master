/**
 * [申請信用卡-補件上傳Ctrl]
 * applyUploadCtrl : 卡片申請
 */
define([
	'app'
	//==Directive==//
	,'directive/applyDirective'
	,'directive/imageUploadDirective'
	,'directive/checkDirective'
	//==Services==//
	,'service/applyServices'
	,'service/uploadServices'
],function(MainApp){

/**
 * [applyUploadCtrl] 卡片申請
 * @param  {[type]} $scope			[description]
 * @param  {[type]} $state			[description]
 */
MainApp.register.controller('applyUploadCtrl'
, function(
	$scope,$state,$stateParams,$compile,$element,i18n
	,uploadServices,applyServices,uploadSaveServices
){
	MainUiTool.setSectionClass('has_subtitle'); //section add class : 有大副標或者步驟列時使用的框架樣式
	//==變數設定==//
	$scope.apply_menu = 'upload'; //submenu on active
	$scope.inp = {};
	$scope.showBoxStep = 1;
	$scope.haveBox = {
		'search' : 1
	}
	$scope.upload_range = uploadServices.getApplySetData('upload_range');

	//==Menu==// 搬離section
	MainUiTool.showMenu($scope.apply_menu,{
		'menu' : {
			'apply' : i18n.getStringByTag('CTRL_APPLY.APPLY_MENU'),
			'upload' : i18n.getStringByTag('PAGE_TITLE.UPLOAD')
		},
		'event' : function(menu){
			$state.go(menu);
		}
	});


	//==step 2. 查詢案件==//
	$scope.stepChangeToUpload = function()
	{
		$scope.error_msg_list = {};
		$scope.inp.idNo = $element.find('input[identity-mask-directive]').data('realvalue');

		var result;

		result = uploadServices.checkUploadForm($scope.inp);
		if(!result.status){
			uploadServices.getErrorMsg(result.msg);
			$scope.error_msg_list = result.error_list;
			return false;
		}
		var captchaVal = checkCaptch();
		if(!captchaVal){
			return false;
		}

		var save_data = $scope.inp;
		save_data.captchaVal = captchaVal;

		result = uploadSaveServices.getUploadCase(save_data,function(check,jsonObject)
		{
			if(check){
				if(jsonObject.length < 1){
					uploadServices.getErrorMsg('FC0002_002');
				}else{
					$scope.apply_case_list = jsonObject;
					createImageUpload();
				}
			}else{
				var tmp_msg = (typeof jsonObject.respCodeMsg !== 'undefined')
								? jsonObject.respCodeMsg
								: '';
				uploadServices.getErrorMsg('FC0002_001',tmp_msg);
				return false;
			}
		});
		if(!result.status){
			uploadServices.getErrorMsg(result.msg);
			return false;
		}
	}

	var createImageUpload = function(){
		//==圖片資料設定==//
		$scope.imageUploadSet = {};
		$scope.imageUploadSet.list = applyServices.getApplySetData('upload');
		$scope.imageUploadSet.show_captcha = true;
		$scope.imageUploadSet.button_row = {
			'btn1' : {
				name : '上傳',
				success: uploadSend
			}
		};

		//==圖片tag產生==//
		var step = 2;
		var directive_name = 'image-upload-directive';
		var box_size = Object.keys($scope.haveBox).length + 1;
		if(typeof directive_name !== 'undefined'
			&& typeof $scope.haveBox[directive_name] === 'undefined')
		{
			if(step !== box_size){
				uploadServices.getErrorMsg('STEP_ERROR');
				return false;
			}
			$scope.haveBox[directive_name] = step;
			var tmp_html = '<div class="step_box step'+step+'"><'+directive_name+'/></div>';
			$element.append($compile(tmp_html)($scope));
			box_size++;
		}
		if(box_size < step){
			uploadServices.getErrorMsg('STEP_ERROR');
			return false;
		}
		$scope.showBoxStep = step;
		$element.find('.step_box').css('display','none');
		$element.find('.step_box.step'+step).css('display','block');

		MainUiTool.setSectionClass('pic_upload');
		//這行在補件上傳功能會隱藏標題"財力證明"，當初也不知道怎麼加的，所以先移除
		//MainUiTool.setSectionClass('has_subtitle',true);
	}


	//==step 3. 檢查==//
	var uploadSend = function(){
		if(Object.keys($scope.imageUploadData).length < 1){
			applyServices.getErrorMsg('FC0001_002');
			return false;
		}
		//==判斷身分證必上傳兩張==//
		if(typeof $scope.imageUploadData.identity !== 'undefined'
		 && $scope.imageUploadData.identity.length !== $scope.imageUploadSet.list.identity.max_num
		){
			applyServices.getErrorMsg('FC0001_003');
			return false;
		}
		var captchaVal = checkCaptch();
		if(!captchaVal){
			return false;
		}
		//==send==//
		var save_data = applyServices.modifyUploadData($scope.imageUploadData);
		save_data.txNo = $scope.apply_case_list;
		save_data.captchaVal = captchaVal;
		var result = uploadSaveServices.saveUploadData(save_data);
		if(!result.status){
			uploadServices.getErrorMsg(result.msg);
			return false;
		}
		return true;
	}

	/**
	 * [checkCaptch 驗證檢查]
	 * @return {[type]} [description]
	 */
	var checkCaptch = function(){
		//==使用captchaDirective::checkCaptchaDirective即會產生==//
		if(typeof $scope.checkCaptchaData === 'undefined'
			|| typeof $scope.checkCaptchaData.check_method !== 'function'
		){
			uploadServices.getErrorMsg('ERROR_CONNECTION');
			return false;
		}
		//==圖形驗證碼==//
		if(!$scope.checkCaptchaData.check_method()){
			uploadServices.getErrorMsg('CAPTCHA');
			return false;
		}
		return $scope.checkCaptchaData.input;
	}



});
//=====[applyUploadCtrl END]=====//




});