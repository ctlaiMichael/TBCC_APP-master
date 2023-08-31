/**
 * Header
 * F7000103-繳納稅款約定轉出帳號查詢
 * 
 * 
 */

import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { F7000103ResBody } from './f7000103-res';
import { F7000103ReqBody } from './f7000103-req';
import { logger } from '@shared/util/log-util';


@Injectable()
export class F7000103ApiService extends ApiBase<F7000103ReqBody, F7000103ResBody> {
	constructor(
		public telegram: TelegramService<F7000103ResBody>,
		public authService: AuthService,
		public errorHandler: HandleErrorService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F7000103');
	}


	saveData(reqObj): Promise<any> {
		let data = new F7000103ReqBody();
		// 取得身分證號
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty("custId") || userData.custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		data.custId = userData.custId;
		// 在送電文前檢查
		data.taxId = this._formateService.checkField(reqObj, 'taxId');
		data.startDate = this._formateService.checkField(reqObj, 'startDate');
		data.endDate = this._formateService.checkField(reqObj, 'endDate');

		if (data.custId == ''
			|| data.taxId == ''
			|| data.startDate == ''
			|| data.endDate == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		return this.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					msg: 'ERROR.DEFAULT',
					info_data: {},
					trnsOutAccts: [],   // 約定轉出帳號
					taxesList: []      // 可繳交稅款列表
				};
				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

				
				if (telegram.hasOwnProperty('businessType') && telegram.hasOwnProperty('trnsToken') &&
					telegram.hasOwnProperty('trnsOutAccts') && telegram.hasOwnProperty('taxs') &&
					telegram) {

					if (telegram['businessType'] == '' || telegram['trnsToken'] == '') {
						return Promise.reject({
							title: 'ERROR.TITLE',
							content: 'ERROR.RSP_FORMATE_ERROR'
						});
					}
					output.info_data = this._formateService.transClone(telegram);

					let check_trnsOutAcct = this.checkObjectList(telegram, 'trnsOutAccts.detail');
					if (typeof check_trnsOutAcct !== 'undefined') {
						output.trnsOutAccts = this.modifyTransArray(check_trnsOutAcct);
						delete output.info_data['trnsOutAccts'];
					}

					let check_taxesList = this.checkObjectList(telegram, 'taxs.detail');
					if (typeof check_taxesList !== 'undefined') {
						output.taxesList = this.modifyTransArray(check_taxesList);
						delete output.info_data['taxs'];
					}
					
					logger.step('F7000103ApiService', 'api end', output);
					output.status = true;
					output.msg = '';
					return Promise.resolve(output);
				} else {
					return Promise.reject(output);
				}
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}
