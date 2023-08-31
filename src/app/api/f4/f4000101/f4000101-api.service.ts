/**
 * Header
 * F4000101-台幣活存約定轉出及轉入帳號查詢
 *     
 */
import { Injectable } from '@angular/core';
import { F4000101ResBody } from './f4000101-res';
import { F4000101ReqBody } from './f4000101-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { logger } from '@shared/util/log-util';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class F4000101ApiService extends ApiBase<F4000101ReqBody, F4000101ResBody> {
	constructor(public telegram: TelegramService<F4000101ResBody>,
		private authService: AuthService,
		public errorHandler: HandleErrorService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F4000101');
	}
	/**
	 * 台幣活存約定轉出即轉入帳號查詢
	 */
	send(data: F4000101ReqBody): Promise<any> {
		logger.step('F4000101ApiService', 'api start', data);
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty("custId") || userData.custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		data.custId = userData.custId;
		return super.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					msg: 'ERROR.RSP_FORMATE_ERROR',
					info_data: {},
					trnsOutAccts: [],        // 轉出帳號
					trnsInAccts: [],         // 轉入帳號(約定)
					commonTrnsInAccts: [],   // 常用帳號
					searchTime: ''           // 取得response header 的回應時間
				}

				let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
				let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};
				if (telegramHeader.hasOwnProperty('responseTime')) {
					output.searchTime = telegramHeader.responseTime;
				}

				if (telegram.hasOwnProperty('trnsOutAccts') && telegram.hasOwnProperty('trnsInAccts') &&
					telegram.hasOwnProperty('commonTrnsInAccts') && telegram.hasOwnProperty('trnsToken') &&
					telegram['trnsToken'] != '' && telegram) {

					output.info_data = this._formateService.transClone(telegram);

					let check_trnsOutAcct = this.checkObjectList(telegram, 'trnsOutAccts.trnsOutAcct');
					if (typeof check_trnsOutAcct !== 'undefined') {
						output.trnsOutAccts = this.modifyTransArray(check_trnsOutAcct);
						delete output.info_data['trnsOutAccts'];
					}

					// if (telegram['trnsOutAccts'] != null && telegram['trnsOutAccts'] != 'undefined') {
					// 	output.trnsOutAccts = this.modifyTransArray(telegram['trnsOutAccts']['trnsOutAcct']);
					// }

					let check_trnsInAccts = this.checkObjectList(telegram, 'trnsInAccts.trnsInAcct');
					if (typeof check_trnsInAccts !== 'undefined') {
						output.trnsInAccts = this.modifyTransArray(check_trnsInAccts);
						delete output.info_data['trnsInAccts'];
					}

					// if (telegram['trnsInAccts'] != null && telegram['trnsInAccts']['trnsInAcct'] != 'object') {
					// 	output.trnsInAccts = this.modifyTransArray(telegram['trnsInAccts']['trnsInAcct']);
					// }

					let check_commonTrnsInAccts = this.checkObjectList(telegram, 'commonTrnsInAccts.commonTrnsInAcct');
					if (typeof check_commonTrnsInAccts !== 'undefined') {
						output.commonTrnsInAccts = this.modifyTransArray(check_commonTrnsInAccts);
						delete output.info_data['commonTrnsInAccts'];
					}

					// if (telegram['commonTrnsInAccts'] != null && telegram['commonTrnsInAccts'] != 'undefined') {
					// 	output.commonTrnsInAccts = this.modifyTransArray(telegram['commonTrnsInAccts']['commonTrnsInAcct']);
					// }

					logger.step('F4000101ApiService', 'api end', output);
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
