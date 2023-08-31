/**
* Header
* FH000302-醫院__定查詢
*
*/
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FH000302ResBody } from './fh000302-res';
import { FH000302ReqBody } from './fh000302-req';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';


@Injectable()
export class FH000302ApiService extends ApiBase<FH000302ReqBody, FH000302ResBody> {
	constructor(
		public telegram: TelegramService<FH000302ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService,
		private _formateService: FormateService) {
		super(telegram, errorHandler, 'FH000302');
	}

	getBranch(set_data): Promise<any> {

		let data = new FH000302ReqBody();
		// 在送電文前檢查
		data.hospitalId = this._formateService.checkField(set_data, 'hospitalId');
		data.branchId = this._formateService.checkField(set_data, 'branchId');

		if (data.hospitalId == '' || data.branchId == '') {
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
					data: [],                 // infoDetails
					showInfo: false,          // 顯示表單明細(ex:醫療資訊)
					showBill: true,          // 顯示表單明細(ex:醫療費用)
					showintraBank: false,     // 行動銀行轉帳顯示註記
					showeBill: false,         // 本人帳戶繳費顯示註記(ID+ACCOUNT)
					showicCard: false,        // 金融卡轉帳顯示註記
					note: {
						note1: '',            // 是否顯示提醒您(選單)
						note2: '',            //             (編輯)
						note3: ''             //             (繳費)
					}
				};

				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

				output.info_data = telegram;

				if (telegram.hasOwnProperty('infoLink') && telegram.hasOwnProperty('infoDetails') &&
					telegram['infoDetails'] && telegram) {
					output.showInfo = true;
					if (telegram['infoLink'] == '0') {
						output.showInfo = false;
					} else {
						let check_data = this.checkObjectList(telegram, 'infoDetails.infoDetail');
						if (typeof check_data !== 'undefined') {
							output.data = this.modifyTransArray(check_data);
							delete output.info_data['infoDetails'];
						}
					}
				}

				// 費用繳納:
				if (telegram.hasOwnProperty("billLink") && telegram['billLink'] == "0") {
					output.showBill = false;
				}

				// 行動銀行轉帳顯示註記
				if (telegram.hasOwnProperty("intraBankTrns") && telegram['intraBankTrns'] == "Y") {
					output.showintraBank = true;
				}

				// 本人帳戶繳費顯示註記(ID+ACCOUNT)
				if (telegram.hasOwnProperty("eBillTrns") && telegram['eBillTrns'] == "Y") {
					output.showeBill = true;
				}

				// 金融卡轉帳顯示註記
				if (telegram.hasOwnProperty("icCardTrns") && telegram['icCardTrns'] == "Y") {
					output.showicCard = true;
				}

				// note1為空，提醒您不顯示(分院選單)
				output.note.note1 = (telegram.hasOwnProperty('note1')) ? telegram['note1'] : '';
				output.note.note2 = (telegram.hasOwnProperty('note2')) ? telegram['note2'] : '';
				output.note.note3 = (telegram.hasOwnProperty('note3')) ? telegram['note3'] : '';

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

