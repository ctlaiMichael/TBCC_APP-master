import { Injectable } from '@angular/core';
import { FH000207ResBody } from './fh000207-res';
import { FH000207ReqBody } from './fh000207-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FH000207ApiService extends ApiBase<FH000207ReqBody, FH000207ResBody> {
	constructor(public telegram: TelegramService<FH000207ResBody>,
		public errorHandler: HandleErrorService,
		private _formateService: FormateService
		, public authService: AuthService
	) {
		super(telegram, errorHandler, 'FH000207');
	}

	getData(data: FH000207ReqBody): Promise<any> {
		let output = {
			info_data: {},
			status: false,
			msg: '',
			error_type: ''
		};


		/**
		* 登入狀態檢查
		*/
		let isLogin = this.authService.isLoggedIn();
		if (isLogin) {
			const userData = this.authService.getUserInfo();
			if (!userData.hasOwnProperty("custId") || userData.custId == '') {
				return Promise.reject({
					title: 'ERROR.TITLE',
					content: 'ERROR.DATA_FORMAT_ERROR'
				});
			};
			data.custId = userData.custId;
		} else {
			data.custId = "";
		}


		return super.send(data).then(
			(resObj) => {
				let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

				output.info_data = jsonObj;
				output.info_data['custId'] = this._formateService.checkField(jsonObj, 'custId'); // 
				output.info_data['hospitalId'] = this._formateService.checkField(jsonObj, 'hospitalId'); // 
				output.info_data['branchId'] = this._formateService.checkField(jsonObj, 'branchId'); // 
				output.info_data['amount'] = this._formateService.checkField(jsonObj, 'amount'); // 
				output.info_data['refNo'] = this._formateService.checkField(jsonObj, 'refNo'); // 
				output.info_data['sendSeqNo'] = this._formateService.checkField(jsonObj, 'sendSeqNo'); // 
				output.info_data['txType'] = this._formateService.checkField(jsonObj, 'txType'); // 
				output.info_data['payNo'] = this._formateService.checkField(jsonObj, 'payNo'); // 	
				output.info_data['payType'] = this._formateService.checkField(jsonObj, 'payType'); // 	
				output.info_data['acctIdTo'] = this._formateService.checkField(jsonObj, 'acctIdTo'); // 	
				output.info_data['payDt'] = this._formateService.checkField(jsonObj, 'payDt'); // 	
				output.info_data['mac'] = this._formateService.checkField(jsonObj, 'mac'); // 	
				output.status = true;

				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}
