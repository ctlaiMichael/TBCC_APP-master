/**
 * Header
 * 
 * 中華電信費
 * F7000104-繳費交易約定轉出帳號查詢
 * F7000401-中華電信欠費查詢
 * F7000402-繳納中華電信費
 * 
 */
import { Injectable } from '@angular/core';
import { F7000401ApiService } from '@api/f7/f7000401/f7000401-api.service';
import { F7000402ApiService } from '@api/f7/f7000402/f7000402-api.service';
import { F7000104ApiService } from '@api/f7/f7000104/f7000104-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';


@Injectable()
export class HinetFeeService {
	/**
	 * 參數處理
	 */

	constructor(
		private f7000104: F7000104ApiService,
		private f7000401: F7000401ApiService,
		private f7000402: F7000402ApiService,
		private _handleError: HandleErrorService
	) {
	}

	/**
	 * 等待兩道電文回來
	 * @param reqObj 
	 */
	getData(reqObj: any): Promise<any> {
		let output = {
			account: [],
			hinetFeeBill: {}
		}
		return this.getHinetFee(reqObj).then(
			(sucess) => {
				output.hinetFeeBill = sucess;
				return this.getAccount().then(
					(sucess) => {
						output.account = sucess;
						return Promise.resolve(output)
					},
					(errorObj) => {
						errorObj['type'] = 'dialog';
						this._handleError.handleError(errorObj);
						return Promise.reject(output);
					}
				);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}

	/**
	 * F7000104-繳費交易約定轉出帳號查詢
	 */
	getAccount():Promise<any> {
		return this.f7000104.saveData().then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(errorMsg) => {
				return Promise.reject(errorMsg);
			});

	}
	
	/**
	 * F7000401-中華電信欠費查詢
	 * @param reqObj 
	 */

	getHinetFee(reqObj: any): Promise<any> {
		return this.f7000401.saveData(reqObj).then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}




	/**
	 * F7000402-繳納中華電信費
	 * @param data 
	 * @param security 
	 */
	sendData(data, security): Promise<any> {
		let reqHeader = (typeof security === 'object' && security
			&& security.hasOwnProperty('securityResult') && security.securityResult
			&& security.securityResult.hasOwnProperty('headerObj')
		) ? security.securityResult.headerObj : {};
		return this.f7000402.saveData(data, reqHeader).then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}


}