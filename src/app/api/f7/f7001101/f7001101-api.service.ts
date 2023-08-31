/**
 * Header
 * F7001101-繳納燃料費
 *     
 */

import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F7001101ResBody } from './f7001101-res';
import { F7001101ReqBody } from './f7001101-req';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TaxApiUtil } from '@api/modify/tax-util';
import { TelegramOption } from '@core/telegram/telegram-option';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class F7001101ApiService extends ApiBase<F7001101ReqBody, F7001101ResBody> {
	constructor(
		public telegram: TelegramService<F7001101ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F7001101');
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
		let data = new F7001101ReqBody();
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
		data.businessType = this._formateService.checkField(reqObj, 'businessType');
		data.taxType = this._formateService.checkField(reqObj, 'taxType');
		data.trnsToken = this._formateService.checkField(reqObj, 'trnsToken');
		data.identificationCode = this._formateService.checkField(reqObj, 'identificationCode');
		
		/**
		 * identificationCode 檢視碼
		 * 不用給值，但tag要存在，主要是給server認xml結構用
		 * (上行文字由NativeCode 追蹤得出)
		 */
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

				const modify_data = TaxApiUtil.modifyResultResponse(jsonObj, 'F7001101');
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
