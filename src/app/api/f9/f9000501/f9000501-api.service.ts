/**
 * F9000501-申請進度查詢
 * 20191104 
 * request custId 暫時關閉。
 * data.caseStatus 先帶空，測試用 之後待改
 */

import { FormateService } from '@shared/formate/formate.service';
import { Injectable } from '@angular/core';
import { F9000501ResBody } from './f9000501-res';
import { F9000501ReqBody } from './f9000501-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class F9000501ApiService extends ApiBase<F9000501ReqBody, F9000501ResBody> {

	constructor(
		public telegram: TelegramService<F9000501ResBody>,
		public errorHandler: HandleErrorService,
		public _formateService: FormateService,
		public authService: AuthService
	) {
		super(telegram, errorHandler, 'F9000501');

	}

	getData(req: any, page?: number, sort?: Array<any>): Promise<any> {
		let data = new F9000501ReqBody();
		const usercustId = this.authService.getCustId();
		data.custId = usercustId;
		data.caseStatus = req.caseStatus;
		data.paginator = this.modifyPageReq(data.paginator, page, sort);
		return super.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					page_info: {},
					info_data: {},
					data: []
				};
				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				if (telegram.hasOwnProperty('details') && telegram) {
					output.info_data = this._formateService.transClone(telegram);
					output.page_info = this.pagecounter(telegram);
					let check_detail = this.checkObjectList(telegram, 'details.detail');
					if (check_detail) {
						output.data = this.modifyTransArray(check_detail);
						// if (typeof check_detail !== 'undefined') {
						// 	output.data.forEach(item => {
						// 		//中台分行有可能傳物件
						// 		if (item.branch_nam == '' || typeof item.branch_nam == 'undefined'
						// 			|| item.branch_nam == null || typeof item.branch_nam == 'object') {
						// 			item.branch_nam = '--';
						// 		}
						// 	});
						delete output.info_data['details'];
						// }
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




