define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000501Telegram START]=====//
MainApp.register.service("fc000501Telegram",function(telegramServices)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000501';

	/**
	 * [getResult 開卡結果]
	 * @return {[type]} [description]
	 */
	this.getResult = function(telegramObj,endMethod)
	{
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(resultObj,headerObj){
				endMethod(true,resultObj,headerObj);
			}
			set_telegram.error = function(resultObj,headerObj){
				endMethod(false,resultObj,headerObj);
			}
		}
		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];
		//==上行電文資料==//
		set_telegram.data = {
			"custId" : telegramObj.idNo,
			"creditCardNO" : telegramObj.cardNum,
			"ValidMonthYear" : telegramObj.ymData,
			"birthDate" : telegramObj.birthday,
			"captchaVal" : telegramObj.captchaVal
		};

		//==特殊轉換==//
		//---[出生日期格式:YYYMMDD(民國年)]---//
		var dt = new Date(set_telegram.data.birthDate);
		var timestamp = dt.getTime();
		if(timestamp){
			var month = dt.getMonth()+1;
			month = ('0' + month).substr(-2);
			var date = ('0' +dt.getDate() ).substr(-2);
			var year = dt.getFullYear()-1911;
			year = ('00' +year ).substr(-3);
			set_telegram.data.birthDate = year+''+month+''+date;
		}
		//---[信用卡有效月年:YYMM]---//
		var tmp = set_telegram.data.ValidMonthYear.split('/');
		set_telegram.data.ValidMonthYear = ('0' +tmp[1] ).substr(-2)
										 + ('0' +tmp[0] ).substr(-2);

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000501Telegram END]=====//


});