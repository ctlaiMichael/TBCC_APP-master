/**
 * Header
 * 
 * 綜定存中途解約
 * F6000601-綜定存歸戶查詢
 * F6000602-台幣綜定存中途解約
 * 
 */
import { Injectable } from '@angular/core';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { CacheService } from '@core/system/cache/cache.service';
import { F6000201ApiService } from '@api/f6/f6000201/f6000201-api.service';
import { F6000202ApiService } from '@api/f6/f6000202/f6000202-api.service';
import { F6000202ReqBody } from '@api/f6/f6000202/f6000202-req';


@Injectable()
export class FixedReleaseService {

	constructor(
		public authService: AuthService,
		private _cacheService: CacheService,
		private handleError: HandleErrorService,
		private f6000201: F6000201ApiService,
		private f6000202: F6000202ApiService
	) {
	}

	/**
	 * f6000601 綜定存歸戶查詢
	 */

	public getData(): Promise<any> {
		return this.f6000201.send().then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}

	/**
	 * 
	 */
	public onSend(sendObj,security): Promise<any> {
		console.log('onSend sendObj',sendObj);
		let output = {
            status: false,
            msg: 'ERROR.DATA_FORMAT_ERROR',
            info_data: {}
        }
        let reqObj = new F6000202ReqBody();
        if (typeof sendObj === 'object' && sendObj.hasOwnProperty('fDAccNo') &&
            sendObj.hasOwnProperty('balance') && sendObj.hasOwnProperty('mBAccNo') &&
            sendObj.hasOwnProperty('businessType') && sendObj.hasOwnProperty('trnsToken')
        ) {
            reqObj = {
                'custId': '',
				'fDAccount': sendObj.fDAccNo,	//定存帳號
				'balance': sendObj.balance,		//面額
				'mBAccount': sendObj.mBAccNo,	//綜存帳號
				'businessType': sendObj.businessType,	//次營業日註記
				'trnsToken': sendObj.trnsToken		
            }
        } else {
			console.log('line69',typeof sendObj === 'object',sendObj.hasOwnProperty('fDAccNo'),
            sendObj.hasOwnProperty('balance'), sendObj.hasOwnProperty('mBAccNo'),
            sendObj.hasOwnProperty('businessType'), sendObj.hasOwnProperty('trnsToken'));
            return Promise.reject(output);
        };
        let reqHeader = {
            header: security.securityResult.headerObj
        };
		return this.f6000202.send(reqObj,reqHeader).then(
			(sucess) => {
				console.log('service 202 suc',sucess);
				output.info_data=sucess;
				return Promise.resolve(sucess);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}
}