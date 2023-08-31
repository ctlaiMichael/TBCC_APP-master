/**
 * 已實現損益查詢
 * 
 * 
 * 
 *
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';

@Injectable()

export class FundDetailTagService {
    /**
     * 參數處理
     */
    private dateCheckList = {}; // 日期檢核設定

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _checkService: CheckService,
    ) {
    }


    /**
     * 取得頁籤設定
     */
    getBookmark() {
        let output = [];
        let detail_data = [];
        this.dateCheckList = {};


        // --- [7D] --- //
        detail_data.push({
            id: '7D',
            name: 'BOOK_MARK.HAS_REALIZE.7D', // 最近1週
            sort: 1,
            search_data: this.setDateCheck('7D')
        });
        //     // --- [1M] --- //
        detail_data.push({
            id: '1M',
            name: 'BOOK_MARK.HAS_REALIZE.1M', // 最近1個月
            sort: 2,
            search_data: this.setDateCheck('1M')
        });
        // --- [12M] --- //
        detail_data.push({
            id: '12M',
            name: 'BOOK_MARK.HAS_REALIZE.1Y', // 近一年
            sort: 3,
            search_data: this.setDateCheck('12M')
        });
        // --- [custom] --- //
        detail_data.push({
            id: 'custom',
            name: 'BOOK_MARK.HAS_REALIZE.CUSTOM', // 自訂
            sort: 4,
            search_data: this.setDateCheck('custom')
        });
        output.push({
            id: 'summary',
            name: 'BOOK_MARK.COMMON.FUND_PROFIT', // 基金損益
            sort: 1
        });
        output.push({
            id: 'detail',
            name: 'BOOK_MARK.COMMON.TRANSACTION_DETAIL', // 交易明細
            sort: 2,
            default: '12M',
            data: detail_data
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

    //********* */加完api開啟並修改
    // /**
    //  * 取得自訂查詢區間資料
    //  * @param reqObj
    //  * @param page
    //  */
    // getDetailData(reqObj: object, page): Promise<any> {
    //     // 日期檢核: 外幣存款可查詢本月及前三個月內資料
    //     let tmp_cehck = reqObj;
    //     let check_id = this._formateService.checkField(reqObj, 'id');
    //     let start_date = this._formateService.checkField(reqObj, 'startDate');
    //     let end_date = this._formateService.checkField(reqObj, 'endDate');
    //     if (check_id === '') {
    //         return Promise.reject({
    //             title: 'ERROR.TITLE',
    //             content: 'ERROR.DATA_FORMAT_ERROR'
    //         });
    //     }
    //     let check_date = this.getDateSet(check_id);
    //     let check_data = this._checkService.checkDateRange([start_date, end_date], check_date);
    //     if (!check_data.status) {
    //         return Promise.reject({
    //             title: 'ERROR.TITLE',
    //             content: check_data.errorMsg.join('')
    //         });
    //     }

    //     const acctType = this._formateService.checkField(reqObj, 'acctType');
    //     this._logger.step('Deposit', 'getDetailData', acctType, reqObj);
    //     switch (acctType) {
    //         case 'XF': // 外匯定期存款
    //         case 'XFS': // 外匯綜定存
    //             return this.f2100202.getData(reqObj).then(
    //                 (sucess) => {
    //                     return Promise.resolve(sucess);
    //                 },
    //                 (failed) => {
    //                     return Promise.reject(failed);
    //                 }
    //             );
    //         // case 'CK': // 支票存款
    //         case 'XS': // 活期存款
    //         case 'XM': // 綜合存款
    //         default: // 其他都發f2100201: native:ForeignExchangeDeposit
    //             return this.f2100201.getPageData(reqObj, page).then(
    //                 (sucess) => {
    //                     return Promise.resolve(sucess);
    //                 },
    //                 (failed) => {
    //                     return Promise.reject(failed);
    //                 }
    //             );
    //         // default:
    //         //     return Promise.reject({
    //         //         title: 'ERROR.TITLE',
    //         //         content: 'ERROR.DATA_FORMAT_ERROR'
    //         //     });
    //     }
    // }

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
            rangeNum: '12', // 查詢範圍限制
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
                // search(now=2019/04/22): 2019/03/22~2019/04/22 (個網) 目前以此為主
                // search(now=2019/04/22): 2019/03/21~2019/04/22 (行銀)
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';
                break;
            case '3M': // 最近3月
                // search(now=2019/04/22): 2019/01/22~2019/04/22
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '3';
                set_obj['rangeBaseDate'] = '';
                break;
            case '6M': // 最近6月
                // search(now=2019/04/22): 2018/10/22~2019/04/22
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '6';
                set_obj['rangeBaseDate'] = '';
                break;
            case '12M': // 最近1年
                // search(now=2019/04/22): 2018/04/22~2019/04/22
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
