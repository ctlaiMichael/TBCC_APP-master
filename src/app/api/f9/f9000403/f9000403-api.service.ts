import { FormateService } from '@shared/formate/formate.service';
import { Injectable, Output } from '@angular/core';
import { F9000403ResBody } from './f9000403-res';
import { F9000403ReqBody } from './f9000403-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class F9000403ApiService extends ApiBase<F9000403ReqBody, F9000403ResBody> {

	constructor(
		public telegram: TelegramService<F9000403ResBody>,
		public errorHandler: HandleErrorService,
		private authService: AuthService,
		public _formateService: FormateService
	) {
		super(telegram, errorHandler, 'F9000403');

	}

	getData(setData: any): Promise<any> {
		let data = new F9000403ReqBody();
		const usercustId = this.authService.getCustId();
		data.custId = usercustId;
		data.txKind = setData.txKind;
		data.ebkcaseno = setData.ebkCaseNo;
		return super.send(data).then(
			(resObj) => {
				let output: any = {
					status: false,
					msg: 'ERROR.DEFAULT',
					info_data: {},
					apply_trade_detail: [], //行業別
					metier_detail: [], //職業別細項
					metier_sub_detail: [], //職業別分項(整理過)
					detail: [] //同意事項內容
				};
				const transRes = TransactionApiUtil.modifyResponse(resObj);

				let telegram = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
				output.msg = telegram['hostCodeMsg'];
				output.status = true;
				output.msg = transRes.msg;
				output.info_data = telegram;
				//行業別
				if (telegram.hasOwnProperty('apply_trade_details') && telegram['apply_trade_details'] && typeof telegram['apply_trade_details'] === 'object'
					&& telegram['apply_trade_details'].hasOwnProperty('apply_trade_detail')) {
					output.apply_trade_detail = this.modifyTransArray(telegram['apply_trade_details']['apply_trade_detail']);
				}
				//職業別細項
				if (telegram.hasOwnProperty('metier_details') && telegram['metier_details'] && typeof telegram['metier_details'] === 'object'
					&& telegram['metier_details'].hasOwnProperty('metier_detail')) {
					output.metier_detail = this.modifyTransArray(telegram['metier_details']['metier_detail']);

					//使用細項整理分項
					let temp = this.formateMetierSub(telegram['metier_details']['metier_detail']);
					output.metier_sub_detail = temp['data'];
				}
				//職業別分項
				// if (telegram.hasOwnProperty('metier_sub_details') && telegram['metier_sub_details'] && typeof telegram['metier_sub_details'] === 'object'
				// 	&& telegram['metier_sub_details'].hasOwnProperty('metier_sub_detail')) {
				// 	output.metier_sub_detail = this.modifyTransArray(telegram['metier_sub_details']['metier_sub_detail']);
				// }
				//同意事項內容
				// if (telegram.hasOwnProperty('details') && telegram['details'] && typeof telegram['details'] === 'object'
				// 	&& telegram['details'].hasOwnProperty('detail')) {
				// 	output.detail = this.modifyTransArray(telegram['details']['detail']);
				// }
				let check_obj = this.checkObjectList(telegram, 'details.detail');
				if (typeof check_obj !== 'undefined') {
					output.detail = this.modifyTransArray(check_obj);
				}
				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}

	public formateMetierSub(detail) {
		//回傳
		let output = {
			status: false,
			msg: '',
			data: [], //分項選單
			another: [] //無分項選單
		};

		//一筆細項資料，temp_1.detail:儲存多筆分項資料
		//軍警 CN02:- 、CN01:'01'
		let temp_01 = {
			CN01: '',
			CNAME1: '',
			CN02: '',
			//存放分項
			detail: []
		};
		//教職 CN02:- 、CN01:'02'
		let temp_02 = {
			CN01: '',
			CNAME1: '',
			CN02: '',
			//存放分項
			detail: []
		};
		//醫事人員 CN02:- 、CN01:'11'
		let temp_11 = {
			CN01: '',
			CNAME1: '',
			CN02: '',
			//存放分項
			detail: []
		};
		let index_01 = 0;
		let index_02 = 0;
		let index_11 = 0;
		// {   //細項(第一層)
		// 	CN01: '', //代號
		// 	CNAME1: '', //中文說明
		// 	CN02: '', //判斷是否為細項 '' '-' undefind，為細項
		// 	detail: [ //細項對應之分項，整理過
		// 		{
		// 			CN01: '',
		// 			CNAME1: '',
		// 			CN02: ''
		// 		}
		// 	]
		// }

		//第一層，確認該筆是細項
		detail.forEach(item => {
			//判斷是否為細項欄位，CN02來判斷
			//軍警
			if ((item['CN02'] == '' || item['CN02'] == '-' || typeof item['CN02'] == 'undefined')
				&& item['CN01'] == '01') {
				temp_01['CN01'] = item['CN01'];
				temp_01['CNAME1'] = item['CNAME1'];
				temp_01['CN02'] = item['CN02'];
			} else if ((item['CN02'] != '' || item['CN02'] != '-' || typeof item['CN02'] != 'undefined')
				&& item['CN02'] == '01') {
				temp_01['detail'].push(item);
				// if(temp_01['detail'].length!=0) {
				// 	i++;
				// }
				//教職	
			} else if ((item['CN02'] == '' || item['CN02'] == '-' || typeof item['CN02'] == 'undefined')
				&& item['CN01'] == '02') {
				temp_02['CN01'] = item['CN01'];
				temp_02['CNAME1'] = item['CNAME1'];
				temp_02['CN02'] = item['CN02'];
			} else if ((item['CN02'] != '' || item['CN02'] != '-' || typeof item['CN02'] != 'undefined')
				&& item['CN02'] == '02') {
				temp_02['detail'].push(item);
				//醫事人員
			} else if ((item['CN02'] == '' || item['CN02'] == '-' || typeof item['CN02'] == 'undefined')
				&& item['CN01'] == '11') {
				temp_11['CN01'] = item['CN01'];
				temp_11['CNAME1'] = item['CNAME1'];
				temp_11['CN02'] = item['CN02'];
			} else if ((item['CN02'] != '' || item['CN02'] != '-' || typeof item['CN02'] != 'undefined')
				&& item['CN02'] == '11') {
				temp_11['detail'].push(item);
				//細項欄位，但無分項
			} else {
				let another = {
					CN01: '',
					CNAME1: '',
					CN02: '',
				};
				another['CN01'] = item['CN01'];
				another['CNAME1'] = item['CNAME1'];
				another['CN02'] = item['CN02'];
				output.data.push(item);
			}
		});

		output.data.unshift(temp_01, temp_02, temp_11);
		// output.data.push(temp_01); //軍警
		// output.data.push(temp_02); //教職
		// output.data.push(temp_11); //醫事人員
		output.msg = 'success';
		output.status = true;
		return output;
	}
}




