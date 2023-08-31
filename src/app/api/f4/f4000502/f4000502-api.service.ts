/**
 * Header
 * F4000502-台幣預約轉帳註銷
 * 
 */

import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { TelegramOption } from '@core/telegram/telegram-option';
import { logger } from '@shared/util/log-util';
import { F4000502ResBody } from './f4000502-res';
import { F4000502ReqBody } from './f4000502-req';

@Injectable()
export class F4000502ApiService extends ApiBase<F4000502ReqBody, F4000502ResBody> {
	constructor(
		public telegram: TelegramService<F4000502ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F4000502');
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
		let data = new F4000502ReqBody();
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
		data.trnsfrDate = this._formateService.checkField(reqObj, 'trnsfrDate');
		data.orderDate = this._formateService.checkField(reqObj, 'orderDate');
		data.orderNo = this._formateService.checkField(reqObj, 'orderNo');
		data.trnsToken = this._formateService.checkField(reqObj, 'trnsToken');
		data.trnsfrOutAccnt = this._formateService.checkField(reqObj, 'trnsfrOutAccnt');
		data.trnsfrInBank = this._formateService.checkField(reqObj, 'trnsfrInBank');
		data.trnsfrInAccnt = this._formateService.checkField(reqObj, 'trnsfrInAccnt');
		data.trnsfrAmount = this._formateService.checkField(reqObj, 'trnsfrAmount');

		if (data.trnsfrDate == ''
			|| data.orderDate == ''
			|| data.orderNo == ''
			|| data.trnsToken == ''
			|| data.trnsfrOutAccnt == ''
			|| data.trnsfrInBank == ''
			|| data.trnsfrInAccnt == ''
			|| data.trnsfrAmount == '' || parseInt(data.trnsfrAmount) <= 0
		) {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}

		// data.trnsfrAmount = parseInt(data.trnsfrAmount).toString();
		return this.send(data, reqHeader).then(
			(resObj) => {
				let output: any = {
					status: false,
					title: 'ERROR.TITLE',
					msg: 'ERROR.DEFAULT',
					trnsRsltCode: '',
					hostCode: '',
					hostCodeMsg: '',
					classType: 'error',
					info_data: {}
				};

				const transRes = TransactionApiUtil.modifyResponse(resObj);
				let telegram = transRes.body;
				output.status = transRes.status;
				output.title = transRes.title;
				output.msg = transRes.msg;
				output.classType = transRes.classType;
				output.trnsRsltCode = transRes.trnsRsltCode;
				output.hostCode = transRes.hostCode;
				output.hostCodeMsg = transRes.hostCodeMsg;

				output.info_data = telegram;
				output.info_data.trnsRsltCode = output.trnsRsltCode;
				output.info_data.hostCode = output.hostCode;
				output.info_data.hostCodeMsg = output.hostCodeMsg;

				logger.step('Transaction', 'api end', output);
				if (output.status) {
					return Promise.resolve(output);
				} else {
					return Promise.reject(output);
				}
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}
