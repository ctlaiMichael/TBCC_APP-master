define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc001202Telegram START 未列帳單消費明細查詢]=====//
MainApp.register.service("fc001202Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc001202';
	/**
	 * [getData 未列帳單消費明細查詢]
	 * @return {[type]} [description]
	 */
	this.getCardData = function(periods,CardNo,endMethod,PAGE)
	{
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(jsonObj,jsonObjHeader){
				if(typeof jsonObj.details !=="object" || typeof jsonObj.details.detail !== 'object'){
					endMethod(false,jsonObj);
					return false;
				}
				var data = {
					requestTime : jsonObjHeader.requestTime,
					cardDetail : jsonObj.details.detail
				}
				//==特殊處理(只有一筆時)==//
				data.cardDetail = telegramServices.modifyResDetailObj(data.cardDetail);
				if(data.cardDetail.length <= 0){
					endMethod(false,jsonObj);
					return false;
				}
				//==回傳頁碼資訊==//
				var pageData = jsonObj.paginatedInfo;

				// endMethod(data,periods,pageData);
				endMethod(data,pageData);
			}
			set_telegram.error = function(jsonObj){
				endMethod(false,jsonObj);
			}
		}

		var userModel = sysCtrl.getUserModel();
		if(typeof userModel.userId !== 'string' || !userModel.userId){
			endMethod(false,{});
			return false;
		}

		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];

		//==上行電文資料==//
			set_telegram.data = {
				"custId" : userModel.userId,
				"creditCardID" : CardNo,
				"stage" : periods,
				"paginator" : {
					"pageSize" : "10",
					"pageNumber" : "0",
					"sortColName" : "expendDate",
					"sortDirection" : "ASC"
				}
			};

		if(typeof(PAGE) != "undefined"){
			set_telegram.data.paginator.pageNumber = PAGE;
			//==在取第二頁之後均關閉loading設定==//
			set_telegram.loading = false;
		}
		if (set_telegram.data.paginator.pageNumber == '1') {
			set_telegram.data.paginator.pageNumber = '0';
		}

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc001202Telegram END]=====//


});