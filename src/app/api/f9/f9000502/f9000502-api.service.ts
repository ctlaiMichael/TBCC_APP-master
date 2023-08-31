/**
 * F9000502-線上簽約對保
 * 
 */

import { FormateService } from '@shared/formate/formate.service';
import { Injectable } from '@angular/core';
import { F9000502ResBody } from './f9000502-res';
import { F9000502ReqBody } from './f9000502-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F9000502ApiService extends ApiBase<F9000502ReqBody, F9000502ResBody> {

	constructor(
		public telegram: TelegramService<F9000502ResBody>,
		public errorHandler: HandleErrorService,
		private _formateService: FormateService,
		private authService: AuthService,
		private _logger: Logger
	) {
		super(telegram, errorHandler, 'F9000502');

	}

	sendData(reqObj: any, reqHeader?): Promise<any> {
		if (!reqHeader) {
			reqHeader = {};
		}
		this._logger.step('F9000502ApiService', 'api start', reqObj);
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty("custId") || userData.custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		let data = new F9000502ReqBody();
		data.custId = userData.custId;
		data.ebkcaseno = this._formateService.checkField(reqObj, 'ebkcaseno');
		data.isStaff = this._formateService.checkField(reqObj, 'isStaff');
		data.aprprdbgn = this._formateService.checkField(reqObj, 'aprprdbgn');
		data.aprprdend = this._formateService.checkField(reqObj, 'aprprdend');
		data.singAgree = this._formateService.checkField(reqObj, 'singAgree');
		data.singKind = this._formateService.checkField(reqObj, 'singKind');
		data.singelDate = this._formateService.checkField(reqObj, 'singelDate');
		data.blobData = this._formateService.checkField(reqObj, 'blobData');
		data.blobDataStaff = this._formateService.checkField(reqObj, 'blobDataStaff');
		data.phoneNum = this._formateService.checkField(reqObj, 'phoneNum');
		data.trnsToken = this._formateService.checkField(reqObj, 'trnsToken');
		return super.send(data, reqHeader).then(
			(resObj) => {
				let output = {
					status: false,
					info_data: {},
					data: []
				};

				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				if (telegram.hasOwnProperty('result') && telegram) {
					output.info_data = this._formateService.transClone(telegram);
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




