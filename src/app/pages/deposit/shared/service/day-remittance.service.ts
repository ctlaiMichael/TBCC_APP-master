/**
 * 存款不足票據查詢
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { F2000401ApiService } from '@api/f2/f2000401/f2000401-api.service';
import { F2000402ApiService } from '@api/f2/f2000402/f2000402-api.service';

@Injectable()

export class DayRemittanceService {
	/**
	 * 參數處理
	 */

	constructor(
		private _logger: Logger
		, private _formateService: FormateService
		, private f2000401: F2000401ApiService
		, private f2000402: F2000402ApiService
	) {
	}



	/**
	 * 當日匯入匯款查詢
	 * @param page 查詢頁數
	 * @param sort 排序 ['排序欄位', 'ASC|DESC']
	 */
	public getListData(page?: number, sort?: Array<any>): Promise<any> {
		// let reqData = new F2000201ReqBody();
		// reqData.custId = '';

		return this.f2000401.getPageData(page, sort).then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(failed) => {
				return Promise.reject(failed);
			}
		);
	}

	public getDetailData(reqObj: object, page): Promise<any> {

		return this.f2000402.getPageData(reqObj, page).then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(failed) => {
				return Promise.reject(failed);
			}
		);
	}

	// --------------------------------------------------------------------------------------------
	//  ____       _            _         _____                 _
	//  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
	//  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
	//  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
	//  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
	// --------------------------------------------------------------------------------------------

}
