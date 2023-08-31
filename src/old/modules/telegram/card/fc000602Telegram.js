define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000602Telegram START]=====//
MainApp.register.service("fc000602Telegram",function(telegramServices)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000602';

	/**
	 * [getCardData 取得客戶卡片清單]
	 * @return {[type]} [description]
	 */
	this.sendData = function(telegramObj,endMethod)
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

		if(typeof telegramObj.branchId === 'undefined' || telegramObj.branchId === '0'){
			telegramObj.branchId = '';
		}

		//==上行電文資料==//
		set_telegram.data = {
			"custId" : telegramObj.idNo,
			"birthDate" : telegramObj.birthday,
			//==卡片資料==//
			"creditCardType" : telegramObj.creditCardType,	//信用卡類別
			"creditCardNO" : telegramObj.creditCardNO,		//信用卡號碼
			"cardType" : telegramObj.cardType,				//正附卡類型
			"replaceCard" : telegramObj.replaceCard,		//是否補發卡片
			"branchId" : telegramObj.branchId,				//分行代碼
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

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000602Telegram END]=====//


});