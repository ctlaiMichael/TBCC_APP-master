/**
 * 存款不足票據查詢
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { F2000301ApiService } from '@api/f2/f2000301/f2000301-api.service';

@Injectable()

export class InsufficientBillService {
	/**
	 * 參數處理
	 */

	constructor(
		private _logger: Logger,
		private f2000301: F2000301ApiService
	) {
	}



	/**
	 *
	 * @param page 查詢頁數
	 * @param sort 排序 ['排序欄位', 'ASC|DESC']
	 */
	public getData(page?: number, sort?: Array<any>): Promise<any> {

		return this.f2000301.getPageData(page, sort).then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(failed) => {
				return Promise.reject(failed);
			}
		);
	}
}
