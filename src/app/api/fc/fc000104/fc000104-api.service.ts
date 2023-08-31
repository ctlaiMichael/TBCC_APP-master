/**
 * FC000104-取得分行代碼
 * [Response]
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FC000104ReqBody } from './fc000104-req';
import { FC000104ResBody } from './fc000104-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FC000104ApiService extends ApiBase<FC000104ReqBody, FC000104ResBody> {
	constructor(
		public telegram: TelegramService<FC000104ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'FC000104');
	}

	getData(data: FC000104ReqBody): Promise<any> {
		return super.send(data).then(
			(resObj) => {
				let output = {
					status: false,
					msg: '',
					info_data: {}, 
					data: [] //分行明細
				};

                let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				if (telegram.hasOwnProperty('branches') && telegram) {
                    output.info_data = this._formateService.transClone(telegram);

                    let check_branch = this.checkObjectList(telegram, 'branches.branch');
					if (typeof check_branch !== 'undefined') {
                        output.data = this.modifyTransArray(check_branch);
						// delete output.info_data['branches'];
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
