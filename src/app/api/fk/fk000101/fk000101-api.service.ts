import { Injectable } from '@angular/core';
import { FK000101ReqBody } from './fk000101-req';
import { FK000101ResBody } from './fk000101-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FK000101ApiService extends ApiBase<FK000101ReqBody, FK000101ResBody> {

	constructor(public telegram: TelegramService<FK000101ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService) {
		super(telegram, errorHandler, 'FK000101');
	}
	send(data: FK000101ReqBody): Promise<any> {
		/**
		 * 通訊地址查詢
		 */
		const userData = this.authService.getUserInfo();
		if (!userData.hasOwnProperty('custId') || userData.custId == '') {
			return Promise.reject({
				title: 'ERROR.TITLE',
				content: 'ERROR.DATA_FORMAT_ERROR'
			});
		}
		data.custId = userData.custId;
		return super.send(data).then(
			(resObj) => {
				// 資料整理
				let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
				let returnObj = {
					custName: '',
					city: [],
					list: {},
					lostType: []
				};
				let lostTypeName = {
					1: '金融卡',
					2: '信用卡',
					3: '存摺',
					4: '印鑑',
					5: '存單'
				};

				if (telegram.hasOwnProperty('lostTypes')) {
					for (let val of telegram.lostTypes) {
						if (lostTypeName.hasOwnProperty(val.type)) {
							val['name'] = lostTypeName[val.type];
						} else {
							val['name'] = '';
						}
					}
				}
				telegram.lostTypes.splice(0, 0, { 'type': '0', 'replacementFlag': '0', 'replacementWay': '0', 'name': '請選擇種類' });
				returnObj.lostType = telegram.lostTypes;
				if (telegram.hasOwnProperty('custName')) {
					returnObj.custName = telegram.custName;
				}
				if (telegram.hasOwnProperty('branches')) {
					// 地址分行整理
					for (let Obj of telegram.branches) {
						if (returnObj.city.indexOf(Obj.city) < 0) {
							// 塞縣市類別
							returnObj.city.push(Obj.city);
						}
						// 塞分行清單
						if (returnObj.list[Obj.city] === undefined) {
							returnObj.list[Obj.city] = [];
						}
						returnObj.list[Obj.city].push({ 'branchId': Obj.branchId, 'branchName': Obj.branchName });

					}
					returnObj.city.splice(0, 0, '請選擇寄達地區');
				}
				return Promise.resolve(returnObj);
			},
			(errorObj) => {
				// 無法取得
				return Promise.reject(errorObj);
			}
		);
	}
}



