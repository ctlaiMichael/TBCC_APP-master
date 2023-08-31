/**
 * 外匯存款查詢
 * XF:外匯定期存款: f2100202
 * XFS: 外匯綜定存: f2100202
 * XS:外匯活期存款: f2100201
 * XM:外匯綜合存款: f2100201
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { CacheService } from '@core/system/cache/cache.service';
import { F2100201ApiService } from '@api/f2/f2100201/f2100201-api.service';
import { F2100202ApiService } from '@api/f2/f2100202/f2100202-api.service';

@Injectable()

export class ForeignDepositService {
    /**
     * 參數處理
     */
    private dateCheckList = {}; // 日期檢核設定

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private _cacheService: CacheService,
        private f2100201: F2100201ApiService, // 外幣活支存明細查詢
        private f2100202: F2100202ApiService, // 外幣定存明細查詢
    ) {
    }


    /**
     * 取得頁籤設定
     * 定存：可查詢一年內資料
     *      'XF': '外幣定期存款',
     *      'XFS': '外幣綜定存',
     * 活存：僅可查詢6個月內資料
     */
    getBookmark(acctObj?: any) {
        let output = [];
        let detail_data = [];
        this.dateCheckList = {};
        let acctType = '';
        if (!!acctObj && typeof acctObj == 'object') {
            acctType = this._formateService.checkField(acctObj, 'acctType');
        }
        const time_deposit_list = ['XF', 'XFS'];
        const isTimeDeposit = (time_deposit_list.indexOf(acctType) > -1) ? true : false;

        // == Level 2 == // : 4/24 送審版本已改查詢區間條件
        // --- [7D] --- //
        // detail_data.push({
        //     id: '7D',
        //     name: 'BOOK_MARK.DEPOSIT_OVERVIEW.7D', // 最近1週
        //     sort: 1,
        //     search_data: this.setDateCheck('7D')
        // });

        // --- [1M] --- //
        detail_data.push({
            id: '1M',
            name: 'BOOK_MARK.FOREX_DEPOSIT.1M', // 最近1個月
            sort: 2,
            search_data: this.setDateCheck('1M')
        });
        if (!isTimeDeposit) {
            // 活存沒有一年資料
            // --- [3M] --- //
            detail_data.push({
                id: '3M',
                name: 'BOOK_MARK.FOREX_DEPOSIT.3M', // 最近3個月
                sort: 3,
                search_data: this.setDateCheck('3M')
            });
        }
        // --- [6M] --- //
        detail_data.push({
            id: '6M',
            name: 'BOOK_MARK.FOREX_DEPOSIT.6M', // 最近6個月
            sort: 4,
            search_data: this.setDateCheck('6M')
        });
        if (isTimeDeposit) {
            // 定存才有一年資料
            // --- [12M] --- //
            detail_data.push({
                id: '12M',
                name: 'BOOK_MARK.FOREX_DEPOSIT.12M', // 最近12個月
                sort: 5,
                search_data: this.setDateCheck('12M')
            });
        }
        // --- [custom] --- //
        detail_data.push({
            id: 'custom',
            name: 'BOOK_MARK.COMMON.CUSTOM', // 自訂
            sort: 6,
            search_data: this.setDateCheck('custom', isTimeDeposit)
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
     * deposit-forex: 外幣存款查詢
     * deposit-forex-demand: 外幣存款查詢-活存明細
     * deposit-forex-time: 外幣存款查詢-定存明細
     * deposit-forex-demand@帳號_幣別: 刪除外幣存款查詢-活存明細 單筆帳號資料
     * deposit-forex-time@帳號_幣別: 刪除外幣存款查詢-定存明細 帳號資料
     */
    removeAllCache(type?: string, acctObj?: object) {
        if (typeof type == 'undefined') {
            type = 'deposit-forex';
        }
        if (type === 'alldetail') {
            type = 'deposit-forex-demand@' + this._formateService.checkField(acctObj, 'acctNo');
            type += '_' + this._formateService.checkField(acctObj, 'currency');
        }
        this._cacheService.removeGroup(type);
    }

    /**
     * 取得自訂查詢區間資料
     * @param reqObj
     * @param page
     */
  getDetailData(reqObj: object, page, option?: Object, pageSize?: string | number): Promise<any> {
        // 日期檢核: 外幣存款可查詢本月及前三個月內資料
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
        const currCode = this._formateService.checkField(reqObj, 'currCode');
        let cache_main_key = 'deposit-forex-demand@' + acctNo + '_' + currCode;
        let cache_sub_key = [start_date, end_date];
    const cache_check = this._cacheService.checkPaginatorCach(cache_main_key, page, [], option, null, { sub_key: cache_sub_key });
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        let cache_option = this._cacheService.getCacheSet(cache_key);
        cache_option.groupList.push(cache_main_key);

        switch (acctType) {
            case 'XF': // 外匯定期存款
            case 'XFS': // 外匯綜定存
        return this.f2100202.getData(reqObj, page, [], pageSize).then(
                    (sucessObj) => {
                        this._cacheService.save(cache_key, sucessObj, cache_option);
                        return Promise.resolve(sucessObj);
                    },
                    (failed) => {
                        return Promise.reject(failed);
                    }
                );
            // case 'CK': // 支票存款
            case 'XS': // 活期存款
            case 'XM': // 綜合存款
            default: // 其他都發f2100201: native:ForeignExchangeDeposit
        return this.f2100201.getPageData(reqObj, page, [], pageSize).then(
                    (sucessObj) => {
                        this._cacheService.save(cache_key, sucessObj, cache_option);
                        return Promise.resolve(sucessObj);
                    },
                    (failed) => {
                        return Promise.reject(failed);
                    }
                );
            // default:
            //     return Promise.reject({
            //         title: 'ERROR.TITLE',
            //         content: 'ERROR.DATA_FORMAT_ERROR'
            //     });
        }
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    private setDateCheck(set_key: string, isTimeDeposit?: boolean) {
        // 最多只可查詢本月與一年內資料: search(now=2019/04/25): 2018/04/01~2019/04/25
        let set_obj: any = {
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '6', // 查詢範圍限制(活存最多6個月)
            rangeDate: '', // 比較日
            rangeBaseDate: '01' // 當rangeType為自訂時，的基礎日期
        };
        if (isTimeDeposit) {
            set_obj.rangeNum = '12';
        }
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
                // search(now=2019/04/25): 2019/03/25~2019/04/25
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';
                break;
            case '3M': // 最近3月
                // search(now=2019/04/25): 2019/01/25~2019/04/25
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '3';
                set_obj['rangeBaseDate'] = '';
                break;
            case '6M': // 最近6月
                // search(now=2019/04/25): 2018/10/25~2019/04/25
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '6';
                set_obj['rangeBaseDate'] = '';
                break;
            case '12M': // 最近1年
                // search(now=2019/04/25): 2018/04/25~2019/04/25
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
