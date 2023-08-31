/**
 * Header
 * 
 * 台幣轉帳service(即時、預約)
 * F4000101-台幣活存約定轉出及轉入帳號查詢
 * F2000101-台幣帳戶查詢(為了拿可用餘額)
 * F4000102-台幣活存約定即時轉帳
 * F4000401-台幣活存約定預約轉帳
 * 
 */
import { Injectable } from '@angular/core';
import { F2000101ApiService } from '@api/f2/f2000101/f2000101-api.service';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { F4000101ReqBody } from '@api/f4/f4000101/f4000101-req';
import { F4000102ApiService } from '@api/f4/f4000102/f4000102-api.service';
import { F4000401ApiService } from '@api/f4/f4000401/f4000401-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { CacheService } from '@core/system/cache/cache.service';


@Injectable()
export class TwdTransferService {

	constructor(
		private f2000101: F2000101ApiService,
		private f4000101: F4000101ApiService,
		private f4000102: F4000102ApiService,
		private f4000401: F4000401ApiService,
		public authService: AuthService,
		private _cacheService: CacheService
	) {
	}

	/**
	 * 因發兩隻電文導致使用者等待過久
	 * 故用getData function 
	 * 等兩隻電文回來在一起給使用者
	 */

	public getData(): Promise<any> {
		let output = {
			account: {},
			balance: {}
		}
		return this.getAccount({ reget: true }).then(
			(sucess) => {
				output.account = sucess;
				return this.getBalance().then(
					(sucessB) => {
						output.balance = sucessB;
						return Promise.resolve(output);
					},
					(errorObj) => {
						return Promise.reject(errorObj);
					}
				);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}

	/**
	 * 2020/03/11
	 * 查餘額 
	 */

	public getBalanceData(): Promise<any> {
		let output = {
			balance: {}
		}
		return this.getBalance().then(
			(sucess) => {
				output.balance = sucess;
				return Promise.resolve(output);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}


	/**
	 *  發電文
	 *  F4000101-台幣活存約定轉出及轉入帳號查詢
	 */
	public getAccount(option?: Object): Promise<any> {
		const cache_key = 'acct-deposit';
		const cache_check = this._cacheService.checkCacheSet(option);

		if (!cache_check.reget) {
			// 背景取得，首頁請求，取cache
			const cache_data = this._cacheService.load(cache_key);
			if (cache_data) {
				return Promise.resolve(cache_data);
			}
		} else {
			// 取得最新的
			this._cacheService.remove(cache_key);
		}
		let req_data = new F4000101ReqBody();
		return this.f4000101.send(req_data).then(
			(sucess) => {
				let cache_option = this._cacheService.getCacheSet(cache_key);
				this._cacheService.save(cache_key, sucess, cache_option);
				return Promise.resolve(sucess);
			},
			(errorMsg) => {
				return Promise.reject(errorMsg);
			});
	}

	/**
	 *  發電文
	 *  F2000101-台幣帳戶查詢(為了拿可用餘額)
	 */
	public getBalance(): Promise<any> {
		let pageSize = '500';
		return this.f2000101.getPageData(1, [], false, pageSize).then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(errorMsg) => {
				return Promise.reject(errorMsg);
			});
	}

	/**
	 * 送電文
	 * F4000102-台幣活存約定即時轉帳
	 */

	public sendCurrent(data, security): Promise<any> {

		let reqHeader = (typeof security === 'object' && security
			&& security.hasOwnProperty('securityResult') && security.securityResult
			&& security.securityResult.hasOwnProperty('headerObj')
		) ? security.securityResult.headerObj : {};

		return this.f4000102.saveData(data, reqHeader).then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		)
	}

	/**
	 * 送電文
	 * F4000401-台幣活存約定預約轉帳
	 */
	public sendReservation(data, security): Promise<any> {

		let reqHeader = (typeof security === 'object' && security
			&& security.hasOwnProperty('securityResult') && security.securityResult
			&& security.securityResult.hasOwnProperty('headerObj')
		) ? security.securityResult.headerObj : {};

		return this.f4000401.saveData(data, reqHeader).then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		)
	}

}
