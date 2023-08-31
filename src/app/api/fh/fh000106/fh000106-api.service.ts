import { Injectable } from '@angular/core';
import { FH000106ResBody } from './fh000106-res';
import { FH000106ReqBody } from './fh000106-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FH000106ApiService extends ApiBase<FH000106ReqBody, FH000106ResBody> {
	constructor(public telegram: TelegramService<FH000106ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
	) {
		super(telegram, errorHandler, 'FH000106');
	}

	getData(set_data: FH000106ReqBody): Promise<any> {
		let output = {
			status: false,
			msg: 'Error',
			info_data: {},
			data: [],
		};

		const userData = this.authService.getUserInfo();

		if (!userData.hasOwnProperty('custId') || userData.custId === '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		const data = new FH000106ReqBody();
		data.custId = userData.custId;
		data.trnsNo = set_data.trnsNo;

		return super.send(data).then(
			(resObj) => {
				let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				output.status = true;
				output.msg = '';
				output.info_data = jsonObj;

				if (jsonObj.hasOwnProperty("details") && jsonObj['details']
					&& typeof jsonObj['details'] === 'object' && jsonObj['details'].hasOwnProperty("detail")
					&& jsonObj['details']['detail']) {
					output.data = this.modifyTransArray(jsonObj['details']['detail']);
				}
				if (output.data.length <= 0) {
					return Promise.reject({
						title: 'ERROR.TITLE',
						content: 'ERROR.EMPTY'
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
