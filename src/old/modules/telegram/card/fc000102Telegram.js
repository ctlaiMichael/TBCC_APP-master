define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000102Telegram START 圖片上傳]=====//
MainApp.register.service("fc000102Telegram",function(telegramServices)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000102';


	/**
	 * [getSaveData 整理資料]
	 * @param  {[type]} funcId   [上傳類型]
	 * @param  {[type]} set_data [上傳檔案]
	 *                   {signature : ['data:image/jpeg;base64,XXX','xxxXXX']}
	 * @return {[type]}          [description]
	 */
	this.getSaveData = function(funcId,set_data)
	{
		var data = {
			status : false,
			msg : '',
			save_data : {}
		}
		//==圖片數量上限==//
		var image_num = {
			'idCopy' : 2,
			'finProof' : 3,
			'signature' : 1
		}
		//==預設參數==//
		var save_data = {
			"txNos" : {}, //案件編號
			"funcId" : funcId, //功能編號
			"captchaValReqr" : "0", //圖形驗證
			"signatureReqr" : "0", //簽名圖檔
			"idCopyReqr" : "0", //身分圖檔
			"finProofReqr" : "0" //財力證明
		};

		var check_flag = true;
		//0 不上傳 , 1 必上傳 , 2 選擇上傳
		switch(funcId)
		{
			case 1: //信用卡申請-檢附資料上傳
				save_data['captchaValReqr'] = "1";
				save_data['signatureReqr'] = "1";
				save_data['idCopyReqr'] = "2";
				save_data['finProofReqr'] = "2";
			break;
			case 2: //信用卡申請-補件上傳
				save_data['captchaValReqr'] = "1";
				save_data['idCopyReqr'] = "1";
				save_data['finProofReqr'] = "1";
			break;
			case 3: //信用卡帳單分期
			case 4: //信用卡單筆分期
				save_data['signatureReqr'] = "1";
			break;
			case 5: //單純只做圖型碼驗證，不做其他事情
						save_data['captchaValReqr'] = "1";
						save_data['signatureReqr'] = "0";
						save_data['idCopyReqr'] = "0";
						save_data['finProofReqr'] = "0";
			break;
			default: //error
				check_flag = false;
			break;
		}
		if(!check_flag){
			data.msg = "目前該功能不提供圖片上傳功能喔!";
			return data;
		}

		//==特例處理==//
		if(typeof set_data['signiture'] !== 'undefined'){
			//因為中台已經錯字了...就一律錯到底吧
			set_data['signature'] = set_data['signiture'];
			delete set_data['signiture'];
		}

		var i =1;
		var image_str = "";
		var tmp;
		check_flag = true;
		for(key in image_num)
		{
			if(!save_data[key+"Reqr"] || save_data[key+"Reqr"] == "0"){
				continue;
			}
			//--依照設定檔決定是否必須上傳，或是選擇上傳--//
			if(!save_data[key+"Reqr"] && save_data[key+"Reqr"] !== '2' && typeof set_data[key] === 'undefined'){
				check_flag = false;
				continue;
			}
			save_data[key+"Reqr"] = '1'; //電文只有1
			i = 1;
			for(img_val in set_data[key])
			{
				if(i > image_num[key]){
					break; //超過數量
				}
				image_str = set_data[key][img_val];
				//清base64
				if(image_str.indexOf('base64,') > -1){
					tmp = image_str.split('base64,');
					image_str = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
				}
				if(image_str === ''){
					continue;
				}
				if(image_num[key] !== 1){
					save_data[key+i] = image_str;
				}else{
					save_data[key] = image_str;
				}
				i++;
			} //end set_data
		} //end image_num
		if(!check_flag){
			data.msg = "圖片缺少，請確認資料正確!";
			return data; //少圖
		}

		if(save_data['captchaValReqr'] && save_data['captchaValReqr'] !== "0"){
			if(typeof set_data['captchaVal'] === 'undefined' || set_data['captchaVal'] === ''){
				data.msg = "請輸入圖形驗證碼";
				return data; //少圖
			}
			save_data['captchaVal'] = set_data['captchaVal'];
		}

		if (typeof set_data['txNo'] !== 'undefined' || funcId == 5) {
			var txNos_list = [];
			if (typeof set_data['txNo'] === 'object') {
				for (key in set_data['txNo']) {
					txNos_list.push(set_data['txNo'][key]);
				}
			} else {
				if (funcId != 5) {
					txNos_list = [set_data['txNo']];
				}else{
					txNos_list = [''];
				}
			}
			save_data['txNos'] = { txNo: txNos_list };
		}
		data.status = true;
		data.save_data = save_data;
		data.msg = '';
		return data;
	}


	/**
	 * [saveData 儲存資料]
	 * @param  {[type]} set_data  [description]
	 *                   {signiture : ['','','']}
	 * @param  {[type]} endMethod [description]
	 * @return {[type]}           [description]
	 */
	this.saveData = function(funcId,set_data,endMethod)
	{
		var data = {
			status : false,
			msg : ''
		};


		//==取得變數==//
		var result = MainClass.getSaveData(funcId,set_data);
		if(!result.status){
			data.msg = result.msg;
			return data;
		}
		var save_data = result.save_data;

		var set_telegram = {};
		//==電文end==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(jsonObj){
				endMethod(true);
			}
			set_telegram.error = function(jsonObj){
				endMethod(false,jsonObj);
			}
			set_telegram.ajax_error = function(jsonObj){
				if(typeof jsonObj === 'string'){
					jsonObj = {
						respCodeMsg : jsonObj
					};
				}
				MainUiTool.openDialog('檔案上傳失敗');
				endMethod(false,jsonObj);
			}
		}
		//==telegramObj==//
		set_telegram.data = save_data;

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);

		data.status = true;
		data.msg = "上傳已送出";
		return data;
	}

});
//=====[fc000102Telegram END]=====//


});