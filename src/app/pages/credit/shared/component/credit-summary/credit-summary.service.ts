/**
 * 授信業務
 * 借款資訊 - 借款查詢來自API F9000201ApiService
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';

@Injectable()

export class CreditSummaryService {
	/**
	 * 參數處理
	 */

	constructor(
		private _logger: Logger,
		private _formateService: FormateService,
		private _checkService: CheckService
	) {
	}


	/**
	 * 查詢帳戶匯總
	 * @param acctNo
	 * @param acctType
	 */
	getSummaryData(acctGroup: string, reqObj: object): Promise<any> {
		// const acctType = this._formateService.checkField(reqObj, 'acctType');
		this._logger.step('Credit', 'getDetailData', acctGroup, reqObj);
		switch (acctGroup) {
			case 'LOAN': // 借款查詢
				return this.getDataLoan(reqObj);
			default:
				return Promise.reject({
					title: 'ERROR.TITLE',
					content: 'ERROR.DATA_FORMAT_ERROR'
				});
		}
	}



	// --------------------------------------------------------------------------------------------
	//  ____       _            _         _____                 _
	//  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
	//  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
	//  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
	//  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
	// --------------------------------------------------------------------------------------------
	/**
	 * 借款查詢
	 * @param reqObj
	 */
	private getDataLoan(reqObj: object): Promise<any> {
		let currency = ''; // 幣別金額
		let output = {
			dataTime: '',
			data: {
				balance: '', // 現欠本金
				nowRate: '', // 目前利率
				loanCredit: '', // 借款額度
				loanDate: '', // 借款日
				expirDate: '', // 到期日
				ltrateDueDate: '', // 上次利息收訖日
				isranDueDate: '', // 保險到期日
				aupayAccount: '', // 委託繳息帳號
				anuMonPay: '' // 每月攤還本息
			}
		};
		// 目前利率
		output.dataTime = this._formateService.checkField(reqObj, 'dataTime');
		// 目前利率
		output.data.nowRate = this._formateService.checkField(reqObj, 'nowRate');
		// 委託繳息帳號
		output.data.aupayAccount = this._formateService.checkField(reqObj, 'aupayAccount');
		// == Money == //
		// 現欠本金
		output.data.balance = this._formateService.checkField(reqObj, 'balance');
		// 借款額度
		output.data.loanCredit = this._formateService.checkField(reqObj, 'loanCredit');
		// 每月攤還本息
		output.data.anuMonPay = this._formateService.checkField(reqObj, 'anuMonPay');

		// == Date == //
		// loanDate
		output.data.loanDate = this._formateService.checkField(reqObj, 'loanDate');
		// expirDate
		output.data.expirDate = this._formateService.checkField(reqObj, 'expirDate');
		// ltrateDueDate
		output.data.ltrateDueDate = this._formateService.checkField(reqObj, 'ltrateDueDate');
		// isranDueDate
		output.data.isranDueDate = this._formateService.checkField(reqObj, 'isranDueDate');
		return Promise.resolve(output);
	}
}


