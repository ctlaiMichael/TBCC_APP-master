/**
 * Header
 * F7000601-繳納國民年金保費
 *     
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F7000601ResBody } from './f7000601-res';
import { F7000601ReqBody } from './f7000601-req';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TaxApiUtil } from '@api/modify/tax-util';
import { TelegramOption } from '@core/telegram/telegram-option';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';


@Injectable()
export class F7000601ApiService extends ApiBase<F7000601ReqBody, F7000601ResBody> {
    constructor(
        public telegram: TelegramService<F7000601ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService) {
        super(telegram, errorHandler, 'F7000601');
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
		let data = new F7000601ReqBody();
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
		data.account = this._formateService.checkField(reqObj, 'account');
		data.barcode1 = this._formateService.checkField(reqObj, 'barcode1');
		data.barcode2 = this._formateService.checkField(reqObj, 'barcode2');
		data.barcode3 = this._formateService.checkField(reqObj, 'barcode3');
		data.businessType = this._formateService.checkField(reqObj, 'businessType');
		data.trnsToken = this._formateService.checkField(reqObj, 'trnsToken');

		if (data.account == ''
			|| data.barcode1 == ''
			|| data.barcode2 == ''
			|| data.barcode3 == ''
			|| data.businessType == ''
			|| data.trnsToken == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		data.account = data.account.replace(/-/g,'');
        return this.send(data, reqHeader).then(
			(jsonObj) => {
				let output = {
					status: false,
					msg: '',
					info_data: {},
					data: {},
					title: '',
					classType: '',
					hostCode: '',
					hostCodeMsg: '',
					trnsRsltCode: ''
				};

				output.info_data = jsonObj;

				const modify_data = TaxApiUtil.modifyResultResponse(jsonObj, 'F7000601');
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
