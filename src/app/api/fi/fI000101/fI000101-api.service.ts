import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000101ResBody } from './FI000101-res';
import { FI000101ReqBody } from './FI000101-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';


@Injectable()
export class FI000101ApiService extends ApiBase<FI000101ReqBody, FI000101ResBody> {
	constructor(
		public telegram: TelegramService<FI000101ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService
	) {
		super(telegram, errorHandler, 'FI000101');
	}


	/**
	 * 基金庫存總覽
	 * req
	 * 
	 *   
	 *    
	 *   
	 */
	getData(set_data): Promise<any> {
		const userData = this.authService.getUserInfo();

		if (!userData.hasOwnProperty('custId') || userData.custId === '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		const data = new FI000101ReqBody();
		data.custId = userData.custId; //user info

		let output = {
			status: false,
			msg: 'Error',
			info_data: {},
			data: []
		};

		return super.send(data).then(
			(resObj) => {

				let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				output.info_data = jsonObj;
				let check_obj = this.checkObjectList(jsonObj, 'details.detail');
				if (typeof check_obj !== 'undefined') {
					output.data = this.modifyTransArray(check_obj);
					delete output.info_data['details'];
				}
				if (output.data.length <= 0) {
					return Promise.reject({
						title: 'ERROR.TITLE',
						content: 'ERROR.EMPTY'
					});
				}

				output.status = true;
				output.msg = '';
				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}
