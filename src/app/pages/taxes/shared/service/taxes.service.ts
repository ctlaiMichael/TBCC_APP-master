/**
 * Header
 * 
 * 繳交各類稅款
 * F7000102-可繳交稅款項目查詢
 * F7000103-繳納稅款約定轉出帳號查詢
 * F7000101-各類稅費
 */
import { Injectable } from '@angular/core';
import { F7000101ApiService } from '@api/f7/f7000101/f7000101-api.service';
import { F7000102ApiService } from '@api/f7/f7000102/f7000102-api.service';
import { F7000103ApiService } from '@api/f7/f7000103/f7000103-api.service';

@Injectable()
export class TaxesService {
	/**
	 * 參數處理
	 */

	constructor(
		private f7000101: F7000101ApiService,
		private f7000102: F7000102ApiService,
		private f7000103: F7000103ApiService
	) {
	}

	/**
	 * F7000102-可繳交稅款項目查詢
	 */
	getData(): Promise<any> {
		return this.f7000102.saveData().then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}

	/**
	 * F7000103-繳納稅款約定轉出帳號查詢
	 * @param data 
	 */
	getAccountData(data): Promise<any> {
		return this.f7000103.saveData(data).then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}

	/**
	 * F7000101-各類稅費
	 * @param data 
	 * @param security 
	 */
	sendData(data, security): Promise<any> {
		let reqHeader = (typeof security === 'object' && security
			&& security.hasOwnProperty('securityResult') && security.securityResult
			&& security.securityResult.hasOwnProperty('headerObj')
		) ? security.securityResult.headerObj : {};
		return this.f7000101.saveData(data, reqHeader).then(
			(res) => {
				return Promise.resolve(res);
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}


}


