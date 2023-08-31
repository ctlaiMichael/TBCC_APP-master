/**
 * [信用卡申請-補件上傳]
 */
define([
	"app"
	,"service/formServices"
	,"service/messageServices"
	,"app_telegram/fc000102Telegram"
	,"app_telegram/fc000201Telegram"
]
, function (MainApp) {

//=====[uploadServices START 申請相關]=====//
MainApp.register.service("uploadServices",function(
	$state,i18n
	,formServices,messageServices
){
	var MainClass = this;
	var uploadRange = 7; //補件上傳天數範圍

	var errorCode = {};
	var error_btn = {
		'apply' : {'name':i18n.getStringByTag('PAGE_TITLE.APPLY'),'sref':'apply'},
		'upload' : {'name':i18n.getStringByTag('PAGE_TITLE.UPLOAD'),'sref':'upload'}
	};
	//----[補件上傳 儲存錯誤]----//
	//申請案件查詢失敗
	errorCode['FC0002_001'] = {
		message :  i18n.getStringByTag('ERROR_CODE.FC0002_001.MESSAGE'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title: i18n.getStringByTag('ERROR_CODE.FC0002_001.TITLE'),
			content: i18n.getStringByTag('ERROR_CODE.FC0002_001.CONTENT'),
			btn_list:[error_btn.upload]
		}
	};
	errorCode['FC0002_002'] = {
		message : i18n.getStringByTag('ERROR_CODE.FC0002_002.MESSAGE'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_CODE.FC0002_002.TITLE'),
			content : i18n.getStringByTag('ERROR_CODE.FC0002_002.CONTENT_1')
						+uploadRange
						+i18n.getStringByTag('ERROR_CODE.FC0002_002.CONTENT_2')
						,
			// content:'目前查無您於'+uploadRange+'天內的申請案件，請您重新申辦。',
			btn_list:[error_btn.apply]
		}
	};
	//文件上傳失敗
	errorCode['FC0002_003'] = {
		message : i18n.getStringByTag('ERROR_CODE.FC0002_003.MESSAGE'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_CODE.FC0002_003.TITLE'),
			content: i18n.getStringByTag('ERROR_CODE.FC0002_003.CONTENT'),
			btn_list:[error_btn.upload]
		}
	};
	//文件上傳完成
	errorCode['FC0002_004'] = {
		message : i18n.getStringByTag('ERROR_CODE.FC0002_004.MESSAGE'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_CODE.FC0002_004.TITLE'),
			content: i18n.getStringByTag('ERROR_CODE.FC0002_004.CONTENT'),
			message_type:'success'
		}
	};
	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;


	/**
	 * [getApplySetData 申請表單資料設定]
	 * @param  {[type]} key [取得特定資料]
	 * @return {[type]}     [description]
	 */
	this.getApplySetData = function(key)
	{
		var data = {};
		//==補件上傳天數==//
		data.upload_range = uploadRange;

		if(typeof key != 'undefined'){
			data = (typeof data[key] != 'undefined')
					? data[key]
					: {};
		}
		return data;
	}

	/**
	 * [checkUploadForm 補件上傳表單檢查]
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
//=====[uploadServices END]=====//

//=====[uploadSaveServices START 申請相關]=====//
MainApp.register.service("uploadSaveServices",function(
	$state,uploadServices
	,fc000201Telegram,fc000102Telegram
){

	 /**
	  * [getUploadCase 取得補件上傳清單]
	  * @param  {[type]} telegramObj [儲存的資料]
	  * @param  {[type]} methodObj   [電文結束的method]
	  * @return {[type]}             [description]
	  */
	this.getUploadCase = function(telegramObj,methodObj)
	{
		var data = {
			status : false,
			msg : 'FC0002_001'
		}
		var inp_data = {};

		var result;

		//==表單檢查==//
		result = uploadServices.checkUploadForm(telegramObj);
		if(!result.status){
			data.msg = result.msg;
			return data;
		}
		//==send==//
		result = fc000201Telegram.getData(telegramObj,methodObj);
		//==送電文前的檢查異常==//
		if(!result.status){
			data.msg = 'FC0002_001';
			return data;
		}

		data.status = true;
		data.msg = '查詢請求已送出';
		return data;
	}


	/**
	 * [saveUploadData description]
	 * @param  {[type]} set_data  [儲存的資料]
	 *                   upload_image 儲存的圖片資料
	 * @return {[type]}           [description]
	 */
	this.saveUploadData = function(set_data)
	{
		var data = {
			status : false,
			msg : 'FC0002_003'
		}
		var inp_data = {};

		var result;

		//==參數設定==//
		var save_data = set_data;
		//==method==//
		var upload_method = function(success,resultObj){
			if(!success){
				uploadServices.getErrorMsg('FC0002_003');
				return false;
			}
			uploadServices.getErrorMsg('FC0002_004');
			return true;
		}
		var result = fc000102Telegram.saveData(2,save_data,upload_method);
		//==送電文前的檢查異常==//
		if(!result.status){
			uploadServices.getErrorMsg('FC0002_003',result.msg);
			return data;
		}
		data.status = true;
		data.msg = '申請請求已送出';
		return data;
	}
	//==saveData end==//
});
//=====[uploadSaveServices END]=====//



});