/**
 * FI000713-取得分行理專與行員

 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000713ReqBody } from './fi000713-req';
import { FI000713ResBody } from './fi000713-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { logger } from '@shared/util/log-util';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FI000713ApiService extends ApiBase<FI000713ReqBody, FI000713ResBody> {
	constructor(
		public telegram: TelegramService<FI000713ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService,
		private _logger: Logger) {
		super(telegram, errorHandler, 'FI000713');
	}

	getData(data: FI000713ReqBody): Promise<any> {

		if (!data.hasOwnProperty('buId') || !data.buId || data.buId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}

		const custId = this.authService.getCustId();
		if (custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		data.custId = custId;
		return super.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					msg: '',
					info_data: {},
					data: [] //行員明細
				};

				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				output.info_data = this._formateService.transClone(telegram);
				let staff_list = this.checkObjectList(telegram, 'details.detail');
				if (typeof staff_list !== 'undefined') {
					output.data = this.modifyTransArray(staff_list);
					//delete output.info_data['branches'];
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
