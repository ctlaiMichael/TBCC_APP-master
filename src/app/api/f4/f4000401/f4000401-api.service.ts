/**
 * 台幣預約轉帳
 * 
 */

import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { logger } from '@shared/util/log-util';
import { TelegramOption } from '@core/telegram/telegram-option';
import { ReplaceUtil } from '@shared/util/formate/string/replace-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';

import { F4000401ResBody } from './f4000401-res';
import { F4000401ReqBody } from './f4000401-req';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { DateUtil } from '@shared/util/formate/date/date-util';

@Injectable()
export class F4000401ApiService extends ApiBase<F4000401ReqBody, F4000401ResBody> {
	constructor(
		public telegram: TelegramService<F4000401ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F4000401');
	}

	/**
	 * F4000401-台幣活存預約轉帳
	 */

	saveData(reqObj, security: any): Promise<any> {
		logger.step('Transaction', 'api start', reqObj, security);
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
		let data = new F4000401ReqBody();
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
		data.trnsfrOutAccnt = this._formateService.checkField(reqObj, 'trnsfrOutAccnt');
		data.trnsfrInBank = this._formateService.checkField(reqObj, 'trnsfrInBank');
		data.trnsfrInAccnt = this._formateService.checkField(reqObj, 'trnsfrInAccnt');
		data.trnsInSetType = this._formateService.checkField(reqObj, 'trnsInSetType');
		data.trnsfrAmount = this._formateService.checkField(reqObj, 'trnsfrAmount');
		data.notePayer = this._formateService.checkField(reqObj, 'notePayer');
		data.notePayee = this._formateService.checkField(reqObj, 'notePayee');
		data.businessType = this._formateService.checkField(reqObj, 'businessType');
		data.trnsToken = this._formateService.checkField(reqObj, 'trnsToken');
		
		if (data.trnsfrDate == ''
		|| data.trnsfrOutAccnt == ''
		|| data.trnsfrInBank == ''
		|| data.trnsfrInAccnt == ''
		|| data.trnsfrAmount == '' || parseInt(data.trnsfrAmount) <= 0
		|| data.businessType == ''
		|| data.trnsToken == ''
		) {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		
		// clear symble ----- 將轉出帳號與轉入帳號由最左邊的零移除，若小於13位，則補至13位。
		data.trnsfrOutAccnt = this._modifyAccount(data.trnsfrOutAccnt);
		// data.trnsfrInAccnt = this._modifyAccount(data.trnsfrInAccnt);
		data.trnsfrDate = DateUtil.transDate(data.trnsfrDate,['yyyMMdd','chinaYear']);
		
		// 將銀行代碼+銀行名稱切成電文需求(銀行代碼)
		data.trnsfrInBank = reqObj.trnsfrInBank.slice(0,3);
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

	private _modifyAccount(str) {
		let output = ReplaceUtil.baseSymbol(str);
		output = ReplaceUtil.replaceLeftStr(output);
		if (output.length < 13) {
			output = PadUtil.padLeft(output, 13); // 左補0
		}
		return output;
	}
}
