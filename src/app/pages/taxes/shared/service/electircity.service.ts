/**
 * Header
 * 
 * 台灣自來水費
 * F7000104-繳費交易約定轉出帳號查詢
 * F7000301-繳納電費
 * 
 */
import { Injectable } from '@angular/core';
import { F7000104ApiService } from '@api/f7/f7000104/f7000104-api.service';
import { F7000301ApiService } from '@api/f7/f7000301/f7000301-api.service';

@Injectable()
export class ElectricityService {
	/**
	 * 參數處理
	 */

	constructor(
		private f7000104: F7000104ApiService,
		private f7000301: F7000301ApiService
	) {
	}

	/**
	 * F7000104-繳費交易約定轉出帳號查詢
	 */
	getData(): Promise<any> {
		return this.f7000104.saveData().then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}

	/**
	 * F7000301-繳納電費
	 * @param data 
	 * @param security 
	 */
	sendData(data, security): Promise<any> {
		let reqHeader = (typeof security === 'object' && security
			&& security.hasOwnProperty('securityResult') && security.securityResult
			&& security.securityResult.hasOwnProperty('headerObj')
		) ? security.securityResult.headerObj : {};
		return this.f7000301.saveData(data, reqHeader).then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}
}
