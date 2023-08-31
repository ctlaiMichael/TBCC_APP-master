/**
 * [單筆分期]
 */
define([
	"app"
	,"service/messageServices"
	,'service/formServices'
	,"app_telegram/fc000701Telegram"
	,"app_telegram/fc000702Telegram"
	,"app_telegram/fc000102Telegram"
]
, function (MainApp) {
//=====[singleInstServices START] 單筆分期相關=====//
MainApp.register.service("singleInstServices",function(
	$state,i18n
	,messageServices,formServices
	,fc000701Telegram,fc000702Telegram,fc000102Telegram
){

	var MainClass = this;

	//==錯誤訊息設定==//
	var error_btn = {
		//'返回分期付款列表'
		"menu" : {"name":i18n.getStringByTag("CTRL_INSTALLMENT.BTN.BACK_MENU"),"sref":"select({menu_type:'instSelect'})"},
		//單筆分期
		single : {'name':i18n.getStringByTag('PAGE_TITLE.SINGLEINST'),'sref':'singleInst'}
	};
	var errorCode = {};
	//查無資料 => 查無明細資料
	errorCode['FC0007_001'] = {
		message : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			content : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			btn_list:[error_btn.menu]
		}
	};
	errorCode['FC0007_004'] = i18n.getStringByTag('ERROR_MSG.NO_SEARCH'); //查無資料 => 明細資料消失
	errorCode['FC0007_002'] = i18n.getStringByTag('CTRL_INSTALLMENT.INPUT.CHECK_SELECT');	// 請選擇期數
	errorCode['FC0007_003'] = {
		message : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.ERROR'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.ERROR'),
			content : i18n.getStringByTag('CTRL_INSTALLMENT.MSG.ERROR'),
			btn_list:[error_btn.single]
		}
	};
	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;



	this.getBillOptions = function(return_array){
		var data = billOptions = {
			'1' : {
				name: '6期',
				value: '1',
				min : 3000
			},
			'2' : {
				name: '12期',
				value: '2',
				min : 6000
			}
		};
		if(typeof return_array !== 'object'){
			return_array = false;
		}
		var billOptions;
		if(return_array){
			billOptions = [];
			for(key in return_array){
				if(typeof data[return_array[key]] !== 'undefined'){
					billOptions.push(data[return_array[key]]);
				}
			}
		}else{
			billOptions = data;
		}
		return billOptions;
	}
	this.getSwitchBill = function(selectBill){
		var switchBill = "";
		var data = MainClass.getBillOptions(false);
		if(typeof data[selectBill] !== 'undefined' && typeof data[selectBill].name !== 'undefined'){
			switchBill = data[selectBill].name;
		}
		return switchBill;
	}
	/**
	 * [checkAmount 檢查是否可進行的分期]
	 * @param  {[type]} amount [description]
	 * @return {[type]}        [description]
	 */
	this.checkAmount = function(amount){
		//==不顯示低於3000的金額==//
		// 單筆金額低於3000(不含3000)，不允許進行單筆分期設定，故不顯示於頁面。
		// 單筆金額介於3000~6000，只允許進行六期分期。
		// 單筆金額大於6000(含6000)，允許進行六期與十二期分期設定。
		var billOptions = MainClass.getBillOptions(false);
		var show_bill = [];
		var check_data;
		for(key in billOptions){
			check_data = billOptions[key];
			if(check_data.min && amount < check_data.min){
				continue;
			}
			show_bill.push(key);
		}
		if(show_bill.length < 1){
			return false;
		}
		return show_bill;
	}

	/**
	 * [getBillDetails 單筆分期資料取得]
	 * @param  {[type]} getBillBack [description]
	 * @return {[type]}             [description]
	 */
	this.getBillDetails = function(getBillBack){
		var getBillCallBack = function(success,resultObj){
			var data = [];
			if(success){
				var tmp;
				for(key in resultObj){
					tmp = resultObj[key];
					tmp['show_bill'] = MainClass.checkAmount(tmp.NTDollarAmount);
					if(tmp['show_bill']){
						data.push(tmp);
					}
				}
				getBillBack(data);
			}else{
				getBillBack(false,resultObj);
			}
		}
		fc000701Telegram.getData(getBillCallBack);
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
		var check_list = ['consumptionDate','consumptionAmount','period'];

		for(key in check_list){
			result = formServices.checkEmpty(inp_data[check_list[key]]);
			if(!result.status){
				data.error_list[key] = result.msg;
			}
		}
		//==consumptionAmount==//輸出皆為正整數
		inp_key = 'consumptionAmount';
		if( formServices.checkEmpty(inp_data[inp_key],true)
			 && typeof data.error_list[inp_key] === 'undefined'
		 ){
			result = formServices.checkNumber(inp_data[inp_key],'positive_float');
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}
		//==period==//期數
		inp_key = 'period';
		var bill_option = MainClass.getSwitchBill(inp_data[inp_key],true);
		if(Object.keys(bill_option).length < 1){
			data.error_list[inp_key] = i18n.getStringByTag('CTRL_INSTALLMENT.INPUT.CHECK_SELECT');
			data.msg = 'FC0007_002';
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
				upload_data.txNo = resultObj.txNo;
				var upload_method = function(success,resultObj){
					if(!success){
						endMethod(false,i18n.getStringByTag('CTRL_INSTALLMENT.MSG.UPLOAD_ERROR'));
						//簽名檔上傳失敗=>由召會時處理
						return false;
					}
					endMethod(i18n.getStringByTag('CTRL_INSTALLMENT.MSG.SUCCESS'),resultObj);
				}
				var result = fc000102Telegram.saveData(4,upload_data,upload_method);
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
		fc000702Telegram.sendData(sendData,getCallBack_method);
	}
});
//=====[singleInstServices END]=====//


});