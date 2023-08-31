import { FormateService } from '@shared/formate/formate.service';
// F9000303:繳納借款本息
import { Injectable } from '@angular/core';
import { F9000303ResBody } from './f9000303-res';
import { F9000303ReqBody } from './f9000303-req';

import { TelegramService } from '@core/telegram/telegram.service';
// import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class F9000303ApiService extends ApiBase<F9000303ReqBody, F9000303ResBody> {
	// userInfo:string;
	constructor(
		public telegram: TelegramService<F9000303ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService,
		public _formateService: FormateService
	) {
		super(telegram, errorHandler, 'F9000303');

	}

	send(data: F9000303ReqBody, reqHeader): Promise<any> {
		/**
		 * 繳納借款本息
		 */
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty("custId") || userData.custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		data.custId = userData.custId;

		if (data.borrowAccount == ''
			|| data.trnsfrOutAccnt == ''
			|| data.trnsfrAmount == '' || parseFloat(data.trnsfrAmount) <= 0
			|| data.issueSeq == ''
			|| data.trxType == ''
			|| data.businessType == ''
			|| data.trnsToken == ''
		) {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}

		data.trnsfrAmount = data.trnsfrAmount.toString();

		return super.send(data, reqHeader).then(
			(resObj) => {
				let output: any = {
					status: false,
					trnsRsltCode: '',
					hostCode: '',
					hostCodeMsg: '',
					title: 'ERROR.TITLE',
					msg: 'ERROR.DEFAULT',
					classType: 'error',
					info_data: {},
					success_data: {
						trnsNo: '',
						trnsDateTime: '',
						recordDate: '',
						borrowAccount: '',
						oriBorrowCapital: '',
						borrowCapital: '',
						lastInterRecDay: '',
						trxType: '',
						account: '',
						amount: '',
						balance: ''
					}
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
				// let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				// output.msg = telegram['hostCodeMsg'];

				output.success_data.trnsNo = this._formateService.checkField(telegram, 'trnsNo');
				output.success_data.trnsDateTime = this._formateService.checkField(telegram, 'trnsDateTime');
				output.success_data.recordDate = this._formateService.checkField(telegram, 'recordDate');
				output.success_data.borrowAccount = this._formateService.checkField(telegram, 'borrowAccount');
				output.success_data.oriBorrowCapital = this._formateService.checkField(telegram, 'oriBorrowCapital');
				output.success_data.borrowCapital = this._formateService.checkField(telegram, 'borrowCapital');
				output.success_data.lastInterRecDay = this._formateService.checkField(telegram, 'lastInterRecDay');
				output.success_data.trxType = this._formateService.checkField(telegram, 'trxType');
				output.success_data.account = this._formateService.checkField(telegram, 'account');
				output.success_data.amount = this._formateService.checkField(telegram, 'amount');
				output.success_data.balance = this._formateService.checkField(telegram, 'balance');

				// if (telegram.hasOwnProperty('trnsNo')) {
				//   output.success_data.trnsNo = telegram.trnsNo;
				// };
				// if (telegram.hasOwnProperty('trnsDateTime')) {
				//   output.success_data.trnsDateTime = telegram.trnsDateTime;
				// };
				// if (telegram.hasOwnProperty('recordDate')) {
				//   output.success_data.recordDate = telegram.recordDate;
				// };
				// if (telegram.hasOwnProperty('borrowAccount')) {
				//   output.success_data.borrowAccount = telegram.borrowAccount;
				// };
				// if (telegram.hasOwnProperty('oriBorrowCapital')) {
				//   output.success_data.oriBorrowCapital = telegram.oriBorrowCapital;
				// };
				// if (telegram.hasOwnProperty('borrowCapital')) {
				//   output.success_data.borrowCapital = telegram.borrowCapital;
				// };
				// if (telegram.hasOwnProperty('lastInterRecDay')) {
				//   output.success_data.lastInterRecDay = telegram.lastInterRecDay;
				// };
				// if (telegram.hasOwnProperty('trxType')) {
				//   output.success_data.trxType = telegram.trxType;
				// };
				// if (telegram.hasOwnProperty('account')) {
				//   output.success_data.account = telegram.account;
				// };
				// if (telegram.hasOwnProperty('amount')) {
				//   output.success_data.amount = telegram.amount;
				// };
				// if (telegram.hasOwnProperty('balance')) {
				//   output.success_data.balance = telegram.balance;
				// };
				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}




