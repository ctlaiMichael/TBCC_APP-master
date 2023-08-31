/**
 * Header
 * F4000501-台幣活存預約轉帳查詢
 * 
 */

import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TelegramOption } from '@core/telegram/telegram-option';


import { F4000501ResBody } from './f4000501-res';
import { F4000501ReqBody } from './f4000501-req';


@Injectable()
export class F4000501ApiService extends ApiBase<F4000501ReqBody, F4000501ResBody> {
	constructor(
		public telegram: TelegramService<F4000501ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService) {
		super(telegram, errorHandler, 'F4000501');
	}


	saveData(): Promise<any> {

		let data = new F4000501ReqBody();
		// 取得身分證號
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty("custId") || userData.custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		data.custId = userData.custId;
		return this.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					msg: 'ERROR.RSP_FORMATE_ERROR',
					info_data: {},
					reservationList: []
				};
				let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
				output.info_data = telegram;

				if (telegram.hasOwnProperty('trnsToken') && telegram.hasOwnProperty('details') &&
					telegram['details'] && telegram) {

					let check_reservation = this.checkObjectList(telegram, 'details.detail');
					if (typeof check_reservation !== 'undefined') {
						output.reservationList = this.modifyTransArray(check_reservation);
						delete output.info_data['details'];
					}

					output.status = true;
					output.msg = '';
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
