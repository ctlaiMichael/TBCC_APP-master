/**
 * Header
 * F7000402-繳納中華電信費
 *     
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F7000402ResBody } from './f7000402-res';
import { F7000402ReqBody } from './f7000402-req';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TaxApiUtil } from '@api/modify/tax-util';
import { TelegramOption } from '@core/telegram/telegram-option';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';


@Injectable()
export class F7000402ApiService extends ApiBase<F7000402ReqBody, F7000402ResBody> {
	constructor(
		public telegram: TelegramService<F7000402ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F7000402');
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
		let data = new F7000402ReqBody();
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
		data.customerId = this._formateService.checkField(reqObj, 'customerId');
		data.areaBranchNo = this._formateService.checkField(reqObj, 'areaBranchNo');
		data.phone = this._formateService.checkField(reqObj, 'phone');
		data.authCode = this._formateService.checkField(reqObj, 'authCode');
		data.billDt = this._formateService.checkField(reqObj, 'billDt');
		data.billType = this._formateService.checkField(reqObj, 'billType');
		data.accountType = this._formateService.checkField(reqObj, 'accountType');
		data.payableAmount = this._formateService.checkField(reqObj, 'payableAmount');
		data.checkCode = this._formateService.checkField(reqObj, 'checkCode');
		data.dueDt = this._formateService.checkField(reqObj, 'dueDt');
		data.trnsfrOutAccnt = this._formateService.checkField(reqObj, 'trnsfrOutAccnt');
		data.trnsToken = this._formateService.checkField(reqObj, 'trnsToken');

		data.trnsfrOutAccnt = data.trnsfrOutAccnt.replace(/-/g,'');
		return this.send(data, reqHeader).then(
			(jsonObj) => {
				let output = {
					status: false,
					msg: 'ERROR.RSP_FORMATE_ERROR',
					info_data: {},
					data: {},
					title: '',
					classType: '',
					hostCode: '',
					hostCodeMsg: '',
					trnsRsltCode: ''
				};

				output.info_data = jsonObj;

				const modify_data = TaxApiUtil.modifyResultForHinetFee(jsonObj);
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
