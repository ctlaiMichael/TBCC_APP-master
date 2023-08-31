import { Injectable } from '@angular/core';
import { FH000105ResBody } from './fh000105-res';
import { FH000105ReqBody } from './fh000105-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Injectable()
export class FH000105ApiService extends ApiBase<FH000105ReqBody, FH000105ResBody> {
	constructor(public telegram: TelegramService<FH000105ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		public confirm: ConfirmService,
		public navgator: NavgatorService
	) {
		super(telegram, errorHandler, 'FH000105');
	}

	getData(set_data: FH000105ReqBody): Promise<any> {
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
		const data = new FH000105ReqBody();
		data.custId = userData.custId;
		data.hospitalId = set_data.hospitalId;
		data.branchId = set_data.branchId;
		data.startDate = set_data.startDate;
		data.endDate = set_data.endDate;

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
