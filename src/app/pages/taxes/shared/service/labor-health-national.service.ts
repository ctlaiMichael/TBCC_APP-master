/**
 * Header
 * 
 * 勞保費，國民年金費，健保費
 * F7000104-繳費交易約定轉出帳號查詢
 * F7000501-繳納勞保費
 * F7000601-繳納國民年金保費
 * F7000701-繳納健保費
 * 
 */
import { Injectable } from '@angular/core';
import { F7000104ApiService } from '@api/f7/f7000104/f7000104-api.service.ts'
import { F7000501ApiService } from '@api/f7/f7000501/f7000501-api.service';
import { F7000601ApiService } from '@api/f7/f7000601/f7000601-api.service';
import { F7000701ApiService } from '@api/f7/f7000701/f7000701-api.service';

@Injectable()
export class LaborHealthNationalService {
	/**
	 * 參數處理
	 */

	constructor(
		private f7000104: F7000104ApiService,
		private f7000501: F7000501ApiService,
		private f7000601: F7000601ApiService,
		private f7000701: F7000701ApiService
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
	 * F7000501-繳納勞保費
	 * @param data 
	 * @param security 
	 */
	sendLaborData(data, security): Promise<any> {
		let reqHeader = (typeof security === 'object' && security
			&& security.hasOwnProperty('securityResult') && security.securityResult
			&& security.securityResult.hasOwnProperty('headerObj')
		) ? security.securityResult.headerObj : {};
		return this.f7000501.saveData(data, reqHeader).then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}

	/**
	 * F7000601-繳納國民年金保費
	 * @param data 
	 * @param security 
	 */
	sendNationalData(data, security): Promise<any> {
		let reqHeader = (typeof security === 'object' && security
			&& security.hasOwnProperty('securityResult') && security.securityResult
			&& security.securityResult.hasOwnProperty('headerObj')
		) ? security.securityResult.headerObj : {};
		return this.f7000601.saveData(data, reqHeader).then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}

	/**
	 * F7000701-繳納健保費
	 * @param data 
	 * @param security 
	 */
	sendHealthData(data, security): Promise<any> {
		let reqHeader = (typeof security === 'object' && security
			&& security.hasOwnProperty('securityResult') && security.securityResult
			&& security.securityResult.hasOwnProperty('headerObj')
		) ? security.securityResult.headerObj : {};
		return this.f7000701.saveData(data, reqHeader).then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}
}
