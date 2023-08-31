import { Injectable } from '@angular/core';
import { FK000102ReqBody } from './fk000102-req';
import { FK000102ResBody } from './fk000102-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FK000102ApiService extends ApiBase<FK000102ReqBody, FK000102ResBody> {

	constructor(public telegram: TelegramService<FK000102ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService) {
		super(telegram, errorHandler, 'FK000102');
	}
	send(data: FK000102ReqBody): Promise<any> {
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty("custId") || userData.custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		};

		data.custId = userData.custId;
		return super.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					content: ''
				};
				let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
				if (telegram.hasOwnProperty('accounts') && telegram['accounts'].hasOwnProperty('accountInfo')) {
					output.status = true;
					telegram.accounts.accountInfo.splice(0, 0, { accountNo: '請選擇帳號/卡號', isCombo: 'default' });
					return Promise.resolve(telegram.accounts.accountInfo);
				} else {
					output.content = "處理失敗";
					return Promise.reject(output);
				}
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}



