import { Injectable } from '@angular/core';
import { F4000501ApiService } from '@api/f4/f4000501/f4000501-api.service';
import { F4000502ApiService } from '@api/f4/f4000502/f4000502-api.service';
import { AuthService } from '@core/auth/auth.service';


@Injectable()
export class ReservationSearchWriteoffService {

	constructor(
		private f4000501: F4000501ApiService,
		private f4000502: F4000502ApiService,
		public authService: AuthService) {
	}

	/**
	 *  發電文
	 *  F4000501-台幣活存預約轉帳查詢
	 */
	public getData(): Promise<any> {
		return this.f4000501.saveData().then(
			(res) => {
				return Promise.resolve(res);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			});
	}

	/**
	*  發電文
	*  F4000502-台幣預約轉帳註銷
	*/
	public sendData(data, security): Promise<any> {
		
		let reqHeader = (typeof security === 'object' && security
			&& security.hasOwnProperty('securityResult') && security.securityResult
			&& security.securityResult.hasOwnProperty('headerObj')
		) ? security.securityResult.headerObj : {};

		return this.f4000502.saveData(data, reqHeader).then(
			(res) => {
				return Promise.resolve(res);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			});
	}
}


