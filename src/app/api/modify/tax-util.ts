/**
 * 繳費稅專用api整理
 * 稅款與費用皆有使用此api
 */
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';

export const TaxApiUtil = {

	/**
	 * 判斷繳費稅交易結果API成功與否
	 *      custId  身份證號
	 *      hostCode    交易結果
	 *      trnsNo  交易序號
	 *      trnsDateTime    交易時間
	 *      hostCodeMsg 主機代碼訊息
	 *      recordDate  記帳日期
	 *      account 轉出帳號
	 *      trnsfrAmount    應繳總金額
	 *      bussNO  銷帳編號(臺北自來水時稱為水號)
	 *      balance 扣款帳號餘額
	 *      trnsRsltCode    交易結果代碼
	 *          0-交易成功, 1-交易失敗, X-交易異常
	 * @param resObj data
	 */
	modifyResultResponse(resObj, apiId: string) {
		let output: any = {
			status: false,
			title: 'ERROR.TITLE',
			msg: 'ERROR.DEFAULT',
			trnsRsltCode: '',
			hostCode: '',
			hostCodeMsg: '',
			classType: 'error',
			host_list: [],
			data: {},
			body: {},
			header: {}
		};

		let jsonObj = (resObj.hasOwnProperty('body') && resObj['body']) ? resObj['body'] : {};
		let jsonHeader = (resObj.hasOwnProperty('header') && resObj['header']) ? resObj['header'] : {};
		let result_flag = FieldUtil.checkField(jsonObj, 'trnsRsltCode');
		output.trnsRsltCode = result_flag;
		output.hostCode = FieldUtil.checkField(jsonObj, 'hostCode');
		output.hostCodeMsg = FieldUtil.checkField(jsonObj, 'hostCodeMsg');

		output.data['custId'] = FieldUtil.checkField(jsonObj, 'custId');
		output.data['hostCode'] = FieldUtil.checkField(jsonObj, 'hostCode');
		output.data['trnsDateTime'] = FieldUtil.checkField(jsonObj, 'trnsDateTime');
		output.data['hostCodeMsg'] = FieldUtil.checkField(jsonObj, 'hostCodeMsg');
		output.data['recordDate'] = FieldUtil.checkField(jsonObj, 'recordDate');
		output.data['account'] = FieldUtil.checkField(jsonObj, 'account');
		output.data['trnsfrAmount'] = FieldUtil.checkField(jsonObj, 'trnsfrAmount');
		output.data['balance'] = FieldUtil.checkField(jsonObj, 'balance');
		output.data['trnsNo'] = FieldUtil.checkField(jsonObj, 'trnsNo');

		/**
		 * 依據繳交不同費用而改變欄位
		 * F7000101-各類稅費
		 * F7000201---台灣自來水費，F7000301---電費，F7000801---學費
		 * (F7000501---勞保費，F7000601---國民年金保費，F7000701---健保費)，F7001001---臺北市自來水費
		 * F7001101---燃料費
		 */
		if (apiId == 'F7000201'|| apiId == 'F7001001') {
			output.data['bussNO'] = FieldUtil.checkField(jsonObj, 'bussNO');
		}
		if (apiId == 'F7000301') {
			output.data['custNum'] = FieldUtil.checkField(jsonObj, 'custNum');
		}
		if (apiId == 'F7000501' || apiId == 'F7000601' || apiId == 'F7000701') {
			output.data['barcode1'] = FieldUtil.checkField(jsonObj, 'barcode1');
			output.data['barcode2'] = FieldUtil.checkField(jsonObj, 'barcode2');
			output.data['barcode3'] = FieldUtil.checkField(jsonObj, 'barcode3');
		}
		if (apiId == 'F7000801') {
			output.data['payAmount'] = FieldUtil.checkField(jsonObj, 'payAmount');
			output.data['bussNO'] = FieldUtil.checkField(jsonObj, 'bussNO');
		}

		if (apiId == 'F7001001') {
			output.data['billDate'] = FieldUtil.checkField(jsonObj, 'billDate');
		}

		if (apiId == 'F7000101' || apiId == 'F7001101') {
			output.data['trnsfrOutAccnt'] = FieldUtil.checkField(jsonObj, 'trnsfrOutAccnt');
			output.data['payCategory'] = FieldUtil.checkField(jsonObj, 'payCategory');
			output.data['payEndDate'] = FieldUtil.checkField(jsonObj, 'payEndDate');
			output.data['payNo'] = FieldUtil.checkField(jsonObj, 'payNo');
			output.data['trnsfrFee'] = FieldUtil.checkField(jsonObj, 'trnsfrFee');
			output.data['trnsfrOutAccntBal'] = FieldUtil.checkField(jsonObj, 'trnsfrOutAccntBal');
			if (apiId == 'F7001101') {
				output.data['identificationCode'] = FieldUtil.checkField(jsonObj, 'identificationCode');
			}
		}


		if (output.data['recordDate'] !== '') {
			output.data['recordDate'] = DateUtil.transDate(output.data['recordDate']);
		}
		if (output.data['trnsDateTime'] !== '') {
			output.data['trnsDateTime'] = DateUtil.transDate(output.data['trnsDateTime']);
		}

		// 交易結果判斷
		if (output.trnsRsltCode == '0') {
			output.status = true;
			output.title = '交易成功';
			output.classType = 'success';
		} else if (output.trnsRsltCode == '1') {
			output.title = '交易失敗';
			output.classType = 'error';
		} else if (output.trnsRsltCode == 'X') {
			output.title = '交易異常';
			output.classType = 'warning';
		} else {
			output.title = '交易不明';
			output.classType = 'error';
		}

		if (output.hostCode != '') {
			output.host_list.push('(' + output.hostCode + ')');
		}
		if (output.hostCodeMsg != '') {
			output.host_list.push(output.hostCodeMsg);
		}
		if (output.host_list.length > 0) {
			output.msg = output.host_list.join('');
		} else {
			output.msg = output.title;
		}

		output.body = jsonObj;
		output.header = jsonHeader;
		return output;
	},


	/**
	 * 判斷中華電信繳費交易結果API成功與否
	 *      custId           身份證號
	 *      trnsDateTime     交易時間
	 *      hostCode         交易結果
	 *      hostCodeMsg      主機代碼訊息
	 *      trnsfrOutAccnt   轉出帳號
	 * 		customerId       電話號碼所屬身分證號
	 * 		phone            電話號碼
	 * 		billDt           列帳年月
	 * 		dueDt            繳費期限
	 *      trnsfrAmount     應繳金額
	 *      trnsRsltCode     交易結果代碼
	 *          0-交易成功, 1-交易失敗, X-交易異常
	 * @param resObj data
	 */
	modifyResultForHinetFee(resObj) {
		let output: any = {
			status: false,
			title: 'ERROR.TITLE',
			msg: 'ERROR.DEFAULT',
			trnsRsltCode: '',
			hostCode: '',
			hostCodeMsg: '',
			classType: 'error',
			host_list: [],
			data: {},
			body: {},
			header: {}
		};

		let jsonObj = (resObj.hasOwnProperty('body') && resObj['body']) ? resObj['body'] : {};
		let jsonHeader = (resObj.hasOwnProperty('header') && resObj['header']) ? resObj['header'] : {};
		let result_flag = FieldUtil.checkField(jsonObj, 'trnsRsltCode');
		output.trnsRsltCode = result_flag;
		output.hostCode = FieldUtil.checkField(jsonObj, 'hostCode');
		output.hostCodeMsg = FieldUtil.checkField(jsonObj, 'hostCodeMsg');

		output.data['custId'] = FieldUtil.checkField(jsonObj, 'custId');
		output.data['trnsDateTime'] = FieldUtil.checkField(jsonObj, 'trnsDateTime');
		output.data['hostCode'] = FieldUtil.checkField(jsonObj, 'hostCode');
		output.data['hostCodeMsg'] = FieldUtil.checkField(jsonObj, 'hostCodeMsg');
		output.data['trnsfrOutAccnt'] = FieldUtil.checkField(jsonObj, 'trnsfrOutAccnt');
		output.data['customerId'] = FieldUtil.checkField(jsonObj, 'customerId');
		output.data['phone'] = FieldUtil.checkField(jsonObj, 'phone');
		output.data['billDt'] = FieldUtil.checkField(jsonObj, 'billDt');
		output.data['dueDt'] = FieldUtil.checkField(jsonObj, 'dueDt');
		output.data['trnsfrAmount'] = FieldUtil.checkField(jsonObj, 'trnsfrAmount');


		// 交易結果判斷
		if (output.trnsRsltCode == '0') {
			output.status = true;
			output.title = '交易成功';
			output.classType = 'success';
		} else if (output.trnsRsltCode == '1') {
			output.title = '交易失敗';
			output.classType = 'error';
		} else if (output.trnsRsltCode == 'X') {
			output.title = '交易異常';
			output.classType = 'warning';
		} else {
			output.title = '交易不明';
			output.classType = 'error';
		}

		if (output.hostCode != '') {
			output.host_list.push('(' + output.hostCode + ')');
		}
		if (output.hostCodeMsg != '') {
			output.host_list.push(output.hostCodeMsg);
		}
		if (output.host_list.length > 0) {
			output.msg = output.host_list.join('');
		} else {
			output.msg = output.title;
		}

		output.body = jsonObj;
		output.header = jsonHeader;
		return output;
	}

};
