/**
 * Header
 * F7000401-中華電信欠費查詢
 * 
 */

import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F7000401ReqBody } from './f7000401-req';
import { F7000401ResBody } from './f7000401-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { logger } from '@shared/util/log-util';


@Injectable()
export class F7000401ApiService extends ApiBase<F7000401ReqBody, F7000401ResBody> {
	constructor(
		public telegram: TelegramService<F7000401ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F7000401');
	}

	saveData(reqObj): Promise<any> {
		let data = new F7000401ReqBody();
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
		data.phone = this._formateService.checkField(reqObj, 'phone');

		if (data.customerId == '' || data.phone == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		return this.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					msg: 'ERROR.RSP_FORMATE_ERROR',
					info_data: {},
					data: []
				};

				let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
				logger.error('resObj', resObj)

				if (telegram.hasOwnProperty('batchNo') && telegram.hasOwnProperty('customerId') &&
					telegram.hasOwnProperty('phone') && telegram.hasOwnProperty('totalAmount') &&
					telegram.hasOwnProperty('details') && telegram) {
					output.info_data = telegram;
					let check_obj = this.checkObjectList(telegram, 'details.detail');
					if (typeof check_obj !== 'undefined') {
						output.data = this.modifyTransArray(check_obj);
						delete output.info_data['details'];
					}

					output.status = true;
					output.msg = '';
					return Promise.resolve(output);
				} else {

					output.msg = '查無資料'
					return Promise.reject(output);

					/** 20190902 Boy修改 
					 * 因無中華電信查詢測試資料，故使用下列資料為「查詢資料」，以
					 * 便開發並測試至繳交中華電信費。
					 * 資料於上傳前將註解。
					 */

					// output.status = true;
					// output.msg = '';
					// return Promise.resolve(output);

					/**----20190903 Boy 修改完畢---------------- */
				}
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}
