/**
* Header
* FH000301-醫院清單查詢
*
*/
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FH000301ResBody } from './fh000301-res';
import { FH000301ReqBody } from './fh000301-req';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';



@Injectable()
export class FH000301ApiService extends ApiBase<FH000301ReqBody, FH000301ResBody> {
	constructor(
		public telegram: TelegramService<FH000301ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'FH000301');
	}

	getData(set_data): Promise<any> {

		let data = new FH000301ReqBody();
		// 在送電文前檢查
		data.type = this._formateService.checkField(set_data, 'type');
		if (data.type == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}

		return this.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					msg: 'ERROR.RSP_FORMATE_ERROR',
					info_data: {},
					data: []
				};
				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				if (telegram.hasOwnProperty('details') && telegram) {
					output.info_data = this._formateService.transClone(telegram);

					let check_detail = this.checkObjectList(telegram, 'details.detail');
					if (typeof check_detail !== 'undefined') {
						output.data = this.modifyTransArray(check_detail);
						delete output.info_data['details'];
					}
				}

				output.status = true;
				output.data = this.modifyHospitalData(output.data);
				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}



	/**
	 * 將取回資料再處理
	 * @param set_data
	 */
	private modifyHospitalData(set_data: Object) {
		let output_data = [];
		if (!(set_data instanceof Array)) {
			return output_data;
		}

		set_data.forEach(item => {
			let hospiatl_data = item;
			//otpSwitch 中台可能回null，需處理
			hospiatl_data['otpSwitch'] = this._formateService.checkField(hospiatl_data, 'otpSwitch');
			hospiatl_data['_otpFlag'] = (hospiatl_data.hasOwnProperty('otpSwitch') && hospiatl_data['otpSwitch'].toUpperCase() == 'Y') ? true : false;
			hospiatl_data['_showBranch'] = false; // 是否顯示分行選擇
			if (hospiatl_data.hasOwnProperty('count') && hospiatl_data.count !== '' && parseInt(hospiatl_data.count) > 1) {
				hospiatl_data['_showBranch'] = true;
			}
			// branch list
			hospiatl_data['branch_menu'] = [];
			if (hospiatl_data.hasOwnProperty('branch') && typeof hospiatl_data['branch'] === "string") {
				// T0-臺大醫院,y0-台大醫院雲林分院
				let tmp_branch = hospiatl_data['branch'].split(",");
				// let branch_set = [];

				tmp_branch.forEach(sub_item => {
					// T0-臺大醫院
					let sub_branch = {
						branchId: '',//T0
						branchName: '',//臺大醫院
						source: sub_item, //T0-臺大醫院(存放資源)
						showName: '' //T0-臺大醫院(分院編號+分院名)
					};

					let tmp = sub_item.split("-");
					if (tmp.length == 2) {
						sub_branch['branchId'] = tmp[0];
						sub_branch['branchName'] = tmp[1];
						sub_branch['showName'] = sub_item;
						// sub_branch['showName'] = sub_branch['branchId'].toUpperCase() + ': ' + sub_branch['branchName'];
						hospiatl_data['branch_menu'].push(sub_branch);
					}
				});
			}
			output_data.push(hospiatl_data); // hospital
		});
		return output_data;
	}
}
