import { Injectable } from '@angular/core';
import { FH000104ResBody } from './fh000104-res';
import { FH000104ReqBody } from './fh000104-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { logger } from '@shared/util/log-util';

@Injectable()
export class FH000104ApiService extends ApiBase<FH000104ReqBody, FH000104ResBody> {
	constructor(public telegram: TelegramService<FH000104ResBody>,
		public errorHandler: HandleErrorService,
		private _formateService: FormateService,
		public authService: AuthService,
		private _logger: Logger
	) {
		super(telegram, errorHandler, 'FH000104');
	}

	getQuery(set_data,reqHeader): Promise<any> {
		let output = {
			status: false,
			msg: 'Error',
			error_type: '',
			info_data: {},
			data: []
		};
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty('custId') || userData.custId === '') {
			this._logger.step('FUND', 'userData undefined');
			return Promise.reject({
				  title: 'ERROR.TITLE',
				  content: 'ERROR.DATA_FORMAT_ERROR'
			  });
		  }

		let data = new FH000104ReqBody();
		data.custId = userData.custId;
		data.hospitalId = set_data.hospitalId;
		data.branchId = set_data.branchId;
		data.personId = set_data.personId;
		data.queryTimeFlag = set_data.queryTimeFlag;
		data.trnsAcctNo = set_data.trnsAcctNo;
		data.totalCount = set_data.totalCount;
		data.totalAmount = set_data.totalAmount;
		data.businessType = set_data.businessType;
		data.trnsToken = set_data.trnsToken;
		data.isMySelfPayment = set_data.isMySelfPayment;
		data.details = set_data.details;
		logger.error('api data:',data);

		return super.send(data,reqHeader).then(
			(resObj) => {

				let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				output.info_data = jsonObj;
				let check_obj = this.checkObjectList(jsonObj, 'details.detail');
				if (typeof check_obj !== 'undefined') {
					output.data = this.modifyTransArray(check_obj);
					delete output.info_data['details'];
				}
				output.info_data['trnsFee'] = this._formateService.checkField(output.info_data, 'trnsFee'); // 手續費
				output.info_data['trnsNo'] = this._formateService.checkField(output.info_data, 'trnsNo'); // 單據列印序號
				output.info_data['stan'] = this._formateService.checkField(output.info_data, 'stan'); // 銀行交易序號
				output.info_data['hostCodeMsg'] = this._formateService.checkField(output.info_data, 'hostCodeMsg'); // 主機訊息代碼
				output.info_data['trnsRsltCode'] = this._formateService.checkField(output.info_data, 'trnsRsltCode'); // 交易結果代碼
				output.info_data['specialInfo'] = this._formateService.checkField(output.info_data, 'specialInfo'); // specialInfo
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

				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}
