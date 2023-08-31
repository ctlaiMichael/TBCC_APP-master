/**
 * [信用卡帳單查詢]
 */
define([
	"app"
	,"service/messageServices"
	,"app_telegram/fc001001Telegram"
	,"app_telegram/fc001002Telegram"
]
, function (MainApp) {

//=====[dividendServices START]=====//
MainApp.register.service("billPeriodServices",function(
	i18n
	,messageServices
	,fc001001Telegram,fc001002Telegram
){
	var mainClass = this;

	//==錯誤訊息==//
	var error_btn = {
		//'返回帳單查詢選單'
		"menu" : {"name":i18n.getStringByTag("PAGE_TITLE.BILLSEARCH"),"sref":"select({menu_type:'billSearch'})"}
	};
	var errorCode = {};
	errorCode['FC0010_001'] = {
		message : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			content : i18n.getStringByTag('ERROR_MSG.NO_SEARCH')
		}
	};
	errorCode['FC0010_002'] = {
		message : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			content : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			btn_list:[error_btn.menu]
		}
	};
	errorCode['FC0010_003'] = i18n.getStringByTag('ERROR_MSG.NO_SEARCH_DETAIL');
	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;


	var modifyCards = function(jsonObj){
		var data= {
			'cardDetail':{}
		};
		var tmpCardDetail={};
		for(key in jsonObj){
			var dataKey="card"+key;

			if(typeof jsonObj[key] ==='object'){
				tmpCardDetail[dataKey]=jsonObj[key];
			}else{
				tmpCardDetail[dataKey]=[];
			}
		}
		data['cardDetail']=tmpCardDetail;
		return data;
	}

	var modifyCardsDetail = function(jsonObj){//jsonObj.details.detail
		var data= {
			'cardDetail':{},
			'twdTotalAmt':''
		};
		var tmpCardDetail={};
		var tmpDetail={};
		if(typeof jsonObj.details ==="object"){
			tmpDetail=jsonObj.details;
		}
		var tmp;
		for(key in tmpDetail){
			tmp = tmpDetail[key];
			var dataKey="card"+key;

			if(typeof tmp==='object'){
				for (tmp_key in tmp) {
					if (!tmp[tmp_key] || (typeof tmp[tmp_key] !== 'string' && typeof tmp[tmp_key] !== 'number')) {
						tmp[tmp_key] = '';
					}
				}
				tmpCardDetail[dataKey] = tmp;
			}else{
				tmpCardDetail[dataKey] = [];
			}
		}

		if(typeof jsonObj['twdTotalAmt'] =='string' || typeof jsonObj['twdTotalAmt'] =='number'){
			data['twdTotalAmt']=jsonObj['twdTotalAmt'];
		}
		data['cardDetail']=tmpCardDetail;
		// console.log(data);
		return data;
	}

	this.getData = function(getCallBack_method){
		fc001001Telegram.getData(function(success,jsonObj,pageData){
			if(!success){
				getCallBack_method(false,jsonObj);
				return false;
			}
			var data = modifyCards(success);
			getCallBack_method(data,jsonObj,pageData);
		});
	}
　　//取第N頁資料
	this.getDataOnPage = function(PAGE,getCallBack_method){
		fc001001Telegram.getData(function(success,jsonObj,pageData){
			if(!success){
				getCallBack_method(false,jsonObj);
				return false;
			}
			var data = modifyCards(success);
			getCallBack_method(data,jsonObj,pageData);
		},PAGE);
	}


	this.getCardData = function(periods,CardNo,getCallBack_method,PAGE){
		fc001002Telegram.getCardData(periods,CardNo,function(jsonObj,pageData){
			if(!jsonObj){
				getCallBack_method(false);
				return false;
			}
			var data = modifyCardsDetail(jsonObj);
			data._creditCardNo = CardNo;
			getCallBack_method(data,pageData);
		},PAGE);
	}
});
//=====[dividendServices END]=====//

});