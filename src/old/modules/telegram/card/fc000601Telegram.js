/**
 * [客戶卡片清單查詢電文]
 */
define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000601Telegram START]=====//
MainApp.register.service("fc000601Telegram",function(telegramServices)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000601';

	/**
	 * [getCardData 取得客戶卡片清單]
	 * @return {[type]} [description]
	 */
	this.getCardData = function(telegramObj,endMethod)
	{
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(resultObj,headerObj){
				if(typeof resultObj.cardDetails !== 'object' || typeof resultObj.cardDetails.detail !== 'object'){
					endMethod(false,resultObj,headerObj);
					return false;
				}
				//==特殊處理(只有一筆時)==//
				var result = telegramServices.modifyResDetailObj(resultObj.cardDetails.detail);
				endMethod(result,resultObj,headerObj);
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
		//send
		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000601Telegram END]=====//


});