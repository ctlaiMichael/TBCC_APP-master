/**
 * [電文包裝services]
 */
define([
	"app"
]
, function (MainApp) {

//=====[telegramServices START]=====//
MainApp.register.service("qrcodeTelegram",function(
	$rootScope,$state,$http,$log
	,telegram,framework,i18n,serviceStatus,sysCtrl
){
	angular.extend(this, telegram);
	var mainClass = this;
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	
	

	this.getHeaderTemplate = function(){
		var header = {
			"rquId" : "",					//交易識別碼
			"sessionId" : "",				//使用者登入session id,取自login
			"mobileNo" : "",				//機碼 (手機號碼)
			"ipAddress" : "",				//IP位置,後面寫死了...
			"locale" : "",					//地區,取自login
			"appVersion" : "",				//應用程序版本,取自framework
			"plainText" : "",				//簽章原文
			"signature" : "",				//簽章值
			"certSN" : "",					//簽章憑證序號
			"cn" : "",						//RA-API驗章時傳送CN
			"SecurityType" : "",			//驗證模式
			"SecurityPassword" : "",		//驗證密碼
			"Acctoken" : "",				//驗證識別token
			"osType" : ""					//系統別,取自deviceInfo
		};
		// if(OpenNactive){
		// 	header.mobileNo = deviceInfo.uuid; //uuid
		// }
		
		return header;
	}

	
	this.getXML = function(serviceId, jsonObj, success, header){
		$log.debug('[STEP] sendJson:'+serviceId);
		if(typeof jsonObj !== 'object'){
			jsonObj = {};
		}
		var data = jsonObj;

		// requestCallbackHandler = routineSuccessHandler;
		//==正式==//
		//$log.debug('[INFO] get object data:'+JSON.stringify(data));
		data = modifyReqTeltgram(serviceId, data, header); //物件轉換
		var xml = toXML(data);
		success(xml); 
	}

	this.getRquId = function( serviceId ){
		return generateGUID() + '-' + serviceId;
	}

	/**
	 * [generateGUID 產出GUID] => reqId不可超出40字元
	 * @return {[type]} [description]
	 */
	function generateGUID() {
		
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4()  + s4()  + s4() + s4()  + s4();
		// return s4() + s4()  + s4()  + s4() + s4()  + s4() + s4() + s4();
	}

	var parseTag = function(jsonObj){
		var xml = '';
		for(var tagKey in jsonObj){
			if(tagKey.indexOf('@')==0){
				xml += ' '+ tagKey.replace('@','') + '="'+jsonObj[tagKey]+'"';
			}
		}
		
		return xml;
	}
	var LF = '';
	// var SP = '        ';
	var SP = '\t';
	var parseJsonObjToXML = function (jsonObj, prefix) {
		var xml = '';
		if (prefix == null) {
			prefix = '';
		}
		for (var key in jsonObj) {
			if (key.indexOf('@') == -1) {
				if (typeof (jsonObj[key]) == 'object') {
					if (Object.prototype.toString.call(jsonObj[key]) === '[object Array]') {
						// Array 特殊處理
						var sub_key;
						for (sub_key in jsonObj[key]) {
							if (typeof jsonObj[key][sub_key] === 'undefined') {
								continue;
							}
							xml += prefix + '<' + key + parseTag(jsonObj[key]) + '>' + LF;
							xml += parseJsonObjToXML(jsonObj[key][sub_key], prefix + SP);
							xml += prefix + '</' + key + '>' + LF;
						}
					} else {
						xml += prefix + '<' + key + parseTag(jsonObj[key]) + '>' + LF;
						xml += parseJsonObjToXML(jsonObj[key], prefix + SP);
						xml += prefix + '</' + key + '>' + LF;
					}
				} else {
					xml += prefix + '<' + key + '>';
					xml += jsonObj[key];
					xml += '</' + key + '>' + LF;
				}
			}
		}
		return xml;
	}
	var toXML = function(jsonObj){
		var xml = '<?xml version="1.0" encoding="UTF-8"?>';
		xml += parseJsonObjToXML(jsonObj);
		return xml;
	}


	
	/**
	 * [modifyReqTeltgram 修正ReqTelegram]
	  * @param  {[type]} serviceId [電文編號]
	  * @param  {[type]} jsonObj   [內容]
	  * @param  {[type]} jsonObj   [header]
	  * @return {[type]}           [description]
	  */
	  function modifyReqTeltgram(serviceId,jsonObj,reqHeader)
	  {
		  if(typeof jsonObj !== 'object'){
			  jsonObj = {};
		  }
		  var heq_header = {};
		  var heq_body = {
			  "@xsi:type" : serviceId+"BodyType"
		  };
  
		  var tmp_value,sub_value;
		  //==header==//
		  for(key in reqHeader)
		  {
			  tmp_value = reqHeader[key];
			  if(typeof tmp_value === 'object'){
				  sub_value = {};
				  for(subkey in tmp_value){
					  sub_value['co:'+subkey] = tmp_value[subkey];
				  }
				  tmp_value = sub_value;
			  }
			  heq_header['co:'+key] = tmp_value;
		  }
  
		  var tmp_specail_list = ['custId','paginator','pageSize','pageNumber','sortColName','sortDirection'];
		  //==body==//
		  for(key in jsonObj)
		  {
			  tmp_value = jsonObj[key];
			  if(typeof tmp_value === 'object'){
				  sub_value = {};
				  for(subkey in tmp_value){
					  if(tmp_specail_list.indexOf(subkey) > -1){
						  sub_value['co:'+subkey] = tmp_value[subkey];
					  }else{
						  sub_value[subkey] = tmp_value[subkey];
					  }
				  }
				  tmp_value = sub_value;
			  }
			  if(tmp_specail_list.indexOf(key) > -1){
				  key = 'co:'+key;
			  }
			  heq_body[key] = tmp_value;
		  }
  
		  jsonObj = {
			  "co:MNBRequest" : {
				  "@xmlns" : "http://mnb.hitrust.com/service/schema/"+serviceId,
				  "@xmlns:co" : "http://mnb.hitrust.com/service/schema",
				  "@xmlns:xsi" : "http://www.w3.org/2001/XMLSchema-instance",
				  "co:reqHeader" : heq_header,
				  "co:body" : heq_body
			  }
		  };
		  // console.log(jsonObj);
		  return jsonObj;
	  }
});
//=====[telegramServices END]=====//

});