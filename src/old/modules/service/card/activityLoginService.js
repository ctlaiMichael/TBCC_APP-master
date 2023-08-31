/**
 * [活動登錄 Service]
 */
define([
	"app"
	,"service/formServices"
	,"service/messageServices"
	,"app_telegram/fc000801Telegram"
	,"app_telegram/fc000802Telegram"
]
, function (MainApp) {

//=====[activityLoginService START 活動登錄]=====//
MainApp.register.service("activityLoginService",function(
	$state,i18n
	,formServices,messageServices
	,fc000801Telegram,fc000802Telegram
){
	var MainClass = this;

	//==錯誤訊息設定==//
	var errorCode = {};
	//'請至少勾選一筆活動';
	errorCode['FC0008_001'] = i18n.getStringByTag("CTRL_ACTIVITY.CHECK.CHOUSE");
	errorCode['FC0008_002'] = {
		message : i18n.getStringByTag("CTRL_ACTIVITY.CHECK.SUCCESS"), //'活動登錄成功',
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag("CTRL_ACTIVITY.CHECK.SUCCESS"), //活動登錄失敗
			content : i18n.getStringByTag("CTRL_ACTIVITY.CHECK.SUCCESS"),
			message_type:'success'
		}
	};
	errorCode['FC0008_003'] = {
		message : i18n.getStringByTag("CTRL_ACTIVITY.CHECK.ERROR"), //'活動登錄失敗',
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag("CTRL_ACTIVITY.CHECK.ERROR"), //活動登錄失敗
			content : i18n.getStringByTag("CTRL_ACTIVITY.CHECK.ERROR"),
			btn_list : [{
				name : i18n.getStringByTag("CTRL_ACTIVITY.BTN_HOME") , //返回活動登錄
				sref : "activityLogin"
			}]
		}
	};
	errorCode['FC0008_004'] = {
		message : i18n.getStringByTag("ERROR_MSG.NO_SEARCH"), //'查無資料',
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag("ERROR_MSG.NO_SEARCH"), //查無資料
			content : i18n.getStringByTag("ERROR_MSG.NO_SEARCH")
		}
	};
	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;

	/**
	  * [getActivityList 取得活動清單]
	  * @param  {[type]} telegramObj [儲存的資料]
	  * @param  {[type]} methodObj   [電文結束的method]
	  * @return {[type]}             [description]
	  */
	this.getActivityList = function(telegramObj,getCallBack_method)
	{
		var success = function(jsonObj,resObj)
		{
			if(!jsonObj || typeof jsonObj !== 'object'){
				getCallBack_method(false,resObj);
				return false;
			}

			var activeList = {};
			var activeOptions = {
				0 : [],
				1 : []
			};
			var tmp;
			for (key in jsonObj)
			{
				tmp = jsonObj[key];
				activeList[tmp.activityId] = tmp; //清單
				if(typeof activeOptions[tmp.isRecord] !== 'undefined'){
					//已登/未登活動
					activeOptions[tmp.isRecord].push(tmp);
				}
			}
			var result = {
				activeList : activeList,
				activeOptions : activeOptions
			};
			getCallBack_method(result,resObj);
		}
		//==send==//
		fc000801Telegram.getData(telegramObj,success);
	}

	/**
	  * [getActivityList 活動登錄]
	  * @param  {[type]} telegramObj [儲存的資料]
	  * @param  {[type]} methodObj   [電文結束的method]
	  * @return {[type]}             [description]
	  */
	this.saveActivity = function(telegramObj,endMethod)
	{
		var callBackMethod = function(data,jsonObj)
		{
			if(data){
				var activeRes = {};
				var activeResList = {};
				for (key in data)
				{
					activeRes = data[key];
					activeRes["registerMsg"] = i18n.getStringByTag('CTRL_ACTIVITY.SIGNED_ERROR');
					if(activeRes.registerStatus == '0'){
						activeRes["registerMsg"] = i18n.getStringByTag('CTRL_ACTIVITY.SIGNED_SUCCESS'); //'登錄成功';
						activeRes["registerStatus"] = true;
					}else{
						activeRes["registerStatus"] = false;
					} //'登錄失敗';
					// activeResList.push(activeRes);
					activeResList[activeRes.activityId] = activeRes;
				}
				endMethod(activeResList);
			}else{
				endMethod(false,jsonObj);
			}
		}
		fc000802Telegram.saveData(telegramObj,callBackMethod);
	}

	/**
	 * [checkUploadForm 表單檢查]
	 * @param  {[type]} inp_data  [表單資料]
	 * @return {[type]}           [description]
	 */
	this.checkUploadForm = function(inp_data)
	{
		var data = {
			status : false,
			msg : 'INPUT_ERROR',
			inp : {},
			error_list : {}
		}
		data.inp = inp_data;
		//----------細部檢查----------//
		var inp_key = '';
		var inp_sub_key = [];
		//==identity==//
		inp_key = 'idNo';
		if(typeof data.error_list[inp_key] === 'undefined'){
			result = formServices.checkIdentity(inp_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}

		//==check end==//
		if(Object.keys(data.error_list).length === 0){
			data.status = true;
			data.msg = '';
			return data;
		}
		return data;
	}


});

});