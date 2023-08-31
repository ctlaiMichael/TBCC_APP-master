/**
 * 台幣存款查詢
 * PB:活期存款 f2100103
 * CK:支票存款 f2100104
 * MB:綜合存款 f2100106
 * XS:外匯活期存款: ?
 * XM:外匯綜合存款: ?
 * GD:黃金存摺 FB000707
 *
 * FD:定期存款 無帳戶彙總api
 * XF:外匯定期存款: 無帳戶彙總api (native code: CheckTotalDeposit)
 * XFS: 外匯定存: 無帳戶彙總api?
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { CacheService } from '@core/system/cache/cache.service';
import { F2100103ApiService } from '@api/f2/f2100103/f2100103-api.service';
import { F2100104ApiService } from '@api/f2/f2100104/f2100104-api.service';
import { F2100106ApiService } from '@api/f2/f2100106/f2100106-api.service';

@Injectable()

export class ContentSummaryService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private _cacheService: CacheService,
        private f2100103: F2100103ApiService, // 台幣活存彙總
        private f2100104: F2100104ApiService, // 台幣支存彙總
        private f2100106: F2100106ApiService // 台幣綜活存彙總
        // , private fb000707: FB000707ApiService // 黃金
    ) {
    }


    /**
     * 查詢帳戶匯總
     * @param acctNo
     * @param acctType
     */
    getSummaryData(reqObj: object, option?: object): Promise<any> {
        const acctType = this._formateService.checkField(reqObj, 'acctType');
        this._logger.step('Deposit', 'getDetailData', acctType, reqObj);
        switch (acctType) {
            case 'PB': // 活期存款
                return this.getDataPB(reqObj, option);
            case 'CK': // 支票存款
                return this.getDataCK(reqObj, option);
            case 'MB': // 綜合存款
                return this.getDataMB(reqObj, option);
            case 'XS': // 外匯活期存款
                return this.getDataXS(reqObj, option);
            case 'XM': // 外匯綜合存款
                return this.getDataXM(reqObj, option);
            case 'GD': // 黃金存摺
                return this.getDataGD(reqObj, option);
            case 'FD': // 定期存款
            case 'XF': // 定期存款
            case 'XFS': // 定期存款
                return Promise.reject({
                    title: 'ERROR.TITLE',
                    // 很抱歉，您選擇的帳戶沒有帳戶彙總資訊
                    content: 'PG_DEPOSIT.SUMMARY.NO_SERVICE'
                });
            default:
                return Promise.reject({
                    title: 'ERROR.TITLE',
                    content: 'ERROR.DATA_FORMAT_ERROR'
                });
        }
    }



    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * 活存
     * @param reqObj
     */
    private getDataPB(reqObj: object, option?: object): Promise<any> {
        const cache_group = 'deposit-tw-demand@' + this._formateService.checkField(reqObj, 'acctNo');
        const cache_key = cache_group + '@summary-pb';
        const cache_data = this._cacheService.checkCacheData(cache_key, option);
        if (cache_data) {
          return Promise.resolve(cache_data);
        }

        return this.f2100103.getData(reqObj).then(
            (jsonObj) => {
                let cache_option = this._cacheService.getCacheSet(cache_key);
                cache_option.groupList.push(cache_group);
                this._cacheService.save(cache_key, jsonObj, cache_option);
                return Promise.resolve(jsonObj);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * 支存
     * @param reqObj
     */
    private getDataCK(reqObj: object, option?: object): Promise<any> {
        const cache_group = 'deposit-tw-demand@' + this._formateService.checkField(reqObj, 'acctNo');
        const cache_key = cache_group + '@summary-ck';
        const cache_data = this._cacheService.checkCacheData(cache_key, option);
        if (cache_data) {
          return Promise.resolve(cache_data);
        }

        return this.f2100104.getData(reqObj).then(
            (jsonObj) => {
                let cache_option = this._cacheService.getCacheSet(cache_key);
                cache_option.groupList.push(cache_group);
                this._cacheService.save(cache_key, jsonObj, cache_option);
                return Promise.resolve(jsonObj);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * 綜活存
     * @param reqObj
     */
    private getDataMB(reqObj: object, option?: object): Promise<any> {
        const cache_group = 'deposit-tw-demand@' + this._formateService.checkField(reqObj, 'acctNo');
        const cache_key = cache_group + '@summary-mb';
        const cache_data = this._cacheService.checkCacheData(cache_key, option);
        if (!!cache_data) {
          return Promise.resolve(cache_data);
        }
        return this.f2100106.getData(reqObj).then(
            (jsonObj) => {
                let cache_option = this._cacheService.getCacheSet(cache_key);
                cache_option.groupList.push(cache_group);
                this._cacheService.save(cache_key, jsonObj, cache_option);
                return Promise.resolve(jsonObj);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }


    /**
     * 外匯活期存款: 外匯彙總資料從物件整理而得，不用發電文
     * @param reqObj
     */
    private getDataXS(reqObj: object, option?: object): Promise<any> {
        return Promise.reject({
            title: 'ERROR.TITLE',
            // 本功能即將提供!
            content: 'PG_DEPOSIT.ERROR.NOT_YET'
        });
    }

    /**
     * 外匯綜合存款: 外匯彙總資料從物件整理而得，不用發電文
     * @param reqObj
     */
    private getDataXM(reqObj: object, option?: object): Promise<any> {
        return Promise.reject({
            title: 'ERROR.TITLE',
            // 本功能即將提供!
            content: 'PG_DEPOSIT.ERROR.NOT_YET'
        });
    }


    /**
     * 黃金 FB000707
     * @param reqObj
     */
    private getDataGD(reqObj: object, option?: object): Promise<any> {
        return Promise.reject({
            title: 'ERROR.TITLE',
            // 本功能即將提供!
            content: 'PG_DEPOSIT.ERROR.NOT_YET'
        });
    }


}


