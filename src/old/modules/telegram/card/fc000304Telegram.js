/**
 * [信用卡登出]
 */
define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000304Telegram START]=====//
MainApp.register.service("fc000304Telegram",function(
	telegramServices,sysCtrl
	,$log
){
	var MainClass = this;
	this.telegramCode = 'card/fc000304';


	this.logout = function(endMethod)
	{
		var set_telegram = {};

		set_telegram.success = function(resultObj,headerObj){
			endMethod(true,resultObj,headerObj);
		}
		set_telegram.error = function(resultObj,headerObj){
			endMethod(false,resultObj,headerObj);
		}

		var userModel = sysCtrl.getUserModel();
		if(typeof userModel.userId !== 'string' || !userModel.userId
			|| !userModel.loginCardUser
		){
			var resultObj = {
				result : 0 ,
				respCode : '',
				respCodeMsg : ''
			};
			if(!userModel.loginCardUser){
				resultObj.respCodeMsg = '沒有登入信用卡會員';
			}
			endMethod(false,resultObj,{});
			return false;
		}

		// console.log(password_str);
		//==telegramObj==//
		set_telegram.data = {
			"custId" : userModel.userId
		};

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
		return true;
	}

});
//=====[fc000304Telegram END]=====//


});