/**
 * 已實現損益查詢
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { CacheService } from '@core/system/cache/cache.service';
import { FI000202ApiService } from '@api/fi/fI000202/fI000202-api.service';

@Injectable()

export class FundHasRealizeService {
    /**
     * 參數處理
     */
    private dateCheckList = {}; // 日期檢核設定

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private _cacheService: CacheService,
        private fi000202: FI000202ApiService
    ) {
    }


    /**
     * 取得頁籤設定
     */
    getBookmark(showNewType?: boolean) {
        let output = [];
        let detail_data = [];
        this.dateCheckList = {};
        // 舊功能false，新功能true
        if (showNewType) {

            // == Level 2 == //
            // --- [7D] --- //
            detail_data.push({
                id: '7D',
                name: 'BOOK_MARK.HAS_REALIZE.7D', // 最近1週
                sort: 1,
                search_data: this.setDateCheck('7D')
            });

            // --- [1M] --- //
            detail_data.push({
                id: '1M',
                name: 'BOOK_MARK.HAS_REALIZE.1M', // 最近1個月
                sort: 2,
                search_data: this.setDateCheck('1M')
            });
            // --- [3M] --- //
            detail_data.push({
                id: '3M',
                name: 'BOOK_MARK.HAS_REALIZE.3M', // 最近3個月
                sort: 3,
                search_data: this.setDateCheck('3M')
            });
            // --- [custom] --- //
            detail_data.push({
                id: 'custom',
                name: 'BOOK_MARK.HAS_REALIZE.CUSTOM', // 自訂
                sort: 4,
                search_data: this.setDateCheck('custom')
            });
            // --- [6M] --- //
            detail_data.push({
                id: '6M',
                name: 'BOOK_MARK.HAS_REALIZE.6M', // 近半年
                sort: 5,
                search_data: this.setDateCheck('6M')
            });
            // --- [12M] --- //
            detail_data.push({
                id: '12M',
                name: 'BOOK_MARK.HAS_REALIZE.1Y', // 近一年
                sort: 6,
                search_data: this.setDateCheck('12M')
            });
            // == Level 1 == //
            output.push({
                id: 'summary',
                name: 'BOOK_MARK.COMMON.PROFIT_OVERVIEW', // 損益總覽
                sort: 1,
                default: '12M',
                data: detail_data
            });
        } else {

            // == Level 1 == //
            output.push({
                id: 'summary',
                name: 'BOOK_MARK.COMMON.PROFIT_OVERVIEW', // 損益總覽
                sort: 1,
                search_data: {}
            });
            output.push({
                id: 'detail',
                name: 'BOOK_MARK.COMMON.PROFIT_DETAIL', // 損益明細
                sort: 2,
                search_data: {}
            });
        }

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
     * 已實現損益明細查詢
     * @param reqData 
     * @param page 
     * @param sort 
     * @param option 
     * @param pageSize 
     */
    getData(reqData: any, page: number, sort?: Array<any>, option?: Object, pageSize?: string | number): Promise<any> {
        const cache_check = this._cacheService.checkPaginatorCach('fund-profit-loss-detail', page, sort, option, pageSize);
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        return this.fi000202.getData(reqData, page).then(
            (sucess) => {
                let output = sucess;
                output.data = this._modifyData(output.data);

                let cache_option = this._cacheService.getCacheSet(cache_key);
                this._cacheService.save(cache_key, sucess, cache_option);
                return Promise.resolve(output);
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
        // 最多只可查詢本月與前3個月
        let set_obj: any = {
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '3', // 查詢範圍限制
            rangeDate: '', // 比較日
            rangeBaseDate: '01' // 當rangeType為自訂時，的基礎日期
        };
        switch (set_key) {
            case '1D': // 前一日
                set_obj['rangeType'] = 'D';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';
                break;
            case 'today': // 本日
                set_obj['rangeType'] = 'D';
                set_obj['rangeNum'] = '0';
                set_obj['rangeBaseDate'] = '';
                break;
            case '7D': // 最近1周
                set_obj['rangeType'] = 'D';
                set_obj['rangeNum'] = '7';
                set_obj['rangeBaseDate'] = '';
                break;
            case '1M': // 最近1月
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';
                break;
            case '3M': // 最近3月
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '3';
                set_obj['rangeBaseDate'] = '';
                break;
            case '6M': // 最近6月
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '6';
                set_obj['rangeBaseDate'] = '';
                break;
            case '12M': // 最近1年
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


    /**
     * 明細資料整理
     * @param data
     */
    private _modifyData(data) {
        data.forEach(item => {
            let tmp_check: any;
            tmp_check = parseFloat(item.incomeState);
            item['class'] = '';
            item['positive'] = false;
            if (tmp_check != 0) {
                if (tmp_check > 0) {
                    item['class'] = 'font_red';
                    item['positive'] = true;
                } else {
                    item['class'] = 'font_bl_gre';
                }
            }


            tmp_check = parseFloat(item.intAmt);
            item['intclass'] = '';
            if (tmp_check != 0) {
                if (tmp_check > 0) {
                    item['intclass'] = 'font_red';
                } else {
                    item['intclass'] = 'font_bl_gre';
                }
            }
        });
        return data;
    }

}
