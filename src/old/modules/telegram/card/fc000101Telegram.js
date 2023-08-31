define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000101Telegram START 申請信用卡儲存]=====//
MainApp.register.service("fc000101Telegram",function(telegramServices)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000101';


	this.saveData = function(save_data,endMethod)
	{
		var set_telegram = {};

		//==電文end==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(jsonObj){
				endMethod(jsonObj.txNo);
			}
			set_telegram.error = function(jsonObj){
				endMethod(false,jsonObj);
			}
		}

		//==必要值檢查==//
		var check_list = ['creditCardType','applyUserType','idNo','cnName','email','mobile','birthday','elemSchool'];
		var tmp_data;
		for(key in check_list){
			tmp_data = check_list[key];
			if(typeof save_data[tmp_data] === 'undefined' || save_data[tmp_data] === ''){
				if(typeof endMethod === 'function'){
					endMethod(false);
				}
				return false; //異常
			}
		}
		//==請為數字，無則轉-1==//
		check_list = ['workYear','workMonth','avgSalary'];
		for(key in check_list){
			tmp_data = check_list[key];
			if(typeof save_data[tmp_data] === 'undefined'
				|| parseInt(save_data[tmp_data]) < 0
				|| save_data[tmp_data] === ''
			){
				save_data[tmp_data] = '-1';
			}
		}

		//==特殊轉換==//
		var dt = new Date(save_data['birthday']);
		var timestamp = dt.getTime();
		if(timestamp){
			var month = dt.getMonth()+1;
			month = ('0' + month).substr(-2);
			var date = ('0' +dt.getDate() ).substr(-2);
			save_data['birthday'] = dt.getFullYear()+''+month+''+date;
		}
		save_data['custId'] = save_data['idNo'];

		//==telegramObj==//
		set_telegram.data = save_data;

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
		return true;
	}

});
//=====[fc000101Telegram END]=====//


});
