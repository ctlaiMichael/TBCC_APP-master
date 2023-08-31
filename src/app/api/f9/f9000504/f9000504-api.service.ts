/**
 * F9000504-線上對保-期間與利率及是否為員工查詢
 *
 */

import { FormateService } from '@shared/formate/formate.service';
import { Injectable } from '@angular/core';
import { F9000504ResBody } from './f9000504-res';
import { F9000504ReqBody } from './f9000504-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F9000504ApiService extends ApiBase<F9000504ReqBody, F9000504ResBody> {

	constructor(
		public telegram: TelegramService<F9000504ResBody>,
		public errorHandler: HandleErrorService,
		public _formateService: FormateService,
		public authService: AuthService,
		private _logger: Logger
	) {
		super(telegram, errorHandler, 'F9000504');

	}

	getData(req: any): Promise<any> {
		this._logger.error("F9000504 API send", req);
		let data = new F9000504ReqBody();
		const usercustId = this.authService.getCustId();
		data.custId = usercustId;
		data.ebkCaseNo = req.ebkCaseNo;
		return super.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					info_data: {}, // 所有資訊
					data: [],
					agreeData: null
				};
				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				output.info_data = this._formateService.transClone(telegram);

				if (telegram.hasOwnProperty('details') && telegram) {

					let check_detail = this.checkObjectList(telegram, 'details.detail');
					if (typeof check_detail !== 'undefined') {
						output.data = this.modifyTransArray(check_detail);
						delete output.info_data['details'];
					}
				}
				if (telegram.hasOwnProperty('agree_details') && telegram) {
					let check_agree_detail = this.checkObjectList(telegram, 'agree_details.agree_detail');

					if (typeof check_agree_detail !== 'undefined') {
						let tmpContract = {};
						check_agree_detail.forEach(element => {
							tmpContract[element.dataType] = element.blobData;
						});
						output.agreeData = tmpContract;
						delete output.info_data['agree_details'];
					}
				}
				if (output.agreeData == null || output.data.length <= 0) {
					return Promise.reject({
						title: 'ERROR.TITLE',
						content: '沒有您要查詢的資料'
					});
				}
				return Promise.resolve(output);
			},(errorObj) => {
				this._logger.error('F9000504 API Error');
				return Promise.reject(errorObj);
			});
		}
	}




