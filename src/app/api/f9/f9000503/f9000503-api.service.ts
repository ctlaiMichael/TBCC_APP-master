/**
 * F9000503-約據下載
 * 20191104 
 * request custId 暫時關閉。
 * data.caseStatus 先帶空，測試用 之後待改
 */

import { FormateService } from '@shared/formate/formate.service';
import { Injectable } from '@angular/core';
import { F9000503ResBody } from './f9000503-res';
import { F9000503ReqBody } from './f9000503-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class F9000503ApiService extends ApiBase<F9000503ReqBody, F9000503ResBody> {

	constructor(
		public telegram: TelegramService<F9000503ResBody>,
		public errorHandler: HandleErrorService,
		public _formateService: FormateService,
		public authService: AuthService
	) {
		super(telegram, errorHandler, 'F9000503');

	}

	getData(req: any): Promise<any> {
		let data = new F9000503ReqBody();
		const usercustId = this.authService.getCustId();
		data.custId = usercustId;
		data.txKind = req.txKind;
		data.ebkCaseNo = req.ebkCaseNo;
		data.dataType = req.dataType;
		return super.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					info_data: {}, //所有資訊
					blobData: '' //base64字串
				};
				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				output.info_data = this._formateService.transClone(telegram);
				output.blobData = telegram.blobData;
				output.status = true;
				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}




