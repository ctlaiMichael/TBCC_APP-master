/**
 * 信用卡帳單查詢(新增超商繳卡費)
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FC000403ApiService } from '@api/fc/fc000403/fc000403-api.service';
import { CacheService } from '@core/system/cache/cache.service';
import { F8000402ApiService } from '@api/f8/f8000402/f8000402-api.service';
import { F8000401ApiService } from '@api/f8/f8000401/f8000401-api.service';
import { FC000404ApiService } from '@api/fc/fc000404/fc000404-api.service';

@Injectable()

export class CardBillService {
  /**
   * 參數處理
   */

  constructor(
    private _logger: Logger
    , private fc000403: FC000403ApiService
    , private fc000404: FC000404ApiService
    , private _cacheService: CacheService
    , private f8000402: F8000402ApiService
    , private f8000401: F8000401ApiService
  ) {
  }



  /**
   * 信用卡本期帳單查詢
   */
  getData(set_data?: Object, option?: Object): Promise<any> {
    const cache_key = 'card-bill';
    const cache_check = this._cacheService.checkCacheSet(option);

    if (!cache_check.reget) {
      // 背景取得，首頁請求，取cache
      const cache_data = this._cacheService.load(cache_key);
      if (cache_data) {
        this._logger.error('CardBill', 'cache:', cache_data);
        return Promise.resolve(cache_data);
      }
    } else {
      // 非首頁強制清除cache (取得最新的)
      this._cacheService.remove(cache_key);
    }

    return this.fc000403.getData(set_data, cache_check.background).then(
      (sucessObj) => {
        let cache_option = this._cacheService.getCacheSet(cache_key);
        this._cacheService.save(cache_key, sucessObj, cache_option);
        return Promise.resolve(sucessObj);
      },
      (failedObj) => {
        return Promise.reject(failedObj);
      }
    );
  }

  //查詢轉出帳號
  getAccount(set_data): Promise<any> {
    return this.f8000402.getData(set_data).then(
      (success) => {
        return Promise.resolve(success);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

  //繳納本人信用卡款
  getPayResult(setData, security): Promise<any> {
    let reqHeader = {
      header: security.headerObj
    };
    let output = {
      info_data: {},
      msg: '',
      result: '',
      status: true
    };
    return this.f8000401.getData(setData, reqHeader).then(
      (success) => {
        output = success;
        if (success.hasOwnProperty('status') && success.status == true) {
          return Promise.resolve(success);
        } else {
          output.status = false;
          return Promise.reject(output);
        }
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

  //超商繳卡費
  getMarketPayQRCode(setData): Promise<any> {
  
    let output = {
      info_data: {},
      msg: '',
      result: '',
      status: true
    };
    return this.fc000404.getData(setData).then(
      (success) => {
        output = success;
        if (success.hasOwnProperty('status') && success.status == true
          && success.hasOwnProperty('cardBarcode') && success.cardBarcode != '' && success.cardBarcode.length == 40 ) {
          return Promise.resolve(success);
        } else {
          output.status = false;
          return Promise.reject(output);
        }
      },
      (errorObj) => {
        return Promise.reject(errorObj);
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
