/**
 * 個人基本資料查詢
 */
import { Injectable } from '@angular/core';
import { F9000401ResBody } from './f9000401-res';
import { F9000401ReqBody } from './f9000401-req';
import { ApiBase } from '@base/api/api-base.class';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class F9000401ApiService extends ApiBase<F9000401ReqBody, F9000401ResBody> {

	constructor(
		public telegram: TelegramService<F9000401ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService,
		public _formateService: FormateService
	) {
		super(telegram, errorHandler, 'F9000401');

	}

	getData(set_data?): Promise<any> {
		let data = new F9000401ReqBody();
		const custId = this.authService.getCustId();
		// if (!custId || custId == '') {
		// 	return Promise.reject({
		// 		title: 'ERROR.TITLE',
		// 		content: 'ERROR.DATA_FORMAT_ERROR'
		// 	});
		// }
		data.custId = custId;

		return super.send(data).then(
			(resObj) => {
				let output: any = {
					status: false,
					msg: 'ERROR.RSP_FORMATE_ERROR',
					info_data: {}
				};
				let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				output.info_data = jsonObj;
				//全部做checkfield
				output.info_data['bdoutDate'] = this._formateService.checkField(output.info_data, 'bdoutDate');
				output.info_data['bdoutTime'] = this._formateService.checkField(output.info_data, 'bdoutTime');
				output.info_data['bdoutId'] = this._formateService.checkField(output.info_data, 'bdoutId');
				output.info_data['id_no'] = this._formateService.checkField(output.info_data, 'id_no');
				output.info_data['id_no_error_check'] = this._formateService.checkField(output.info_data, 'id_no_error_check');
				output.info_data['business_no'] = this._formateService.checkField(output.info_data, 'business_no');
				output.info_data['bus_no_error_check'] = this._formateService.checkField(output.info_data, 'bus_no_error_check');
				output.info_data['birth_date'] = this._formateService.checkField(output.info_data, 'birth_date');
				output.info_data['profession_code'] = this._formateService.checkField(output.info_data, 'profession_code');
				output.info_data['province'] = this._formateService.checkField(output.info_data, 'province');
				output.info_data['phone_o'] = this._formateService.checkField(output.info_data, 'phone_o');
				output.info_data['phone_o_ext'] = this._formateService.checkField(output.info_data, 'phone_o_ext');
				output.info_data['phone_h'] = this._formateService.checkField(output.info_data, 'phone_h');
				output.info_data['phone_m'] = this._formateService.checkField(output.info_data, 'phone_m');
				output.info_data['nationnality'] = this._formateService.checkField(output.info_data, 'nationnality');
				output.info_data['customer_nature'] = this._formateService.checkField(output.info_data, 'customer_nature');
				output.info_data['person_mark'] = this._formateService.checkField(output.info_data, 'person_mark');
				output.info_data['address_mark'] = this._formateService.checkField(output.info_data, 'address_mark');
				output.info_data['agree_mark'] = this._formateService.checkField(output.info_data, 'agree_mark');
				output.info_data['code_home'] = this._formateService.checkField(output.info_data, 'code_home');
				output.info_data['home_addr'] = this._formateService.checkField(output.info_data, 'home_addr');
				output.info_data['code_notice'] = this._formateService.checkField(output.info_data, 'code_notice');
				output.info_data['notice_addr'] = this._formateService.checkField(output.info_data, 'notice_addr');
				output.info_data['code_company'] = this._formateService.checkField(output.info_data, 'code_company');
				output.info_data['address_company'] = this._formateService.checkField(output.info_data, 'address_company');
				output.info_data['email_no'] = this._formateService.checkField(output.info_data, 'email_no');
				output.info_data['account_no'] = this._formateService.checkField(output.info_data, 'account_no');
				output.info_data['transfer_type'] = this._formateService.checkField(output.info_data, 'transfer_type');
				output.info_data['name'] = this._formateService.checkField(output.info_data, 'name');
				output.info_data['pererson_name'] = this._formateService.checkField(output.info_data, 'pererson_name');
				output.info_data['account_no'] = this._formateService.checkField(output.info_data, 'account_no');
				output.info_data['account_name'] = this._formateService.checkField(output.info_data, 'account_name');
				output.info_data['cixrds'] = this._formateService.checkField(output.info_data, 'cixrds');
				output.info_data['cixrde'] = this._formateService.checkField(output.info_data, 'cixrde');
				output.info_data['ciremp'] = this._formateService.checkField(output.info_data, 'ciremp');
				output.info_data['cirds'] = this._formateService.checkField(output.info_data, 'cirds');
				output.info_data['cirus'] = this._formateService.checkField(output.info_data, 'cirus');
				output.info_data['cirns'] = this._formateService.checkField(output.info_data, 'cirns');
				output.info_data['pbrbw'] = this._formateService.checkField(output.info_data, 'pbrbw');
				output.info_data['cixinflg'] = this._formateService.checkField(output.info_data, 'cixinflg');
				output.info_data['cix33flg'] = this._formateService.checkField(output.info_data, 'cix33flg');
				output.info_data['gdpr'] = this._formateService.checkField(output.info_data, 'gdpr');
				output.info_data['cirpro'] = this._formateService.checkField(output.info_data, 'cirpro');
				output.info_data['cixslov'] = this._formateService.checkField(output.info_data, 'cixslov');
				output.info_data['ciixsper'] = this._formateService.checkField(output.info_data, 'ciixsper');
				output.info_data['cixspmk'] = this._formateService.checkField(output.info_data, 'cixspmk');
				output.info_data['cixp3cid'] = this._formateService.checkField(output.info_data, 'cixp3cid');
				output.info_data['name_long'] = this._formateService.checkField(output.info_data, 'name_long');
				output.info_data['account_name_long'] = this._formateService.checkField(output.info_data, 'account_name_long');
				output.info_data['memo'] = this._formateService.checkField(output.info_data, 'memo');

				output.status = true;
				output.msg = '';
				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}




