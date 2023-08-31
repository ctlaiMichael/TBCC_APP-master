/**
 * [活動登錄Ctrl]
 */
define([
	'app'
	,'directive/checkDirective'
	,'service/activityLoginService'
	,'directive/activityDirective'
],function(MainApp){
	//=====[activityLoginCtrl START]=====//
MainApp.register.controller('activityLoginCtrl',
function(
	$rootScope,$scope,$element,$compile,i18n
	,activityLoginService
){
	//==預設參數==//
	$scope.type = -1;
	$scope.inp = {};
	$scope.activityDataList = {}; //活動已登未登
	$scope.activityKeyList = {}; //活動清單
	$scope.activityList = null; //當前活動
	/**
	 * [setPage 頁面變換]
	 * @param {[type]} type [description]
	 */
	var steps_set = {
		0 : 'activity-directive',
		1 : 'activity-have-directive',
		2 : 'activity-result-directive'
	};
	$scope.setPage = function(type){
		MainUiTool.setSectionClass('has_subtitle');
		if(typeof $scope.activityDataList[type] !== 'undefined')
		{
			$scope.activityList = $scope.activityDataList[type];
			$scope.type= type;
			// $scope.showBoxStep = type;
			//==menu==//
			$rootScope.showFixBoxFlag = true;
		}else if(type == 2){
			//結果頁
			MainUiTool.setSectionClass('has_subtitle',true);
			$rootScope.showFixBoxFlag = false;
			// activityLoginService.getErrorMsg('FC0008_002');
		}else{
			MainUiTool.openDialog('ERROR:'+type);
			return false;
		}
		var directive_name = steps_set[type];
		if(typeof directive_name !== '' && $element.find(directive_name).length <= 0){
			if(type==0){
				var tmp_html = '<div style="display:block;min-height:110vh;"><'+directive_name+'/></div>';
			}else{
				var tmp_html = '<'+directive_name+'/>';
			}
			
			$element.html($compile(tmp_html)($scope));
		}
	}


	/**
	 * step.1[查詢活動清單資料]
	 **/
	$scope.setQuery = function()
	{
		$scope.inp.idNo = $element.find('input[identity-mask-directive]').data('realvalue').toUpperCase();
		var result;
		//ID檢查
		var result = activityLoginService.checkUploadForm($scope.inp);
		if(!result.status){
			activityLoginService.getErrorMsg(result.msg);
			$scope.error_msg_list = result.error_list;
			return false;
		}

		activityLoginService.getActivityList($scope.inp,function(success,jsonObj)
		{
			if(!success || typeof success !== 'object'
				|| typeof success['activeOptions'] !== 'object'
				|| typeof success['activeList'] !== 'object'
			){
				var tmp_msg = (typeof jsonObj.respCodeMsg !== 'undefined')
								? jsonObj.respCodeMsg
								: '';
				activityLoginService.getErrorMsg('FC0008_004',tmp_msg);
				return false;
			}

			// $element.find('.bc_frame').css('display','none');
			$scope.activityDataList = success['activeOptions'];
			$scope.activityKeyList = success['activeList'];
			//==Menu==// 搬離section
			MainUiTool.showMenu('0',{
				'menu' : {
					0 : i18n.getStringByTag('CTRL_ACTIVITY.MENU_NOT_SIGNED'), //'未登錄活動',
					1 : i18n.getStringByTag('CTRL_ACTIVITY.MENU_SIGNED') //'已登錄活動'
				},
				'event' : function(menu){
					$scope.setPage(menu);
				}
			});
			//預設顯示未登錄活動
			$scope.setPage(0);
		});
	}

	/**
	 * step.2[setConfirm 登錄活動]
	 */
	$scope.setConfirm = function()
	{
		if($scope.type != 0){
			activityLoginService.getErrorMsg('FC0008_001','(STEP_ERROR_0)'); //未選擇未登錄活動
			return false;
		}
		//檢核活動是否勾選
		var checkbox_obj_num = $element.find('#activityCheck input[type=checkbox]:checked').length;
		if(checkbox_obj_num < 1){
			activityLoginService.getErrorMsg('FC0008_001');
			return false;
		}
		//檢核圖形驗證碼是否輸入
		var captchaVal = checkCaptch();
		if(!captchaVal){
			return false;
		}
		var select_data = [];
		var save_data = {};
		for(key in $scope.activityList){
			var tmp = $scope.activityList[key];
			if(tmp.select === true){
				select_data.push(tmp.activityId);
			}
		}
		save_data['custId']=$scope.inp.idNo;
		save_data['captchaVal']=captchaVal;
		save_data['activityDetails'] = {};
		save_data['activityDetails']['activityId'] =select_data;

		activityLoginService.saveActivity(save_data,function(data,jsonObj)
		{
			if(!data || typeof data !== 'object'){
				activityLoginService.getErrorMsg('FC0008_003');
				return false;
			}
			$scope.activityRegDetail = data;
			$scope.setPage(2);
		});
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
			activityLoginService.getErrorMsg('ERROR_CONNECTION');
			return false;
		}
		//==圖形驗證碼==//
		if(!$scope.checkCaptchaData.check_method()){
			activityLoginService.getErrorMsg('CAPTCHA');
			return false;
		}
		return $scope.checkCaptchaData.input;
	}

});
//=====[activityLoginCtrl END]=====//

});
//
