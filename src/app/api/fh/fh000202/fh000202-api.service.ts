import { Injectable } from '@angular/core';
import { FH000202ResBody } from './fh000202-res';
import { FH000202ReqBody } from './fh000202-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FH000202ApiService extends ApiBase<FH000202ReqBody, FH000202ResBody> {
	constructor(public telegram: TelegramService<FH000202ResBody>,
		public errorHandler: HandleErrorService,
		private _formateService: FormateService,
		public authService: AuthService
	) {
		super(telegram, errorHandler, 'FH000202');
	}

	send(data: FH000202ReqBody): Promise<any> {
		//custId有登入帶進來，無登入為空
		const custId = this.authService.getCustId();
		if (custId != '') {
			data.custId = custId;
		} else {
			data.custId = '';
		}
		let reqData = new FH000202ReqBody();
		reqData['custId'] = this._formateService.checkField(data, 'custId');
		reqData['hospitalId'] = this._formateService.checkField(data, 'hospitalId');
		reqData['branchId'] = this._formateService.checkField(data, 'branchId');
		reqData['personId'] = this._formateService.checkField(data, 'personId');
		reqData['trnsOutBank'] = this._formateService.checkField(data, 'trnsOutBank');
		reqData['trnsOutAcct'] = this._formateService.checkField(data, 'trnsOutAcct');
		reqData['totalCount'] = this._formateService.checkField(data, 'totalCount');
		reqData['totalAmount'] = this._formateService.checkField(data, 'totalAmount');
		reqData['queryTime'] = this._formateService.checkField(data, 'queryTime');
		reqData['trnsToken'] = this._formateService.checkField(data, 'trnsToken');
		reqData['details'] = this._formateService.checkField(data, 'details');

		return super.send(reqData).then(
			(resObj) => {
				let output = {
					info_data: {},
					data: [],
					status: false,
					msg: '',
					error_type: ''
				};

				let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

				output.info_data = jsonObj;
				let check_obj = this.checkObjectList(jsonObj, 'rdetails.detail');
				if (typeof check_obj !== 'undefined') {
					output.data = this.modifyTransArray(check_obj);
					delete output.info_data['rdetails'];
				}
				output.info_data['trnsFee'] = this._formateService.checkField(output.info_data, 'trnsFee'); // 手續費
				output.info_data['trnsNo'] = this._formateService.checkField(output.info_data, 'trnsNo'); // 單據列印序號
				output.info_data['stan'] = this._formateService.checkField(output.info_data, 'stan'); // 銀行交易序號
				output.info_data['hostCodeMsg'] = this._formateService.checkField(output.info_data, 'hostCodeMsg'); // 主機訊息代碼
				output.info_data['trnsRsltCode'] = this._formateService.checkField(output.info_data, 'trnsRsltCode'); // 交易結果代碼
				output.info_data['detailInfoURL'] = this._formateService.checkField(output.info_data, 'detailInfoURL'); // 病友注意事項及用藥資訊URL

				if (output.info_data['trnsRsltCode'] == '') {
					return Promise.reject({
						title: 'ERROR.TITLE',
						content: 'ERROR.RSP_FORMATE_ERROR'
					});
				}
				// 交易結果狀態處理:
				// trnsRsltCode	交易結果代碼 0-交易成功,1-交易失敗,X-交易異常,2-已扣款交易異常請至櫃台處理
				output.status = false;
				if (output.info_data['trnsRsltCode'] == '0') {
					output.status = true;
					output.msg = '';
				} else if (output.info_data['trnsRsltCode'] == 'X' || output.info_data['trnsRsltCode'] == '2') {
					output.error_type = 'warning';
				} else {
					output.error_type = 'error';
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
