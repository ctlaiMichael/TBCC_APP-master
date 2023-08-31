import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000305ResBody } from './fI000305-res';
import { FI000305ReqBody } from './fI000305-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';


@Injectable()
export class FI000305ApiService extends ApiBase<FI000305ReqBody, FI000305ResBody> {
	constructor(
		public telegram: TelegramService<FI000305ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService
	) {
		super(telegram, errorHandler, 'FI000305');
	}


	/**
	 * 基金庫存明細
	 * req
	 * 
	 *   
	 *    
	 *   
	 */
	getData(req: any, page?: number, sort?: Array<any>): Promise<any> {
		const userData = this.authService.getUserInfo();

		if (!userData.hasOwnProperty('custId') || userData.custId === '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}


		const data = new FI000305ReqBody();
		data.custId = userData.custId; // user info;
		data.fundCode = req.fundCode;
		data.enrollDate = req.enrollDate;
		data.inCurrency = req.inCurrency;
		data.invenAmountT = req.invenAmountT;
		data.trustAcnt = req.trustAcnt;
		data.transCode = req.transCode;

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
				if (jsonObj.hasOwnProperty('details') && jsonObj['details']
					&& jsonObj['details'].hasOwnProperty('detail') && jsonObj['details']['detail']
				) {
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
