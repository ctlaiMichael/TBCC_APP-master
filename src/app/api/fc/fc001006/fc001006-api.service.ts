/**
 * Fc001006-額度調整進件狀態查詢
 */

import { FormateService } from '@shared/formate/formate.service';
import { Injectable } from '@angular/core';
import { FC001006ResBody } from './fc001006-res';
import { FC001006ReqBody } from './fc001006-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FC001006ApiService extends ApiBase<FC001006ReqBody, FC001006ResBody> {

	constructor(
		public telegram: TelegramService<FC001006ResBody>,
		public errorHandler: HandleErrorService,
		public _formateService: FormateService,
		public authService: AuthService
	) {
		super(telegram, errorHandler, 'FC001006');

	}

	getData(req: any): Promise<any> {
		let data = new FC001006ReqBody();
		const usercustId = this.authService.getCustId();
		data.custId = usercustId;
		data.type = req.type;
		return super.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					info_data: {},
					data: []
				};
				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				if (telegram.hasOwnProperty('details') && telegram) {
					output.info_data = this._formateService.transClone(telegram);
					let check_detail = this.checkObjectList(telegram, 'details.detail');
					if (check_detail) {
						output.data = this.modifyTransArray(check_detail);
						delete output.info_data['details'];
					}

				}
				if (output.data == null || output.data.length <= 0) {
					return Promise.reject({
						title: 'ERROR.TITLE',
						content: '沒有您要查詢的資料'
					});
				}
				output.status = true;
				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}




