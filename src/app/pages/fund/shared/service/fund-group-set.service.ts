/**
 * 我的觀察組合
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { CacheService } from '@core/system/cache/cache.service';
import { FI000801ApiService } from '@api/fi/fI000801/fi000801-api.service';
import { FI000802ApiService } from '@api/fi/fi000802/fi000802-api.service';

@Injectable()

export class FundGroupSetService {
    /**
     * 參數處理
     */
    private dateCheckList = {}; // 日期檢核設定

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private _cacheService: CacheService,
        private fi000801: FI000801ApiService,
        private fi000802: FI000802ApiService
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
        // --- [1D] --- //
        detail_data.push({
            id: '1D',
            name: 'BOOK_MARK.FUND.1D', // 前日
            sort: 1,
            search_data: this.setDateCheck('1D')
        });
        // --- [1M] --- //
        detail_data.push({
            id: '1M',
            name: 'BOOK_MARK.FUND.1M', // 1月
            sort: 1,
            search_data: this.setDateCheck('1M')
        });

        // --- [6M] --- //
        detail_data.push({
            id: '6M',
            name: 'BOOK_MARK.FUND.6M', // 6月
            sort: 2,
            search_data: this.setDateCheck('6M')
        });
        // --- [12M] --- //
        detail_data.push({
            id: '12M',
            name: 'BOOK_MARK.FUND.12M', // 1年
            sort: 3,
            search_data: this.setDateCheck('12M')
        });
        // == Level 1 == //
        output.push({
            id: 'group1',
            name: 'BOOK_MARK.COMMON.GROUP1', // 投資組合1
            sort: 1,
            default: '1D',
            data: detail_data,
            level: '1'
        });
        output.push({
            id: 'group2',
            name: 'BOOK_MARK.COMMON.GROUP2', // 投資組合2
            sort: 2,
            default: '1D',
            data: detail_data,
            level: '1'
        });
        output.push({
            id: 'group3',
            name: 'BOOK_MARK.COMMON.GROUP3', // 投資組合2
            sort: 3,
            default: '1D',
            data: detail_data,
            level: '1'
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

    private setDateCheck(set_key: string) {
        // 最多只可查詢本月與前2個月
        let set_obj: any = {
            baseDate: 'today', // 基礎日
            rangeType: 'Y', // "查詢範圍類型" M OR D
            rangeNum: '1', // 查詢範圍限制
            rangeDate: '', // 比較日
            rangeBaseDate: '01' // 當rangeType為自訂時，的基礎日期
        };
        switch (set_key) {
            case '1D': // 前一日
                // search(now=2019/04/22): 2019/04/21~2019/04/21
                set_obj['rangeType'] = 'D';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';
                break;
            case '1M': // 最近1月M
                // search(now=2019/04/22): 2019/04/15~2019/04/22
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';
                break;
            case '6M': // 最近6月
                // search(now=2019/04/22): 2019/03/22~2019/04/22
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '6';
                set_obj['rangeBaseDate'] = '';
                break;
            case '12M': // 最近1年
                // search(now=2019/04/22): 2019/03/22~2019/04/22
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










    getData(type, setType?): Promise<any> {

        let cache_key = 'fund-group' + type;
        let option = {
            'background': false,
            'reget': false
        }
        const cache_check = this._cacheService.checkCacheSet(option);
        if (!cache_check.reget) {
            // 背景取得，首頁請求，取cache
            const cache_data = this._cacheService.load(cache_key);
            console.error('cache_key', cache_key,cache_data)

            // 取cache
            if (cache_data) {
                console.log('ccache sus', cache_data);
                return Promise.resolve(cache_data);
            }
        } else {
            console.log('remov');
            this._cacheService.removeGroup(cache_key);
        }

        return this.fi000801.send(type, setType).then(
            (res) => {
                let res_key = 'fund-group' + res.groupType;
                console.error('res_key', res_key);
                let cache_option = this._cacheService.getCacheSet(cache_key);
                console.log('cache_option', cache_option);
                this._cacheService.save(res_key, res, cache_option);
                return Promise.resolve(res);
            },
            (err) => {
                return Promise.reject(err);
            }
        )
    }

    updateData(set_data): Promise<any> {
        return this.fi000802.send(set_data).then(
            (res) => {
                return Promise.resolve(res);
            },
            (err) => {
                return Promise.reject(err);
            }
        )
    }

}


