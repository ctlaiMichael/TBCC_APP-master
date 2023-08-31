/**
 * Header
 * F7000102-可繳交稅款項目查詢
 *     
 */

import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { F7000102ResBody } from './f7000102-res';
import { F7000102ReqBody } from './f7000102-req';


@Injectable()
export class F7000102ApiService extends ApiBase<F7000102ReqBody, F7000102ResBody> {
	constructor(
		public telegram: TelegramService<F7000102ResBody>,
		public authService: AuthService,
		public errorHandler: HandleErrorService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F7000102');
	}

	saveData(): Promise<any> {
		let data = new F7000102ReqBody();
		return this.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					msg: 'ERROR.DEFAULT',
					info_data: {},
					data: []
				};

				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

				if (telegram.hasOwnProperty('details') && telegram) {
					output.info_data = this._formateService.transClone(telegram);
					if (telegram['details'] == null) {
						return Promise.reject({
							title: 'ERROR.TITLE',
							content: 'ERROR.RSP_FORMATE_ERROR'
						});
					}

					let check_details = this.checkObjectList(telegram, 'details.detail');
					if (typeof check_details !== 'undefined') {
						output.data = this.modifyTransArray(check_details);
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
