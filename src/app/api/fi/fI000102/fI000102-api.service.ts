import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000102ResBody } from './FI000102-res';
import { FI000102ReqBody } from './FI000102-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';


@Injectable()
export class FI000102ApiService extends ApiBase<FI000102ReqBody, FI000102ResBody> {
	constructor(
		public telegram: TelegramService<FI000102ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService
	) {
		super(telegram, errorHandler, 'FI000102');
	}


	/**
	 * 基金庫存明細
	 * req
	 * 
	 *   
	 *    
	 *   
	 */
	getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
		const userData = this.authService.getUserInfo();

		if (!userData.hasOwnProperty('custId') || userData.custId === '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		const data = new FI000102ReqBody();
		data.custId = userData.custId; // user info;
		data.paginator = this.modifyPageReq(data.paginator, page, sort);

		return this.send(data).then(
			(resObj) => {
				const output = {
					status: false,
					msg: 'ERROR.DEFAULT',
					info_data: {},
					dataTime: '',
					page_info: {},
					data: []
				};
				const jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				const modify_data = this._modifyRespose(jsonObj);
				output.data = modify_data.data;
				output.info_data = modify_data.info_data;
				output.page_info = this.pagecounter(jsonObj);
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

	/**
	 * Response整理
	 * @param jsonObj 資料判斷
	 */
	private _modifyRespose(jsonObj) {
		const output = {
			info_data: {},
			data: []
		};
		output.info_data = this._formateService.transClone(jsonObj);
		if (jsonObj.hasOwnProperty('details') && jsonObj['details']
			&& jsonObj['details'].hasOwnProperty('detail')
			&& jsonObj['details']['detail']
		) {
			output.data = this.modifyTransArray(jsonObj['details']['detail']);
			delete output.info_data['details'];
		}

		return output;
	}
}
