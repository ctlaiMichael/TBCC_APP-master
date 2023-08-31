/**
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { F6000302ApiService } from '@api/f6/f6000302/f6000302-api.service';
import { F6000301ApiService } from '@api/f6/f6000301/f6000301-api.service';
import { ForexCurrencyLimitDeposit } from '@conf/terms/forex/currency-limit-deposit';
import { F6000301ReqBody } from '@api/f6/f6000301/f6000301-req';
// import { HitrustPipeService } from '@share_pipe/hitrustPipe';

@Injectable()
export class DemandToTimeService {
	/**
	 * 參數處理
	 */
	constructor(
		private _logger: Logger,
		private f6000302: F6000302ApiService,
		private f6000301: F6000301ApiService
	) { }

	/**
	 * 選單資料設定
	 */

	public getSelectData() {

		let selectObj = {
			transfrTimes: {
				"00": "1星期"
				, "01": "1個月"
				, "03": "3個月"
				, "06": "6個月"
				, "09": "9個月"
				, "12": "12個月"
			}
			, autoTransCode: {
				"0": "到期解約本息入綜活存"
				, "1": "到期本金續存，利息入綜活存"
				, "2": "到期本息續存"
			}
			, computeIntrstType: {
				"1": "按月領息"
				, "5": "到期領息"
			}
		}
		let data = {};
		// 模擬取得過程
		data = selectObj;
		return data;

	}

	public getSysData(): Promise<any> {

		return new Promise((resolve, reject) => {

			let output = {
				status: false,
				msg: 'SysError',
				info_data: {},
				data: [],
			};

			let telegram = {
				details: {
					detail: [
						{
							csutId: "A123456789"
							, openBranchId: "1"
						}

					]
				}
			};
			output.status = true;
			output.msg = '';

			output.info_data = telegram;
			if (telegram.hasOwnProperty('details')
				&& telegram['details'].hasOwnProperty('detail')
				&& typeof telegram['details']['detail'] === 'object') {
				output.data = telegram['details']['detail'];
				if (!(telegram['details']['detail'] instanceof Array)) {
					output.data = [];
					output.data.push(telegram['details']['detail']);
				}
			}


			resolve(output);
		});

	}
	/**
	 *  f6000302電文
	 * @param reqObj 
	 */

	public getRate(reqObj): Promise<any> {

		return this.f6000302.getData(reqObj).then(
			(resObj) => {
				return Promise.resolve(resObj);
			},
			(error_obj) => {
				return Promise.reject(error_obj);
			}
		);

	}
	/**
	 *  f6000301電文
	 * @param reqObj 
	 */
	public onSend(set_data, security): Promise<any> {
		let reqObj = new F6000301ReqBody();
		if (set_data.hasOwnProperty('trnsfrOutAccnt') && set_data.hasOwnProperty('trnsfrOutAccnt') && set_data.hasOwnProperty('trnsfrOutCurr') &&
			set_data.hasOwnProperty('transfrTimes') && set_data.hasOwnProperty('autoTransCode') && set_data.hasOwnProperty('transfrAmount') &&
			set_data.hasOwnProperty('businessType') && set_data.hasOwnProperty('trnsToken') && set_data.hasOwnProperty('computeIntrstType')) {
			reqObj.trnsfrOutAccnt = set_data.trnsfrOutAccnt;
			reqObj.trnsfrOutAccnt = set_data.trnsfrOutAccnt;
			reqObj.trnsfrOutCurr = set_data.trnsfrOutCurr;
			reqObj.transfrTimes = set_data.transfrTimes;
			reqObj.autoTransCode = set_data.autoTransCode;
			reqObj.transfrAmount = set_data.transfrAmount;
			reqObj.businessType = set_data.businessType;
			reqObj.trnsToken = set_data.trnsToken;
			reqObj.computeIntrstType = set_data.computeIntrstType;
		}
		let reqHeader = {
			header: security.securityResult.headerObj
		};
		return this.f6000301.getData(reqObj, reqHeader).then(
			(resObj) => {
				if (resObj.status) {
					return Promise.resolve(resObj);
				} else {
					return Promise.reject(resObj);
				}
			},
			(error_obj) => {
				return Promise.reject(error_obj);
			}
		);

	}

	/**
	 * 模擬req電文
	 */

	public getResultObj(reqObj: any) {
		return new Promise((resolve, reject) => {

			let output = {
				status: false,
				msg: 'SysError',
				resultObj: {},
			};

			let telegram = {
				"custId": "B1202812720"
				, "hostCode": "4001"
				, "trnsNo": "1111"
				, "trnsDateTime": "9990101000000"
				, "hostCodeMsg": ""
				, "trnsfrOutAccnt": "轉出帳號"
				, "trnsfrOutCurr": "01"
				, "trnsfrOutCurrDesc": "美元"
				, "trnsfrOutAccntBal": "3000.93"
				, "trnsfrAmount": "1000.00"
				, "trnsfrInAccnt": "轉入定存帳號"
				, "transfrTimes": "00"
				, "transfrTimesDesc": "一星期"
				, "autoTransCode": "1"
				, "autoTransCodeDesc": "到期本金續存，利息入綜活存"
				, "intrstRate": "0.2700"
				, "trnsRsltCode": "0"
				, "computeIntrstType": "1"
				, "computeIntrstTypeDsc": "按月領息"
			}

			if (typeof telegram === 'object') {
				output.resultObj = telegram;

			}
			output.status = true;
			output.msg = '';
			if (typeof output.resultObj === null) {
				output.msg = 'Empty';
				reject(output);
				return false;
			}


			resolve(output);
		});

	}

	checkMoney(checkMoney, country) {
		let data = {
			status: true,
			msg: '', // 請輸入金額
			data: '',
		};
		// let check_trim=checkMoney.trim();
		// if ( check_trim== '') {
		//   data.msg = '請輸入轉存金額';
		//   data.status = false;
		// };
		console.error('checkmoney',checkMoney);
		if (country == '') {
			data.msg = '請先選擇轉存幣別';
			data.status = false;
		}
		let checkIndex = checkMoney.toString();
		if (checkIndex.indexOf('0') == 0) {
			data.msg = '轉存金額第一位數不可為0或非數字';
			data.status = false;
		}

		const set_data = new ForexCurrencyLimitDeposit();

		let currency_list = set_data.currency_list;

		let currency_amount;
		currency_list.forEach(element => {
			if (country == element['currency']) {
				currency_amount = element['amount'];
				let checkDecimal = checkMoney.toString().indexOf('.');
				if (element['currency'] == 'JPY' && checkDecimal > 0) {
					data.msg = '此計價幣別' + element['currency'] + '之交易金額僅提供整數交易(不可具有小數位)';
					data.status = false;
				}

				if (parseInt(checkMoney) < parseInt(currency_amount)) {
					data.msg = '您所選擇之幣別' + element['currency'] + '轉存之金額不得低於' + currency_amount;
					data.status = false;
				}

			};
		});

		if (currency_list['currency'] == country) {
		}


		return data;
	}
}


