/**
 * [開卡/掛失 Service]
 */
define([
	"app"
	,"service/formServices"
	,"service/cardServices"
	,"service/messageServices"
	,"app_telegram/fc000501Telegram"
	,"app_telegram/fc000601Telegram"
	,"app_telegram/fc000602Telegram"
]
, function (MainApp) {

//=====[activateCardServices START 申請相關]=====//
MainApp.register.service("activateCardServices",function(
	$state,i18n,$filter
	,formServices,cardServices,messageServices
	,fc000501Telegram,fc000601Telegram,fc000602Telegram
){
	var MainClass = this;

	//==錯誤訊息設定==//
	var errorCode = {};
	//開卡成功
	errorCode['FC0005_001'] = {
		message : i18n.getStringByTag('CTRL_OPEN_CARD.SUCCESS'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('CTRL_OPEN_CARD.SUCCESS'),
			content : i18n.getStringByTag('CTRL_OPEN_CARD.SUCCESS'),
			message_type:'success'
		}
	};
	//開卡失敗
	errorCode['FC0005_002'] = {
		message : i18n.getStringByTag('CTRL_OPEN_CARD.ERROR'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('CTRL_OPEN_CARD.ERROR'),
			content : i18n.getStringByTag('CTRL_OPEN_CARD.ERROR')
		}
	};
	//請選擇卡片
	errorCode['FC0006_001'] = {
		message : i18n.getStringByTag('ERROR_CODE.FC0006_001.MESSAGE'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_CODE.FC0006_001.TITLE'),
			content : i18n.getStringByTag('ERROR_CODE.FC0006_001.CONTENT')
		}
	};
	//掛失申請失敗
	errorCode['FC0006_002'] = {
		message : i18n.getStringByTag('CTRL_LOST_CARD.ERROR'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('CTRL_LOST_CARD.ERROR'),
			content : i18n.getStringByTag('CTRL_LOST_CARD.ERROR')
		}
	};
	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;

	/**
	 * [getActiveSetData 開卡資料設定]
	 * @param  {[type]} key [取得特定資料]
	 * @return {[type]}     [description]
	 */
	this.getActiveSetData = function(key,subkey){
		var data = {};
		//==表單必填欄位==//
		data.required = {
			'idNo' : true,
			'cardNum' : true,
			'ymData' : true,
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
	/**
	 * [getApplySetData 掛失資料設定]
	 * @param  {[type]} key [取得特定資料]
	 * @return {[type]}     [description]
	 */
	this.getLostSetData = function(key,subkey,form_type){

		var data = {};
		//==表單必填欄位==//
		data.required = {
			'idNo' : true,
			'birthday' : true
		};
		if(form_type){
			data.required.creditCardType = true;		//信用卡類別
			data.required.creditCardNO = true;			//信用卡號碼
			data.required.cardType = true;				//正附卡類型
			data.required.replaceCard = true;			//是否補發卡片
			data.required.branchId = true;				//分行代碼
			data.required.captchaVal = true;			//圖形驗證碼的值
		}

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

	/**
	 * [checkActivateForm 開卡表單檢查]
	 * @param  {[type]} user_type [使用者類型]
	 * @param  {[type]} inp_data  [表單資料]
	 * @return {[type]}           [description]
	 */
	this.checkActivateForm = function(inp_data)
	{
		var data = {
			status : false,
			msg : 'INPUT_ERROR',
			inp : {},
			error_list : {}
		}
		data.inp = inp_data;
		var required_list = MainClass.getActiveSetData('required');
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
	 * [checkApplyLost 掛失表單檢查]
	 * @param  {[type]} inp_data  [表單資料]
	 * @param  {[type]} form_type [表單類型]
	 * @return {[type]}           [description]
	 */
	this.checkApplyLost = function(inp_data,form_type)
	{
		var data = {
			status : false,
			msg : 'INPUT_ERROR',
			inp : {},
			error_list : {}
		}
		data.inp = inp_data;
		if(typeof data.inp.show === 'undefined'){
			data.inp.show = {};
		}
		var required_list = MainClass.getLostSetData('required','',form_type);
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
		inp_key = 'birthday';
		if(typeof data.error_list[inp_key] === 'undefined'){
			result = formServices.checkDate(inp_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}
		//==表單二==//
		if(form_type)
		{

		}

		//==check end==//
		if(Object.keys(data.error_list).length === 0){
			data.status = true;
			data.msg = '';
			return data;
		}
		return data;
	}

	// var getCallBack_method = function(success,resultObj){
	// 	getCallBack_method(success,resultObj);
	// }

	/**
	 * [getResult 開卡結果]                  [description]
	 */
	this.getResult = function(sendData,getCallBack_method){
		fc000501Telegram.getResult(sendData,getCallBack_method);
	}
	/**
	 * [getCardData 取得可掛失卡片資料]
	 * @param  {[type]} sendData           [description]
	 * @param  {[type]} getCallBack_method [description]
	 * @return {[type]}                    [description]
	 */
	this.getCardData = function(sendData,getCallBack_method){
		var callBackMethod = function(successObj,jsonObj,headerObj){
			var data = {
				status : false,
				msg : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
				msg_content : i18n.getStringByTag('ERROR_MSG.NO_SEARCH')
			};
			if(!successObj || typeof successObj !== 'object'){
				data.msg_content = i18n.getStringByTag('ERROR_MSG.NO_SEARCH')+'<br>'+jsonObj.respCodeMsg;
				getCallBack_method(false , data);
				return false;
			}
			//==succss==//
			var cardList = {};
			var options = [];
			var cardData;
			var tmp;
			var card_type = {
				'0' : i18n.getStringByTag('FIELD.CARD.TYPE_NOT_OWNER'),
				'1' : i18n.getStringByTag('FIELD.CARD.TYPE_OWNER')
			};
			for (var key in successObj){
				tmp = successObj[key];
				//==正附卡處理==//
				if(typeof card_type[tmp.cardType] === 'undefined'){
					tmp.cardType = '0';
				}
				tmp['cardTypeName'] = card_type[tmp.cardType]; //正附卡
				//信用卡遮罩
				tmp.name = "["+tmp['cardTypeName']+"]"
							+$filter('accountMaskFilter')(tmp.creditCardNO);
				tmp.show_detail = false;
				cardData = cardServices.getCardData(tmp.creditCardType);
				if(typeof cardData === 'object' && Object.keys(cardData).length > 0){
					tmp.show_detail = cardData;
					//==有圖資料==//
					tmp.name = angular.copy(cardData.name);
					if (!tmp.name.startsWith("["+tmp['cardTypeName']+"]")){
						tmp.name = "["+tmp['cardTypeName']+"]"+tmp.name;
					}
				}
				cardList[tmp.creditCardType] = tmp;
				options.push(tmp);
			}
			data.status = true;
			data.msg = '';
			data.msg_content = '';
			getCallBack_method({
				'cardList' : cardList,
				'options' : options
			} , data);
			return true;
		}
		fc000601Telegram.getCardData(sendData,callBackMethod);
	}

	/**
	 * [sendData 掛失申請]
	 * @param  {[type]} sendData           [description]
	 * @param  {[type]} getCallBack_method [description]
	 */
	this.sendData = function(sendData,getCallBack_method){
		fc000602Telegram.sendData(sendData,getCallBack_method);
	}
	/**
	 * [checkApplyLost 表單檢查]
	 * @param  {[type]} user_type [使用者類型]
	 * @param  {[type]} inp_data  [表單資料]
	 * @return {[type]}           [description]
	 */
	this.changeNum = function(data){
		if (data.length==1){
			data = "0"+data;
		}
		return data;
	}
});
//=====[activateCardServices END]=====//



});