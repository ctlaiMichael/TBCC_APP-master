/**
 * 借款查詢
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CacheService } from '@core/system/cache/cache.service';
import { CheckService } from '@shared/check/check.service';
import { F9000101ApiService } from '@api/f9/f9000101/f9000101-api.service';
import { F9000201ApiService } from '@api/f9/f9000201/f9000201-api.service';

@Injectable()

export class CreditInquiryService {
    /**
     * 參數處理
     */
    private dateCheckList = {}; // 日期檢核設定

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _checkService: CheckService
        , private _cacheService: CacheService
        , private f9000101: F9000101ApiService
        , private f9000201: F9000201ApiService
    ) {
    }


    /**
     * 取得頁籤設定
     */
    getBookmark() {
        let output = [];
        let detail_data = [];
        this.dateCheckList = {};
        // == Level 2 == //

        // --- [1M] --- //
        detail_data.push({
            id: '1M',
            name: 'BOOK_MARK.LOAN.1M', // 最近1個月
            sort: 2,
            search_data: this.setDateCheck('1M')
        });

        // --- [12M] --- //
        detail_data.push({
            id: '12M',
            name: 'BOOK_MARK.LOAN.12M', // 最近1個月
            sort: 2,
            search_data: this.setDateCheck('12M')
        });
        // --- [custom] --- //
        detail_data.push({
            id: 'custom',
            name: 'BOOK_MARK.COMMON.CUSTOM', // 自訂
            sort: 3,
            search_data: this.setDateCheck('custom')
        });
        // == Level 1 == //
        output.push({
            id: 'detail',
            name: 'BOOK_MARK.COMMON.DETAIL', // 交易明細
            sort: 1,
            default: '1M',
            data: detail_data
        });
        output.push({
            id: 'summary',
            name: 'BOOK_MARK.COMMON.DETAIL_LOAN', // 借款資料
            sort: 2
        });
        this._logger.step('Deposit', 'bookmark set', this.dateCheckList);
        return output;
    }

    /**
     * 取得日期設定條件
     * @param set_key 日期條件編號
     */
    getDateSet(set_key: string): Object {
        if (this.dateCheckList.hasOwnProperty(set_key)) {
            return this._formateService.transClone(this.dateCheckList[set_key]);
        } else {
            return {};
        }
    }

    /**
     * 列表
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    public getData(page?: number, sort?: Array<any>, option?: Object, pageSize?: string | number): Promise<any> {
        const cache_check = this._cacheService.checkPaginatorCach('loan-inquiry', page, sort, option, pageSize);
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }

        return this.f9000101.getPageData(page, sort).then(
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

  getDetailData(reqObj: object, page?: number, sort?: Array<any>, pageSize?: string | number) {
    return this.f9000201.getData(reqObj, page, sort, pageSize).then(
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

    private setDateCheck(set_key: string) {
        // 最多只可查詢進2年資料
        let set_obj: any = {
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '24', // 查詢範圍限制
            rangeDate: '', // 比較日
            rangeBaseDate: '' // 當rangeType為自訂時，的基礎日期 (now=2019/05/17): 2017/05/17~2019/05/17
        };
        switch (set_key) {
            case '1M': // 最近1月
                // search(now=2019/05/17): 2019/04/17~2019/05/17
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';
                break;
            case '12M': // 最近一年
                // search(now=2019/05/17): 2018/05/17~2019/05/17
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '12';
                set_obj['rangeBaseDate'] = '';
                break;
        }

        const dateType = 'strict';
        const date_data = this._checkService.getDateSet(set_obj, dateType);

        let output = {
            startDate: '',
            endDate: ''
        };
        if (set_key !== 'custom') {
            output.startDate = date_data.minDate;
            output.endDate = date_data.maxDate;
        }
        this.dateCheckList[set_key] = date_data;
        return output;
    }

}
