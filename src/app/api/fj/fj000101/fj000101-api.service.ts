import { Injectable } from '@angular/core';
import { FJ000101ReqBody } from './fj000101-req';
import { FJ000101ResBody } from './fj000101-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { logger } from '@shared/util/log-util';

@Injectable()
export class FJ000101ApiService extends ApiBase<FJ000101ReqBody, FJ000101ResBody> {

	constructor(public telegram: TelegramService<FJ000101ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService) {
		super(telegram, errorHandler, 'FJ000101');
	}
	send(data: FJ000101ReqBody, reqHeader): Promise<any> {


		/**
		 * 綜合對帳單申請及異動
		 */
		let output = {
			status: false,
			msg: '',
			info_data: {}
		};


		if (!data.hasOwnProperty('newEmail') || !data.hasOwnProperty('transFlag')) {
			output.msg = 'Error';
			return Promise.reject(output);
		};
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty("custId") || userData.custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		};
		data.custId = userData.custId;
		return super.send(data, reqHeader).then(
			(resObj) => {
				logger.error('resObj',resObj);
				let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};

				if (telegram.hasOwnProperty('result') && telegram['result'] == '0'
					&& telegram.hasOwnProperty('trnsNo') && telegram.hasOwnProperty('trnsDateTime')
					&& telegram.hasOwnProperty('hostCode') && telegram.hasOwnProperty('hostCodeMsg')
				) {
					output.status = true;
					output.info_data = resObj;
					return Promise.resolve(output);
				} else {
					return Promise.reject(resObj);
				}
			},
			(errorObj) => {
				logger.error('errorObj',errorObj);
				return Promise.reject(errorObj);
			}
		);
	}
}



