import { Injectable } from '@angular/core';
import { FH000205ResBody } from './fh000205-res';
import { FH000205ReqBody } from './fh000205-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class FH000205ApiService extends ApiBase<FH000205ReqBody, FH000205ResBody> {
	constructor(public telegram: TelegramService<FH000205ResBody>,
		public errorHandler: HandleErrorService,
		private _formateService: FormateService
		, public authService: AuthService
	) {
		super(telegram, errorHandler, 'FH000205');
	}

	getData(data: FH000205ReqBody): Promise<any> {
		let output = {
			info_data: {},
			status: false,
			msg: '',
			error_type: ''
		};


		/**
		* 登入狀態檢查
		*/
		let isLogin = this.authService.isLoggedIn();
		if (isLogin) {
			const userData = this.authService.getUserInfo();
			if (!userData.hasOwnProperty("custId") || userData.custId == '') {
				return Promise.reject({
					title: 'ERROR.TITLE',
					content: 'ERROR.DATA_FORMAT_ERROR'
				});
			};
			data.custId = userData.custId;
		} else {
			data.custId = "";
		}

		return super.send(data).then(
			(resObj) => {

				let output = {
					status: false,
					trnsRsltCode: '',
					hostCode: '',
					hostCodeMsg: '',
					title: 'ERROR.TITLE',
					msg: 'ERROR.DEFAULT',
					classType: 'error',
					info_data: {},
					requestTime: ''
				};

				const transRes = TransactionApiUtil.modifyResponse(resObj);
				if (transRes.hostCode == '000' || transRes.hostCode == '0000' || transRes.hostCode == '4001' || transRes.hostCode == '4002') {
					let telegram = transRes.body;
					output.status = transRes.status;
					output.title = transRes.title;
					output.msg = transRes.msg;
					output.classType = transRes.classType;
					output.trnsRsltCode = transRes.trnsRsltCode;
					output.hostCode = transRes.hostCode;
					output.hostCodeMsg = transRes.hostCodeMsg;
					output.info_data = telegram;
					
					let check_obj = this.checkObjectList(telegram, 'details.detail');
					if (typeof check_obj !== 'undefined') {
						output.info_data['details'] = this.modifyTransArray(check_obj);
					} else {
						output.info_data['details'] = [];
					}
					return Promise.resolve(output);
				} else {				
					let errorObj = {
						msg: transRes.msg,
						status: false
					};
					return Promise.reject(errorObj);
				}
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}
