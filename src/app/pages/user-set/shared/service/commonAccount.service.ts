import { Injectable } from '@angular/core';

import { FG000403ApiService } from '@api/fg/fg000403/fg000403-api.service';
import { FG000403ReqBody } from '@api/fg/fg000403/fg000403-req';
import { FG000404ApiService } from '@api/fg/fg000404/fg000404-api.service';
import { FG000404ReqBody } from '@api/fg/fg000404/fg000404-req';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { F4000101ReqBody } from '@api/f4/f4000101/f4000101-req';
import { CacheService } from '@core/system/cache/cache.service';
// import { CLIENT_RENEG_LIMIT } from 'tls';
@Injectable()
export class CommonAccountService {
    /**
     * 參數處理
    //  */

    constructor(

        private fg000403: FG000403ApiService,
        private fg000404: FG000404ApiService,
        private f4000101: F4000101ApiService,
		private _cacheService: CacheService
    ) { }


    //=======================================================約定帳號
    /**
        * 透過身分證取得約定帳號
        * @param set_data 
        */

    getAgreeAccount(): Promise<any> {
        let output = {
            status: false,
            msg: 'Error',
            info_data: [],
            trnsOutAccts: [],
            trnsInAccts: [],
            commonTrnsInAccts: []
        }
        let option = {
			'background': false,
			'reget': false
		}
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
        let reqObj = new F4000101ReqBody();
        reqObj = {
            'custId': ''
        };


        return this.f4000101.send(reqObj).then(
            (jsonObj) => {
                let cache_option = this._cacheService.getCacheSet(cache_key);
                this._cacheService.save(cache_key, jsonObj, cache_option);
                
                
                let output = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    output.msg = '';
                    output.status = true;
                    output.info_data = jsonObj.info_data;
                    if (jsonObj.hasOwnProperty('trnsOutAccts')) {
                        output.trnsOutAccts = jsonObj['trnsOutAccts'];
                    }
                    if (jsonObj.hasOwnProperty('trnsInAccts')) {
                        output.trnsInAccts = jsonObj['trnsInAccts'];
                    }
                    if (jsonObj.hasOwnProperty('commonTrnsInAccts')) {
                        output.commonTrnsInAccts = jsonObj['commonTrnsInAccts'];
                    }
                    return Promise.resolve(output);
                } else {
                    return Promise.reject(output);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }

        )

    }


    //============================================================常用帳號
    /**
      * 透過身分證取得常用帳號
      * @param set_data 
      */

    getAccount(): Promise<any> {
        let output = {
            status: false,
            msg: 'Error',
            dataTime:'',
            data: []
        }

        let reqObj = new FG000403ReqBody();

        return this.fg000403.send(reqObj).then(
            (jsonObj) => {
                
                let output = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true && jsonObj.hasOwnProperty('dataTime') ) {
                    output.msg = '';
                    output.status = true;
                    output.dataTime=jsonObj.dataTime;
                    output.data = jsonObj.data;
                    return Promise.resolve(output);
                } else {
                    return Promise.reject(output);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }

        )
    }





    //============================================修改/刪除常用帳號
    /**
    * 送出資料
    */
    onSend(componentobj,security): Promise<any> {
        let output = {
            msg: '',
            result: '',
            status: false
        };

        
        //確認頁送出時再做一次檢測
        if (componentobj['action'] == '' || componentobj['trnsInBank'] == '' ||
            componentobj['trnsInAccnt'] == '' ) {
            return Promise.reject(output);
        };

        let reqObj = new FG000404ReqBody();

        if (typeof componentobj === 'object' && componentobj.hasOwnProperty('action') &&
            componentobj.hasOwnProperty('trnsInBank') && componentobj.hasOwnProperty('trnsInAccnt')) {
            reqObj = {
                "custId": "",
                "action": componentobj.action,
                "trnsInBank": componentobj.trnsInBank,
                "trnsInAccnt": componentobj.trnsInAccnt,
                "accntName": componentobj.accntName,
            }
        } else {
            return Promise.reject(output);
        };
        

        let reqHeader = {
            header: security.securityResult.headerObj
          };

        return this.fg000404.send(reqObj,reqHeader).then(
            (jsonObj) => {
                
                let output = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    output.msg = '';
                    output.status = true;
                    output.data = jsonObj.data;
                    return Promise.resolve(output);
                } else {
                    
                    return Promise.reject(output);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }

        )

    }



    /**
    * 模擬 取得安控資訊
    */
    get_security(get_type?: string) {
        let output: any = {
            'list': {},
            'data': []
        };
        let safeData = [
            { id: '1', name: 'SSL' }
            , { id: '2', name: '憑證' }
        ]
        safeData.forEach((item) => {
            if (!item.hasOwnProperty('id')) {
                return false;
            }
            output.list[item.id] = item;
        });
        if (typeof safeData === 'object') {
            output.data = safeData;
        };
        if (typeof get_type !== 'undefined') {
            output = (output.hasOwnProperty(get_type)) ? output[get_type] : null;
        }
        return output;
    }


}









