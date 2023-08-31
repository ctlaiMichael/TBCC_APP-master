/**
 * [未列帳單明細]
 */
define([
	"app"
	,"service/messageServices"
	,"app_telegram/fc001101Telegram"
]
, function (MainApp) {

//=====[dividendServices START]=====//
MainApp.register.service("unrecordedServices",function(
	i18n
	,messageServices
	,fc001101Telegram
){
	var mainClass = this;

	//==錯誤訊息==//
	var error_btn = {
		//'返回帳單查詢選單'
		"menu" : {"name":i18n.getStringByTag("PAGE_TITLE.BILLSEARCH"),"sref":"select({menu_type:'billSearch'})"}
	};
	var errorCode = {};
	errorCode['FC0011_001'] = {
		message : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			content : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			btn_list:[error_btn.menu]
		}
	};
	errorCode['FC0011_002'] = i18n.getStringByTag('ERROR_CODE.FC0011_002.MESSAGE');
	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;


	var modifyCards = function(jsonObj){
		var data= {
			'cardList':{},
			'cardDetail':{},
		};
		var tmpCardList={};
		var tmpCardDetail={};
		for(key in jsonObj){
			var dataKey="card"+key;
			if(typeof jsonObj[key]['creditCardNo'] ==='undefined'){
				return false;
			}
			tmpCardList[dataKey]=jsonObj[key]['creditCardNo'];

			tmpCardDetail[dataKey]= jsonObj[key];
			if(typeof jsonObj[key]['detail'] ==='object'){
				tmpCardDetail[dataKey]['details']= jsonObj[key]['detail'];
			}else{
				tmpCardDetail[dataKey]['details']= [];
			}

		}
		data['cardList']=tmpCardList;
		data['cardDetail']=tmpCardDetail;
		return data;
	}

	this.getData = function(getCallBack_method){
		fc001101Telegram.getData(function(success,jsonObj){
			if(!success){
				getCallBack_method(false,jsonObj);
				return false;
			}
			var data = modifyCards(success);
			getCallBack_method(data,jsonObj);
		});
	}

});
//=====[dividendServices END]=====//

});