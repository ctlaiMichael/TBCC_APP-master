import { Injectable } from '@angular/core';
import { FJ000103ReqBody } from './fj000103-req';
import { FJ000103ResBody } from './fj000103-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FJ000103ApiService extends ApiBase<FJ000103ReqBody, FJ000103ResBody> {

	constructor(public telegram: TelegramService<FJ000103ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService) {
		super(telegram, errorHandler, 'FJ000103');
	}
	send(data: FJ000103ReqBody, reqHeader): Promise<any> {


		/**
		 *
		 */
		let output = {
			status: false,
			msg: '',
			info_data: {},
			data: {}
		};
		// const userData = this.authService.getUserInfo();
		// if (!userData.hasOwnProperty("custId") || userData.custId == '') {
		//   return Promise.reject({
		//     title: 'ERROR.TITLE',
		//     content: 'ERROR.DATA_FORMAT_ERROR'
		//   });
		// }
		// data.custId = userData.custId;
		let form = new FJ000103ReqBody;
		form['custId'] = data.custId,
			form['applyAcct'] = data.applyAcct;
		form['applyCurr'] = data.applyCurr;
		form['custChName'] = data.custChName;
		form['custEnName'] = data.custEnName;
		form['certDate'] = data.certDate;
		form['chooseAmt'] = data.chooseAmt;
		form['applyAmount'] = data.applyAmount;
		form['amountLang'] = data.amountLang;
		form['amountPurpose'] = data.amountPurpose;
		form['addrItem'] = data.addrItem;
		form['sendAddr'] = data.sendAddr;
		form['contactPhone'] = data.contactPhone;
		form['mobilePhone'] = data.mobilePhone;
		form['fee'] = data.fee;
		form['postFee'] = data.postFee;
		form['copy'] = data.copy;
		form['trnsOutAcct'] = data.trnsOutAcct;
		form['email'] = data.email;
		form['trnsToken'] = data.trnsToken;
		return super.send(form, reqHeader).then(
			(resObj) => {
				let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
				if (telegram.hasOwnProperty('trnsRsltCode') && telegram['trnsRsltCode'] == '0'
					&& telegram.hasOwnProperty('hostCodeMsg')
				) {
					output.status = true;
					output.info_data = resObj;
					output.data = telegram;
					return Promise.resolve(output);
				} else {
					if (telegram.hasOwnProperty('hostCodeMsg') && telegram.hostCodeMsg !== '') {
						output.msg = telegram.hostCodeMsg;
					} else {
						output.msg = '交易失敗';
					}
					return Promise.reject(output);
				}
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}



