/**
 * 台幣存款查詢
 * CK:支票存款 f2100104
 * MB:綜合存款 f2100106
 * PB:活期存款 f2100103
 * FD:定期存款 f2100102
 *
 * XF:外匯定期存款: f2100102 (native code: CheckTotalDeposit)
 * XFS: 外匯定存?: 非台幣交易，不再此列
 * XS:外匯活期存款: 非台幣交易，不再此列
 * XM:外匯綜合存款: 非台幣交易，不再此列
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { CacheService } from '@core/system/cache/cache.service';
import { F2100101ApiService } from '@api/f2/f2100101/f2100101-api.service';
import { F2100102ApiService } from '@api/f2/f2100102/f2100102-api.service';
import { F2100105ApiService } from '@api/f2/f2100105/f2100105-api.service';

@Injectable()

export class DepositInquiryDetailService {
    /**
     * 參數處理
     */
    private dateCheckList = {}; // 日期檢核設定

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private _cacheService: CacheService,
        private f2100101: F2100101ApiService, // 台幣活支存明細查詢
        private f2100102: F2100102ApiService, // 台幣定存明細查詢
        private f2100105: F2100105ApiService // 台幣綜存明細查詢
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
        // --- [7D] --- //
        detail_data.push({
            id: '7D',
            name: 'BOOK_MARK.DEPOSIT_OVERVIEW.7D', // 最近1週
            sort: 1,
            search_data: this.setDateCheck('7D')
        });

        // --- [1M] --- //
        detail_data.push({
            id: '1M',
            name: 'BOOK_MARK.DEPOSIT_OVERVIEW.1M', // 最近1個月
            sort: 2,
            search_data: this.setDateCheck('1M')
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
            default: '7D',
            data: detail_data
        });
        output.push({
            id: 'summary',
            name: 'BOOK_MARK.COMMON.SUMMARY', // 帳戶彙總
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
     * 刪除cache
     * deposit-tw: 台幣存款查詢
     * deposit-tw-demand: 存款查詢-活存明細
     * deposit-tw-time: 存款查詢-定存明細
     * deposit-tw-demand@帳號: 刪除帳號資料
     */
    removeAllCache(type?: string, acctObj?: object) {
        if (typeof type == 'undefined') {
            type = 'deposit-tw';
        }
        if (type === 'alldetail') {
            type = 'deposit-tw-demand@' + this._formateService.checkField(acctObj, 'acctNo');
        }
        this._cacheService.removeGroup(type);
    }

    /**
     * 取得自訂查詢區間資料
     * @param reqObj
     * @param page
     */
  getDetailData(reqObj: object, page, option?: Object, pageSize?: string | number): Promise<any> {
        // 日期檢核: 新臺幣活期性存款可查詢本月及前兩個月內資料
        let tmp_cehck = reqObj;
        let check_id = this._formateService.checkField(reqObj, 'id');
        let start_date = this._formateService.checkField(reqObj, 'startDate');
        let end_date = this._formateService.checkField(reqObj, 'endDate');
        if (check_id === '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        let check_date = this.getDateSet(check_id);
        let check_data = this._checkService.checkDateRange([start_date, end_date], check_date);
        if (!check_data.status) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: check_data.errorMsg.join('')
            });
        }

        const acctType = this._formateService.checkField(reqObj, 'acctType');
        this._logger.step('Deposit', 'getDetailData', acctType, reqObj);

        // cache data get
        const acctNo = this._formateService.checkField(reqObj, 'acctNo');
        let cache_main_key = 'deposit-tw-demand@' + acctNo;
        let cache_sub_key = [start_date, end_date];
    const cache_check = this._cacheService.checkPaginatorCach(cache_main_key, page, [], option, null, { sub_key: cache_sub_key });
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        let cache_option = this._cacheService.getCacheSet(cache_key);
        cache_option.groupList.push(cache_main_key);

        switch (acctType) {
            case 'CK': // 支票存款
            case 'PB': // 活期存款
            case 'XS': // 外匯活期存款 (native: CurrentAndSavesAcct)
        return this.f2100101.getPageData(reqObj, page, [], pageSize).then(
                    (sucessObj) => {
                        this._cacheService.save(cache_key, sucessObj, cache_option);
                        return Promise.resolve(sucessObj);
                    },
                    (failed) => {
                        return Promise.reject(failed);
                    }
                );
            case 'MB': // 綜合存款
        return this.f2100105.getPageData(reqObj, page, [], pageSize).then(
                    (sucessObj) => {
                        this._cacheService.save(cache_key, sucessObj, cache_option);
                        return Promise.resolve(sucessObj);
                    },
                    (failed) => {
                        return Promise.reject(failed);
                    }
                );
            default:
                return Promise.reject({
                    title: 'ERROR.TITLE',
                    content: 'ERROR.DATA_FORMAT_ERROR'
                });
        }
    }


    /**
     * 定期存款取得
     *
     * @param reqObj
     */
    getTimeDepoist(reqObj: object, option?: Object): Promise<any> {
        const acctNo = this._formateService.checkField(reqObj, 'acctNo');
        let cache_key = 'deposit-tw-time@' + acctNo;
        const cache_data = this._cacheService.checkCacheData(cache_key, option);
        if (!!cache_data) {
          return Promise.resolve(cache_data);
        }

        return this.f2100102.getData(reqObj).then(
            (sucessObj) => {
                let cache_option = this._cacheService.getCacheSet(cache_key);
                this._cacheService.save(cache_key, sucessObj, cache_option);
                return Promise.resolve(sucessObj);
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
        // 最多只可查詢本月與前2個月
        let set_obj: any = {
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '24', // 查詢範圍限制
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
            case 'today': // 本日
                // search(now=2019/04/22): 2019/04/22~2019/04/22
                set_obj['rangeType'] = 'D';
                set_obj['rangeNum'] = '0';
                set_obj['rangeBaseDate'] = '';
                break;
            case '7D': // 最近1周
                // search(now=2019/04/22): 2019/04/15~2019/04/22
                set_obj['rangeType'] = 'D';
                set_obj['rangeNum'] = '7';
                set_obj['rangeBaseDate'] = '';
                break;
            case '1M': // 最近1月
                // search(now=2019/04/22): 2019/03/22~2019/04/22
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';
                break;
            case 'custom': // 自訂
            default:
                // search(now=2019/04/22): 2017/04/01~2019/04/22
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '24';
                set_obj['rangeBaseDate'] = '01';
                break;
        }

        const dateType = 'strict';
        let date_data = this._checkService.getDateSet(set_obj, dateType);

        let output = {
            startDate: '',
            endDate: ''
        };
        if (set_key == 'custom') {
            date_data.rang = '2'; // 最大區間search(now=2019/10/23): 2019/08/24~2019/10/23
        } else {
            output.startDate = date_data.minDate;
            output.endDate = date_data.maxDate;
        }
        this.dateCheckList[set_key] = date_data;
        return output;
    }


}


