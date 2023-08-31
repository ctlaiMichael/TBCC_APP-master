import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000603ResBody } from './fi000603-res';
import { FI000603ReqBody } from './fi000603-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000603ApiService extends ApiBase<FI000603ReqBody, FI000603ResBody> {
	constructor(
		public telegram: TelegramService<FI000603ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService,
		private _logger: Logger
	) {
		super(telegram, errorHandler, 'FI000603');
	}


	/**
	 * 基金預約交易查詢
	 * req
	 *
	 * @param page 頁次
	 * @param sort 排序
	 */
	getData(): Promise<any> {
		const userData = this.authService.getUserInfo();

		if (!userData.hasOwnProperty('custId') || userData.custId === '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		let data = new FI000603ReqBody();
		data.custId = userData.custId; // user info;

		return this.send(data).then(
			(resObj) => {
				const output = {
					status: false,
					msg: 'ERROR.DEFAULT',
					info_data: {},
					data: []
				};
				this._logger.step('FUND', 'body:', userData.hasOwnProperty('body'));
				const jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				const modify_data = this._modifyRespose(jsonObj);
				this._logger.step('FUND', 'resObj:', resObj);
				output.data = modify_data.data;
				output.info_data = modify_data.info_data;

				this._logger.step('FUND', 'output:', output);

				this._logger.step('FUND', 'this.length: ', output.data.length);
				// if (output.data.length <= 0) {
				//     output.msg = 'ERROR.EMPTY';
				//     return Promise.reject(output);
				// }
				output.status = true;
				output.msg = '';
				return Promise.resolve(output);
			},
			(errorObj) => {
				this._logger.step('FUND', 'errorObj');
				return Promise.reject(errorObj);
			}
		);
	}

	/**
	 * Response整理
	 * @param jsonObj 資料判斷
	 */
	private _modifyRespose(jsonObj) {
		const output = {
			info_data: {},
			data: [],
			answerSheet: {}
		};
		output.info_data = this._formateService.transClone(jsonObj);
		if (jsonObj.hasOwnProperty('topicLists') && jsonObj['topicLists']
			&& jsonObj['topicLists'].hasOwnProperty('topic')
			&& jsonObj['topicLists']['topic']
		) {
			output.data = this.modifyTransArray(jsonObj['topicLists']['topic']);
			output.data.forEach(function (item) {
				if (item.hasOwnProperty('multi') && item['multi'] === 'Y') {
					item.typeCtrl = 'checkbox';
				} else {
					item.typeCtrl = 'radio';
				}
			});

			delete output.info_data['topicLists'];
		}

		return output;
	}
}
