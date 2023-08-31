/**
 * F9000100-取得紓困狀態
 * [Response]
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F9000100ReqBody } from './f9000100-req';
import { F9000100ResBody } from './f9000100-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class F9000100ApiService extends ApiBase<F9000100ReqBody, F9000100ResBody> {
	constructor(
		public telegram: TelegramService<F9000100ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'F9000100');
	}

	getData(data: F9000100ReqBody): Promise<any> {
		return super.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					msg: '',
					info_data: {}, 
					data: [] 
				};

                let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				// if (telegram.hasOwnProperty('branches') && telegram) {
                //     output.info_data = this._formateService.transClone(telegram);

                //     let check_branch = this.checkObjectList(telegram, 'branches.branch');
				// 	if (typeof check_branch !== 'undefined') {
                //         output.data = this.modifyTransArray(check_branch);
				// 		// delete output.info_data['branches'];
				// 	}
				// }
				output.info_data = this._formateService.transClone(telegram);
                output.status = true;
				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}
