/**
 * [帳單分期]
 */
define([
	"app"
	,"service/messageServices"
	,"service/formServices"
	,"app_telegram/fc000901Telegram"
	,"app_telegram/fc000102Telegram"
]
, function (MainApp) {

//=====[billServices START 帳單分期相關]=====//
MainApp.register.service("billServices",function(
	i18n
	,messageServices,formServices
	,fc000901Telegram,fc000102Telegram
){
	var MainClass = this;

	//==錯誤訊息設定==//
	var error_btn = {
		//'返回分期付款列表'
		"menu" : {"name":i18n.getStringByTag("CTRL_INSTALLMENT.BTN.BACK_MENU"),"sref":"select({menu_type:'instSelect'})"},
		//帳單分期
		bill : {'name':i18n.getStringByTag('PAGE_TITLE.BILLINST'),'sref':'billInst'}
	};
	var errorCode = {};
	errorCode['FC0009_001'] = {
		message : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			content : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			btn_list:[error_btn.menu]
		}
	};
	errorCode['FC0009_002'] = i18n.getStringByTag('CTRL_INSTALLMENT.INPUT.CHECK_SELECT');	// 請選擇期數
	errorCode['FC0009_003'] = {
		message : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.ERROR'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.ERROR'),
			content : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.ERROR'),
			btn_list:[error_btn.bill]
		}
	};
	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;


	this.getBillOptions = function(return_array){
		var data = {
			'6' : {
				name: '6期/年利率10%',
				value: '6',
				avg : 6
			},
			'12' : {
				name: '12期/年利率11%',
				value: '12',
				avg : 12
			},
			'18' : {
				name: '18期/年利率13%',
				value: '18',
				avg : 18
			},
			'24' : {
				name: '24期/年利率14%',
				value: '24',
				avg : 24
			}
		};
		if(typeof return_array === 'undefined'){
			return_array = false;
		}
		var billOptions;
		if(return_array){
			billOptions = [];
			for(key in data){
				if(typeof data[key] !== 'undefined'){
					billOptions.push(data[key]);
				}
			}
		}else{
			billOptions = data;
		}
		return billOptions;
	}
	this.getSwitchBill = function(selectBill,show_type){
		if(typeof show_type === 'undefined'){
			show_type = false;
		}
		var switchBill = (show_type) ? {} : "";
		var data = MainClass.getBillOptions(false);
		if(typeof data[selectBill] !== 'undefined' && typeof data[selectBill].name !== 'undefined'){
			switchBill = (show_type) ? data[selectBill] : data[selectBill].name;
		}
		return switchBill;
	}

	/**
	 * [getBillAvg 分期資料]
	 * @param  {[type]} option [分期key]
	 * @param  {[type]} amount [可分期金額]
	 * @return {[type]}        [description]
	 */
	this.getBillAvg = function(option,amount){
		var data = {};
		data.list = [];
		var bill_option = MainClass.getSwitchBill(option,true);
		if(Object.keys(bill_option).length < 1){
			return data;
		}

		data.avg = Math.floor(amount / bill_option.avg);
		data.remainder = amount % bill_option.avg;
		data.first = data.avg;
		//==如除不盡則加入首期==//
		if(data.remainder !== 0){
			data.first = data.avg + data.remainder;
			data.list.push(data.first);
		}
		data.list.push(data.avg);
		data.check = data.first + (data.avg * (bill_option.avg-1));
		return data;
	}

	/**
	 * [checkData 資料檢查]
	 * @param  {[type]} inp_data [description]
	 * @return {[type]}          [description]
	 */
	this.checkData = function(inp_data)
	{
		var data = {
			result : false,
			msg : 'INPUT_ERROR',
			error_list : {}
		};
		var result;
		var inp_key;
		var check_list = ['payableAmt','selectBill'];
		for(key in check_list){
			result = formServices.checkEmpty(inp_data[check_list[key]]);
			if(!result.status){
				data.error_list[key] = result.msg;
			}
		}
		//==trnsfrAmount==//輸出皆為正整數
		inp_key = 'payableAmt';
		if( formServices.checkEmpty(inp_data[inp_key],true)
			 && typeof data.error_list[inp_key] === 'undefined'
		 ){
			result = formServices.checkNumber(inp_data[inp_key],'positive_float');
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}
		inp_key = 'selectBill';
		var bill_option = MainClass.getSwitchBill(inp_data[inp_key],true);
		if(Object.keys(bill_option).length < 1){
			data.error_list[inp_key] = i18n.getStringByTag('CTRL_INSTALLMENT.INPUT.CHECK_SELECT');
			data.msg = 'FC0009_002';
		}
		//==check end==//
		if(Object.keys(data.error_list).length === 0){
			data.status = true;
			data.msg = '';
			return data;
		}
		return data;
	}

	this.sendData = function(sendData,endMethod){
		var getCallBack_method = function(success,resultObj){
			if (success){
				var upload_data = (typeof sendData.upload_image !== 'undefined')
								? sendData.upload_image
								: {};
				var upload_method = function(success,resultObj){
					if(!success){
						endMethod(false,i18n.getStringByTag('CTRL_INSTALLMENT.MSG.UPLOAD_ERROR'));
						//簽名檔上傳失敗=>由召會時處理
						return false;
					}
					endMethod(i18n.getStringByTag('CTRL_INSTALLMENT.MSG.SUCCESS'));
				}
				upload_data.txNo = resultObj.txNo;
				var result = fc000102Telegram.saveData(3,upload_data,upload_method);
				if(!result.status){
					endMethod(false,result.msg);
					return false;
				}
			}else{
				endMethod(false,resultObj.respCodeMsg);
				return false;
			}
		}
		var result = MainClass.checkData(sendData);
		if(!result.status){
			endMethod(false,result.msg);
			// MainClass.getErrorMsg('INPUT_ERROR');
			return false;
		}
		fc000901Telegram.getData(sendData,getCallBack_method);
	}
});
//=====[activateCardServices END]=====//



});