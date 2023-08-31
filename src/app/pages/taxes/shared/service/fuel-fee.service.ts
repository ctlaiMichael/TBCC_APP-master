/**
 * Header
 * 
 * 繳納燃料費
 * F7001101-繳納燃料費
 */
import { Injectable } from '@angular/core';
import { F7001101ApiService } from '@api/f7/f7001101/f7001101-api.service';

@Injectable()
export class FuelFeeService {
	/**
	 * 參數處理
	 */

	constructor(
		private f7001101: F7001101ApiService
	) {
	}


	/**
	 * F7001101-繳納燃料費
	 * @param data 
	 * @param security 
	 */
	sendData(data, security): Promise<any> {
		let reqHeader = (typeof security === 'object' && security
			&& security.hasOwnProperty('securityResult') && security.securityResult
			&& security.securityResult.hasOwnProperty('headerObj')
		) ? security.securityResult.headerObj : {};
		return this.f7001101.saveData(data, reqHeader).then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}

}
