import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000201ResBody } from './fI000201-res';
import { FI000201ReqBody } from './fI000201-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';


@Injectable()
export class FI000201ApiService extends ApiBase<FI000201ReqBody, FI000201ResBody> {
	constructor(
		public telegram: TelegramService<FI000201ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService
	) {
		super(telegram, errorHandler, 'FI000201');
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
		const data = new FI000201ReqBody();
		data.custId = userData.custId; //user info
		data.type = this._formateService.checkField(set_data['type'], 'type'); // 有確定本年度、前年度問題在加
		let output = {
			status: false,
			msg: 'Error',
			info_data: {},
			data: []
		};

		return super.send(data).then(
			(resObj) => {

				let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				if (jsonObj.hasOwnProperty('details') && jsonObj['details']
					&& jsonObj['details'].hasOwnProperty('detail')
					&& jsonObj['details']['detail']
				) {
					output.info_data = jsonObj;
					output.data = this.modifyTransArray(jsonObj['details']['detail']);
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
