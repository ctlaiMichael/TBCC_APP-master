define([
	"app"
	,"modules/telegram/qrcodePay/telegramServices"
]
, function (MainApp) {
//=====[QRCode繳費用電文Telegram START 申請信用卡儲存]=====//
MainApp.register.service("qrCodePayTelegram",function(qrcodeTelegramServices, framework)
{
	var MainClass = this;
	this.sessionID = '';
	this.mobileNo = '';
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	
	function getResTelegramList(jsonObj,check_child)
	{
		if(typeof check_child === 'undefined'){
			check_child = true;
		}
		if(typeof jsonObj !== 'object'){
			return jsonObj;
		}
		var data = {};
		var child_key;
		var sub_data;
		for(subkey in jsonObj){
			//child_key = subkey.replace(/^sch\:|fq0\:|fh0\:|f10\:/,'');
			child_key = subkey.replace(/^sch\:|fq0\:|fi0\:|fh0\:|fj0\:|f10\:|f50\:|f70\:|fb0\:|bi0\:/,'');
			sub_data = jsonObj[subkey];
			if(check_child && typeof sub_data === 'object'){
				sub_data = getResTelegramList(sub_data,true);
			}
			data[child_key] = sub_data;
		}
		return data;
	}

	this.send = function(telegramCode, req, endMethod, header, backgroundMode)
	{
		var set_telegram = {};

		//==電文end==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(jsonObj){
				endMethod(getResTelegramList(jsonObj,true));
			}
			set_telegram.error = function(jsonObj){
				sysCtrl.errorMessage = jsonObj.debugMessage;
				endMethod(false,getResTelegramList(jsonObj,true));
			}
		}

		var send = function(){
			set_telegram.data = req;
			qrcodeTelegramServices.sendTelegram(telegramCode,set_telegram, header, backgroundMode);
		}
		//==telegramObj==//
		if(OpenNactive){
			MainClass.mobileNo = device.uuid;
			function getMobileNo (){
				MainClass.mobileNo = device.uuid;
				if(header==null){
					header = {};
				}
				header.mobileNo = MainClass.mobileNo;
				send();	

				// plugin.tcbb.getMobileNo(function(mobileNo){
				// 	MainClass.mobileNo = mobileNo;
				// 	if(header==null){
				// 		header = {};
				// 	}
				// 	header.mobileNo = MainClass.mobileNo;
				// 	send();	
				// },function(error){
				// 	framework.alert('getMobileNo Error:'+JSON.stringify(error));	
				// });
			}

			plugin.tcbb.getSessionID(function(rtnObj){
				MainClass.sessionID = rtnObj.value;
				if(header==null){
					header = {};
				}
				header.sessionId = MainClass.sessionID;
				header.cn = rtnObj.cn;
				header.sn = rtnObj.sn;
				header.cn = header.cn || '';
				header.sn = header.sn || '';
				console.log(header.cn);

				setTimeout(getMobileNo, 0);
				//send();
			},function(error){
				framework.alert('getSessionID Error:'+JSON.stringify(error));
			});

		}else{
			send();
		}
		
		
	}

	this.getXMLBody = function(telegramCode, req, endMethod)
	{
		qrcodeTelegramServices.getXML(telegramCode,req, function(xml){
			var xmlBody = xml.substring(xml.indexOf('<co:body'), xml.indexOf('</co:MNBRequest>'));
			return endMethod(xmlBody);
		});
	}

	this.getRquId = function(telegramCode){
		return qrcodeTelegramServices.getRquId(telegramCode);
	}
	

	this.toArray = function(arrayObj){
		if(arrayObj==null){
			return [];
		}
		var result = qrcodeTelegramServices.modifyResDetailObj(arrayObj);
		var tmp_data = [];
		var tmp;
		for (key in result) {
			tmp = result[key];
			tmp['detail'] = [];
			if (typeof tmp.details === 'object' && typeof tmp.details.detail === 'object') {
				tmp['detail'] = qrcodeTelegramServices.modifyResDetailObj(tmp.details.detail);
			}
			tmp_data[key] = tmp;
		}
		result = tmp_data;
		return result;
	}

});
//=====[QRCode繳費用電文Telegram END]=====//


});
