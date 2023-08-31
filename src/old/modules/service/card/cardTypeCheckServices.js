/**
 * [信用卡申請]
 */
define([
	"app"
	,"service/messageServices"
	,"service/cardServices"
	,"service/formServices"
]
, function (MainApp) {

//=====[cardTypeCheckServices START]=====//
MainApp.register.service("cardTypeCheckServices",function(
	i18n,$log,messageServices,formServices,cardServices
){
	var error_btn = {
		'apply' : {'name':i18n.getStringByTag('PAGE_TITLE.APPLY'),'sref':'apply'},
		'upload' : {'name':i18n.getStringByTag('PAGE_TITLE.UPLOAD'),'sref':'upload'}
	};
	errorCode={};
	errorCode['FC0013_001'] = { //身分驗證失敗，請重新選擇申辦方式。
		message :  i18n.getStringByTag('ERROR_CODE.FC0013_001.MESSAGE'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title: i18n.getStringByTag('ERROR_CODE.FC0013_001.TITLE'),
			content: i18n.getStringByTag('ERROR_CODE.FC0013_001.CONTENT'),
			btn_list:[error_btn.apply]
		}
	};
	errorCode['FC0013_002'] = { //系統連線逾時，身分驗證失敗，請重新輸入。
		message :  i18n.getStringByTag('ERROR_CODE.FC0013_001.MESSAGE'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title: i18n.getStringByTag('ERROR_CODE.FC0013_001.TITLE'),
			content: i18n.getStringByTag('ERROR_CODE.FC0013_002.CONTENT'),
			btn_list:[error_btn.apply]
		}
	};
	errorCode['FC0013_003'] = { //身分驗證失敗，驗證之卡片需持卡6個月，請重新輸入。
		message :  i18n.getStringByTag('ERROR_CODE.FC0013_001.MESSAGE'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title: i18n.getStringByTag('ERROR_CODE.FC0013_001.TITLE'),
			content: i18n.getStringByTag('ERROR_CODE.FC0013_003.CONTENT'),
			btn_list:[error_btn.apply]
		}
	};




	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;




	var MainClass = this;
	/**
	 * [checkActivateForm 開卡表單檢查]
	 * @param  {[type]} user_type [使用者類型]
	 * @param  {[type]} inp_data  [表單資料]
	 * @return {[type]}           [description]
	 */
	this.checkForm = function(inp_data)
	{
		var data = {
			status : false,
			msg : 'INPUT_ERROR',
			inp : {},
			error_list : {}
		}
		data.inp = inp_data;

		var required_list = MainClass.getSetData('required');
		//==檢查空資料==//
		var result;
		data.error_list = {};
		for(key in required_list){
			if(required_list[key]){
				result = formServices.checkEmpty(inp_data[key]);
				if(!result.status){
					data.error_list[key] = result.msg;
				}
			}
		}

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
		inp_key = 'cardNum';
		if(typeof data.error_list[inp_key] === 'undefined'){
			result = formServices.checkCardNum(inp_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}
		inp_key = 'ymData';
		if(typeof data.error_list[inp_key] === 'undefined'){
			result = formServices.checkYmData(inp_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}else{
				data.inp[inp_key] = result.data.formate;
			}
		}
		inp_key = 'checkCode';
		if(typeof data.error_list[inp_key] === 'undefined'){
		
			result = formServices.checkCardCode(inp_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}
		inp_key = 'birthday';
		if(typeof data.error_list[inp_key] === 'undefined'){
			result = formServices.checkDate(inp_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}else{
				//==重新調整資料==//
				data.inp[inp_key] = result.formate;
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




	/**
	 * [getSetData 以卡辦卡資料設定]
	 * @param  {[type]} key [取得特定資料]
	 * @return {[type]}     [description]
	 */
	this.getSetData = function(key,subkey){
		var data = {};
		//==表單必填欄位==//
		data.required = {
			'idNo' : true,
			'cardNum' : true,
			'ymData' : true,
			'checkCode' : true,
			'birthday' : true
		};

		if(typeof key != 'undefined'){
			data = (typeof data[key] != 'undefined')
					? data[key]
					: {};
			if(typeof subkey !== 'undefined'){
				data = (typeof data[subkey] !== 'undefined')
						? data[subkey]
						: false;
			}
		}
		return data;
	}

});
//=====[applyServices END]=====//



});