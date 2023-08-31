/**
 * Header
 * 
 * 
 */
import { Injectable } from '@angular/core';
import { F6000101ApiService } from '@api/f6/f6000101/f6000101-api.service';
import { F6000102ApiService } from '@api/f6/f6000102/f6000102-api.service';
import { F6000101ReqBody } from '@api/f6/f6000101/f6000101-req';
import { F6000102ReqBody } from '@api/f6/f6000102/f6000102-req';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';


@Injectable()
export class CurrentToFixedService {

	constructor(
		private f6000101: F6000101ApiService,
		private f6000102: F6000102ApiService,
		public authService: AuthService,
	) {
	}

	/**
	 *  發電文
	 *  F6000101-約定轉出綜存帳號查詢
	 */
	public getAccount(option?: Object): Promise<any> {
		// 因f6000101會帶trnstoken往後送交易 不可以做cache 2020/02/19
		let req_data = new F6000101ReqBody();
		return this.f6000101.send(req_data).then(
			(sucess) => {	
				return Promise.resolve(sucess);
			},
			(errorMsg) => {
				return Promise.reject(errorMsg);
			});
	}

	/**
	 *  發電文
	 *  F6000201-綜活轉綜定結果
	 */
	public getSendResult(reqdata, security): Promise<any> {
		// 檢查安控
		let req_data = new F6000102ReqBody();
		req_data.inteAccnt = reqdata.inteAccnt.value;
		req_data.transfrType = reqdata.transfrType.value;
		req_data.transfrTimes = reqdata.transfrTimes.value;
		req_data.transfrRateType = reqdata.transfrRateType.value;
		req_data.transfrAmount = (parseInt(reqdata.transfrAmount.value, 10)).toString();
		req_data.autoTransCode = reqdata.autoTransCode.value;
		req_data.businessType = reqdata.businessType;
		req_data.trnsToken = reqdata.trnsToken;
		let reqHeader = {
			header: security.headerObj
		  };
		return this.f6000102.send(req_data, reqHeader).then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(errorMsg) => {
				return Promise.reject(errorMsg);
			});
	}



}