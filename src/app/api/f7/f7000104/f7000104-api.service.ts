/**
 * Header
 * F7000104-繳費交易約定轉出帳號查詢
 * 
 * 
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service'
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { F7000104ResBody } from './f7000104-res';
import { F7000104ReqBody } from './f7000104-req';


@Injectable()
export class F7000104ApiService extends ApiBase<F7000104ReqBody, F7000104ResBody> {

	constructor(
		public telegram: TelegramService<F7000104ResBody>,
		public authService: AuthService,
		public errorHandler: HandleErrorService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F7000104');
	}


	saveData(): Promise<any> {
		let data = new F7000104ReqBody();
		// 取得身分證號
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty("custId") || userData.custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		data.custId = userData.custId;
		return this.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					msg: 'ERROR.DEFAULT',
					info_data: {},
					data: [],
					searchTime: ''
				};
				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				output.info_data = telegram;

				let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};
				if (telegramHeader.hasOwnProperty('responseTime')) {
					output.searchTime = this._formateService.transDate(telegramHeader.responseTime);
				}

				if (telegram.hasOwnProperty('businessType') && telegram.hasOwnProperty('trnsToken') &&
					telegram.hasOwnProperty('trnsOutAccts') && telegram) {
					if (telegram['businessType'] == '' || telegram['trnsToken'] == '') {
						return Promise.reject({
							title: 'ERROR.TITLE',
							content: 'ERROR.RSP_FORMATE_ERROR'
						});
					}

					output.info_data = this._formateService.transClone(telegram);
					
					//-----20190906 Boy 轉出帳號錯誤處理-----//

					let check_trnsOutAccts = this.checkObjectList(telegram,'trnsOutAccts.detail');
					if(typeof check_trnsOutAccts !=='undefined'){
						output.data = this.modifyTransArray(check_trnsOutAccts);
						delete output.info_data['trnsOutAccts'];
					}

					//-----------------------------------//

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
