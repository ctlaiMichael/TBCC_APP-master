/**
 * [繳卡費相關]
 */
define([
	"app"
	,"service/formServices"
	,"service/messageServices"
	,"service/brankServices"
	,"app_telegram/fc000401Telegram"
	,"app_telegram/fc000402Telegram"
	,"app_telegram/fc000403Telegram"
]
, function (MainApp) {

//=====[payCardFeeServices START 申請相關]=====//
MainApp.register.service("payCardFeeServices",function(
	$filter,i18n
	// ,$log
	,formServices,messageServices,brankServices
	,fc000401Telegram
	,fc000402Telegram
	,fc000403Telegram
){
	var MainClass = this;
	var byPassageKeyList = {}; //暫存的檢查key

	//==錯誤訊息設定==//
	var error_btn = {
		'qrcode' : {'name':i18n.getStringByTag('PAGE_TITLE.QRCODE4FEE'),'sref':'qrCode4Fee'}
	};
	var errorCode = {};
	//==查無帳單資料==//
	errorCode['FC0004_001'] = {
		message : i18n.getStringByTag('ERROR_CODE.FC0004_001.MESSAGE'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_CODE.FC0004_001.TITLE'),
			content : i18n.getStringByTag('ERROR_CODE.FC0004_001.CONTENT')
		}
	};
	//==查無帳單資料==//
	errorCode['FC0004_002'] = {
		message : i18n.getStringByTag('ERROR_CODE.FC0004_002.MESSAGE'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_CODE.FC0004_002.TITLE'),
			content : i18n.getStringByTag('ERROR_CODE.FC0004_002.CONTENT')
		}
	};
	//==QR Code掃描失敗==//
	errorCode['FC0004_301'] = {
		message : i18n.getStringByTag('ERROR_CODE.FC0004_301.MESSAGE'), //QR Code掃描失敗
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_CODE.FC0004_301.TITLE'), //QR Code掃描失敗
			content : i18n.getStringByTag('ERROR_CODE.FC0004_301.CONTENT'), //QR Code掃描失敗
			btn_list:[error_btn.qrcode]
		}
	};
	//==QR Code掃描取消==//
	errorCode['FC0004_302'] = {
		message : i18n.getStringByTag('ERROR_CODE.FC0004_302.MESSAGE'), //QR Code掃描失敗
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_CODE.FC0004_302.TITLE'), //QR Code掃描失敗
			content : i18n.getStringByTag('ERROR_CODE.FC0004_302.CONTENT'), //您已取消QR Code掃描
			btn_list:[error_btn.qrcode]
		}
	};
	//==QR Code解析失敗==//
	errorCode['FC0004_303'] = {
		message : i18n.getStringByTag('ERROR_CODE.FC0004_303.MESSAGE'), //QR Code掃描失敗
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_CODE.FC0004_303.TITLE'), //QR Code掃描失敗
			content : i18n.getStringByTag('ERROR_CODE.FC0004_303.CONTENT'), //您已取消QR Code掃描
			btn_list:[error_btn.qrcode]
		}
	};
	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;

	/**
	 * [getSetData 表單參數設定]
	 * @param  {[type]} key [取得特定資料]
	 * @return {[type]}     [description]
	 */
	this.getSetData = function(form_type,key,subkey)
	{
		var data = {};
		//通路別
		data.byPassage = {
			1 : i18n.getStringByTag('PAGE_TITLE.PAY_FORM'), //自行輸入繳款
			2 : i18n.getStringByTag('PAGE_TITLE.PAY_LOGIN'), //登入網銀繳款
			3 : i18n.getStringByTag('PAGE_TITLE.QRCODE4FEE') //QR Code繳款
		};
		form_type = parseInt(form_type);
		if(typeof data.byPassage[form_type] === 'undefined'){
			form_type = 1;
		}

		//==表單必填欄位==//
		data.required = {
			'idNo' : true,
			'cardnum' : true, //銷帳編號
			'selectBank' : true, //轉出銀行
			'payAcnt' : true, //轉出帳號
			'payAmt' : true //繳費金額
		};
		switch(form_type){
			case 2:
				data.required.idNo = false;
			break;
			case 3:
				data.required.idNo = false;
			break;
		}

		//繳費方式
		data.paymentType = {
			1 : {
				key : 'payableAmt',
				name : i18n.getStringByTag('CTRL_PAY.INPUT.PAY_ALL') //全額繳清
			},
			2 : {
				key : 'lowestPayableAmt',
				name : i18n.getStringByTag('CTRL_PAY.INPUT.PAY_LOW') //最低金額
			},
			3 : {
				key : '',
				name : i18n.getStringByTag('CTRL_PAY.INPUT.PAY_SELF') //自行輸入
			},
		};

		if(typeof key != 'undefined'){
			if(key === 'post'){
				key = 'area';
			}
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
	 * [getRequireList 欄位設定資料取得]
	 * @return {[type]}           [description]
	 */
	this.getRequireList = function(from_type)
	{
		var required_list = MainClass.getSetData(from_type,'required');
		return required_list;
	}


	/**
	 * [checkForm 表單檢查]
	 * @param  {[type]} form_type [表單類型]
	 * @param  {[type]} set_data  [表單資料]
	 * @return {[type]}           [description]
	 */
	this.checkForm = function(form_type,set_data)
	{
		var data = {
			status : false,
			msg : 'INPUT_ERROR',
			inp : {},
			error_list : {}
		}
		var inp_data = angular.copy(set_data);
		if(typeof inp_data.show === 'undefined'){
			inp_data.show = {};
		}

		var required_list = MainClass.getRequireList(form_type);
		//==檢查空資料==//
		var result;
		data.error_list = {};
		for(key in required_list){
			if(required_list[key]){
				if(key === 'payAmt' || key === 'payAcnt'){
					continue;
				}
				result = formServices.checkEmpty(inp_data[key]);
				if(!result.status){
					// console.log('check empty :'+key);
					data.error_list[key] = result.msg;
				}
			}
		}

		//----------細部檢查----------//
		var inp_key = '';
		var inp_sub_key = [];
		//==identity==//
		inp_key = 'idNo';
		if(required_list[inp_key] && typeof data.error_list[inp_key] === 'undefined'){
			result = formServices.checkIdentity(inp_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}

		//==轉出銀行==//
		inp_key = 'selectBank';
		if(typeof data.error_list[inp_key] === 'undefined'){
			result = brankServices.getData('key_obj',inp_data[inp_key]);
			if(typeof result !== 'object'){
				data.error_list[inp_key] = i18n.getStringByTag('INPUT_MSG.CARD.SELECT_BANK'); //請選擇轉出銀行
			}
		}
		//==select轉出帳號==//
		inp_key = 'selectAcnt';
		if(inp_data['selectBank'] === '006' && form_type === 2
			&& typeof inp_data[inp_key] !== 'undefined'
		){
			result = formServices.checkEmpty(inp_data[inp_key]);
			if(result.status){
				inp_data['payAcnt'] = inp_data[inp_key]; //轉換
			}
		}
		//==轉出帳號==//
		inp_key = 'payAcnt';
		if(typeof data.error_list[inp_key] === 'undefined'){
			result = formServices.checkActNum(inp_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}
		// data.inp[inp_key] = inp_data[inp_key];

		//==繳費金額==//
		if(typeof inp_data['selectAmt'] !== 'undefined'
			&& typeof inp_data['paymentData'] !== 'undefined'
		){
			var tmp = MainClass.getSetData(form_type,'paymentType',parseInt(inp_data['selectAmt']));
			if(tmp && typeof inp_data['paymentData'][tmp['key']] !== 'undefined'){
				inp_data['payAmt'] = inp_data['paymentData'][tmp['key']];
			}
		}
		inp_key = 'payAmt';
		if(typeof data.error_list[inp_key] === 'undefined'){
			//只接受正整數
			result = formServices.checkNumber(inp_data[inp_key],"positive");
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}else{
				data.inp.payAmt = inp_data['payAmt'];
			}
		}

		//==銷帳編號==//
		inp_key = 'cardnum';
		result = formServices.checkPaymentId(inp_data[inp_key]);
		if(!result.status  && Object.keys(data.error_list).length <= 1){
			data.error_list[inp_key] = result.msg;
			data.msg = result.msg;
		}

		//==check end==//
		if(Object.keys(data.error_list).length === 0){
			data.status = true;
			data.msg = '';
			data.inp = inp_data;
			return data;
		}
		return data;
	}

	/**
	 * [getCardNum 銷帳編號轉換]
	 * @param  {[type]} custId [description]
	 * @return {[type]}        [description]
	 */
	this.getCardNum = function(custId){
		var data = {
			status : false,
			msg : '',
			data : ''
		}
		var result = formServices.checkIdentity(custId);
		if(!result.status){
			return result;
		}
		data.data = $filter('paymentIdFilter')(result.data);
		data.status = true;
		data.msg = '';

		return data;
	}


	/**
	 * [getByPassageKey 檢驗通路別key]
	 * @return {[type]} [description]
	 */
	this.getByPassageKey = function(byPassage){
		var make_random = function(){
			return Math.floor((1 + Math.random()) * 0x10000).toString(16);
		}
		var key = make_random() + byPassage + make_random();
		byPassageKeyList[byPassage] = key;
		return byPassageKeyList[byPassage];
	}

	/**
	 * [checkByPassage 檢驗通路別key]
	 * @param  {[type]} set_data [參數判斷]
	 * @return {[type]}          [description]
	 */
	this.checkByPassage = function(set_data){
		var data = {
			status : false,
			msg : '',
			byPassage : 1,
			paymentData : {},
			title : ''
		};
		// console.log(set_data);
		var check_byPassage = MainClass.getSetData(set_data.byPassage,'byPassage',set_data.byPassage);
		if(!check_byPassage || typeof set_data.paymentData === 'undefined'
			|| typeof set_data.check_key === 'undefined'
		){
			data.title = MainClass.getSetData(1,'byPassage',1);
			return data;
		}
		data.title = check_byPassage;
		data.byPassage = set_data.byPassage;
		//==check_key 檢查==//
		if(typeof byPassageKeyList[data.byPassage] === 'undefined'
			|| typeof set_data.check_key === 'undefined'
			|| byPassageKeyList[data.byPassage] !== set_data.check_key
		){
			data.msg = i18n.getStringByTag('INPUT_CHECK.STEP_ERROR'); //請依照正常步驟執行!
			return data;
		}
		delete byPassageKeyList[data.byPassage]; //用過就刪了

		//==paymentData 檢查==//
		var result;
		var check_flag = true;
		var inp_key;
		var tmp_data;
		var chekc_list = ['payableAmt','lowestPayableAmt','cardnum'];
		for(key in chekc_list){
			tmp_data = chekc_list[key];
			result = formServices.checkEmpty(set_data.paymentData[tmp_data]);
			if(!result.status){
				check_flag = false;
			}
		}
		if(!check_flag){
			data.msg = i18n.getStringByTag('INPUT_CHECK.STEP_ERROR')+'(2)'; //請依照正常步驟執行!
			return data;
		}
		//==金額檢查==//
		tmp_data = 'payableAmt';
		result = formServices.checkNumber(set_data.paymentData[tmp_data],'positive_float');
		if(!result.status){
			data.msg = result.msg;
			return data;
		}
		tmp_data = 'lowestPayableAmt';
		result = formServices.checkNumber(set_data.paymentData[tmp_data],'positive_float');
		if(!result.status){
			data.msg = result.msg;
			return data;
		}
		//==強制轉正整數==//
		data.paymentData.payableAmt = parseInt(set_data.paymentData.payableAmt);
		data.paymentData.lowestPayableAmt = parseInt(set_data.paymentData.lowestPayableAmt);

		//==銷帳編號==//
		tmp_data = 'cardnum';
		result = formServices.checkPaymentId(set_data.paymentData[tmp_data]);
		if(!result.status){
			data.msg = result.msg;
			return data;
		}
		data.cardnum = result.data;
		data.status = true;
		data.msg = '';
		return data;
	}

	/**
	 * [getPayAmt 信用卡本期帳單查詢]
	 * @param  {[type]} custId             [description]
	 * @param  {[type]} getCallBack_method [description]
	 * @return {[type]}                    [description]
	 */
	this.getPayAmt = function(custId,set_method){
		// custId:由fc000403Telegram自行自sysCtrl取得
		var getCallBack_method = function(success,resultObj,resultHeader){
			// console.log(resultHeader);
			var result = MainClass.getCardNum(resultHeader.custId); //由header取得custId
			if(!result.status){
				resultObj.respCodeMsg += '[ERROR]'+i18n.getStringByTag('FIELD.PAYMENT_ID');
				set_method(false,resultObj);
				return false;
			}
			var cardnum = result.data;
			result = formServices.checkPaymentId(cardnum);
			if(!result.status){
				resultObj.respCodeMsg += '[ERROR]'+i18n.getStringByTag('FIELD.PAYMENT_ID');
				set_method(false,resultObj);
				return false;
			}else{
				resultObj.cardnum = result.data;
				set_method(success,resultObj);
				return true;
			}
		}
		fc000403Telegram.getPayAmt('',getCallBack_method);
	}

	/**
	 * [getAcntData 取得本人本行帳戶]
	 * @param  {[type]} custId             [description]
	 * @param  {[type]} getCallBack_method [description]
	 * @return {[type]}                    [description]
	 */
	this.getAcntData = function(getCallBack_method){
		fc000402Telegram.getAcntData(getCallBack_method);
	}

	/**
	 * [sendData 繳卡費]
	 * @param  {[type]} sendData        [description]
	 * @param  {[type]} sendData_method [description]
	 * @return {[type]}                 [description]
	 */
	this.sendData = function(sendData,sendData_method){
		var result = MainClass.checkForm(sendData.byPassage,sendData);
		if(!result.status){
			return result;
		}
		//==銷帳編號反解==//
		if(sendData.byPassage !== 1
			 && ( typeof sendData.idNo === 'undefined' || sendData.idNo === '')
		){
			sendData.idNo = $filter('paymentIdDecodeFilter')(sendData.cardnum);
			if(sendData.idNo === sendData.cardnum){
				// $log.debug('change_id:'+sendData.idNo);
				sendData.idNo = ''; //反解失敗
			}
			// result = formServices.checkIdentity(sendData.idNo);
			// if(!result.status){
			// 	return result;
			// }
			// $log.debug('change_id:'+sendData.idNo);
		}
		fc000401Telegram.sendData(sendData,sendData_method);
		return {
			status: true,
			msg : ''
		};
	}

});
//=====[payCardFeeServices END]=====//



});