/**
 * Header
 * F7000101-各類稅費
 *     
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F7000101ResBody } from './f7000101-res';
import { F7000101ReqBody } from './f7000101-req';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TaxApiUtil } from '@api/modify/tax-util';
import { TelegramOption } from '@core/telegram/telegram-option';
import { FormateService } from '@shared/formate/formate.service';
import { DateUtil } from '@shared/util/formate/date/date-util';


@Injectable()
export class F7000101ApiService extends ApiBase<F7000101ReqBody, F7000101ResBody> {
	constructor(
		public telegram: TelegramService<F7000101ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F7000101');
	}

	saveData(reqObj, security: any): Promise<any> {
		// 檢查安控
		let reqHeader = new TelegramOption();
		if (typeof security !== 'undefined' && security) {
			reqHeader.header = security;
		} else {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		let data = new F7000101ReqBody();
		// 取得身分證號
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty("custId") || userData.custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		} 
		data.custId = userData.custId;
		// 在送電文前檢查
		reqObj.trnsfrOutAccnt = (reqObj.trnsfrOutAccnt).replace(/-/g,'');
		data.trnsfrOutAccnt = this._formateService.checkField(reqObj, 'trnsfrOutAccnt');
		data.payCategory = this._formateService.checkField(reqObj, 'payCategory');
		data.payNo = this._formateService.checkField(reqObj, 'payNo');
		data.payEndDate = this._formateService.checkField(reqObj, 'payEndDate');
		data.trnsfrAmount = this._formateService.checkField(reqObj, 'trnsfrAmount');
		data.taxType = this._formateService.checkField(reqObj, 'taxType');
		data.businessType = this._formateService.checkField(reqObj, 'businessType');
		data.trnsToken = this._formateService.checkField(reqObj, 'trnsToken');

		if (data.trnsfrOutAccnt == ''
			|| data.payCategory == ''
			|| data.payNo == ''
			|| data.payEndDate == ''
			|| data.trnsfrAmount == '' || parseInt(data.trnsfrAmount) <= 0
			|| data.taxType == ''
			|| data.businessType == ''
			|| data.trnsToken == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		// 使用者輸入什麼就送什麼
		// data.payEndDate = DateUtil.transDate(data.payEndDate,{'formate': 'yyyMMdd','chinaYear': true});
		return this.send(data, reqHeader).then(
			(jsonObj) => {
				let output = {
					status: false,
					msg: 'ERROR.DEFAULT',
					info_data: {},
					data: {},
					title: '',
					classType: '',
					hostCode: '',
					hostCodeMsg: '',
					trnsRsltCode: ''
				};

				output.info_data = jsonObj;

				const modify_data = TaxApiUtil.modifyResultResponse(jsonObj, 'F7000101');
				output.data = modify_data.data;
				output.trnsRsltCode = modify_data.trnsRsltCode;
				if (!modify_data.status) {
					return Promise.reject(modify_data);
				}

				output.status = true;
				output.msg = '';
				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}
