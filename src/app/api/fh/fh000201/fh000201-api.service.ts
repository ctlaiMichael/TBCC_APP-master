import { Injectable } from '@angular/core';
import { FH000201ResBody } from './fh000201-res';
import { FH000201ReqBody } from './fh000201-req';

import { AuthService } from '@core/auth/auth.service';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FH000201ApiService extends ApiBase<FH000201ReqBody, FH000201ResBody> {
	constructor(
		public telegram: TelegramService<FH000201ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _logger: Logger,
		private _formateService: FormateService
	) {
		super(telegram, errorHandler, 'FH000201');
	}

	getData(set_data,channel): Promise<any> {
		let output = {
			status: false,
			msg: 'Error',
			info_data: {},
			data_details: {},
			data1: [], //當日： kind = 0;
			data2: [], //非當日： kind = 1;
			data_unknow: [] // 不明狀態kind非0或1
		};

		let data = new FH000201ReqBody();
		if (!set_data.hasOwnProperty("hospitalId") ||
			set_data['hospitalId'] == '' ||
			!set_data.hasOwnProperty("branchId") ||
			set_data['branchId'] == ''
		) {
			output.msg = 'ERROR.DATA_FORMAT_ERROR';
			return Promise.reject(output);
		}
		//custId有登入帶進來，無登入為空
		const custId = this.authService.getCustId();
		if (custId != '') {
			data.custId = custId;
		} else {
			data.custId = '';
		}

		//處理日期
		if (set_data.birthday != '') {
			this._logger.log("set_data.birthday != ");
			// let birthday = this._formateService.transDate(set_data.birthday, { formate: 'yyyMMdd', chinaYear: true });
			// let y = birthday.substring(0, 3);
			// y = parseInt(y) + 1911;
			// data.birthday = y.toString() + birthday.substring(3, 7);
			let birthday = this._formateService.transDate(set_data.birthday, { formate: 'yyyyMMdd'});
			data.birthday = birthday;
		} else {
			data.birthday = '';
		}
		console.error('data.birthday = ',data.birthday);

		data.hospitalId = set_data.hospitalId;
		data.branchId = set_data.branchId;
		data.personId = set_data.personId;
		data.licenseNo = set_data.licenseNo;
		this._logger.log("api 201 data:", data);

		return super.send(data).then(
			(resObj) => {

				let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

				output.status = true;
				output.msg = '';
				output.info_data = jsonObj;
				output.data_details = jsonObj['details'];
				let check_details = this._formateService.checkField(output.info_data, 'details');

				if (jsonObj.hasOwnProperty("details") && jsonObj['details']
					&& jsonObj['details'].hasOwnProperty("detail")
					&& jsonObj['details']['detail']
				) {
					const tmp_list = this.modifyTransArray(jsonObj['details']['detail']);
					tmp_list.forEach(item => {
						if (item.kind == '0') {
							output.data1.push(item);
						} else if (item.kind == '1') {
							output.data2.push(item);
						} else {
							output.data_unknow.push(item);
						}
					});
				}
				if ((output.data1.length <= 0 && output.data2.length <= 0) || check_details==null) {
					if(channel=='1') {
						return Promise.reject({
							title: 'ERROR.TITLE',
							content: '查無待繳醫療費用'
						});
					} else {
						return Promise.reject({
							title: 'ERROR.TITLE',
							content: '查無待繳產險費用'
						});
					}
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
