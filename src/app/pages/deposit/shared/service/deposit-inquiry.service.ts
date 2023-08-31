/**
 * 存款查詢
 * 台幣、外幣、黃金
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { F2000101ApiService } from '@api/f2/f2000101/f2000101-api.service'; // 台幣存款
import { F2000201ApiService } from '@api/f2/f2000201/f2000201-api.service'; // 外幣存款
import { F2000501ApiService } from '@api/f2/f2000501/f2000501-api.service'; // 我的金庫
import { DepositTypeSet } from '@conf/deposit_type';
import { CacheService } from '@core/system/cache/cache.service';

@Injectable()
export class DepositInquiryService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private f2000101: F2000101ApiService // 台幣存款查詢
        , private f2000201: F2000201ApiService // 外幣存款查詢
        , private f2000501: F2000501ApiService // 我的金庫
        , private _cacheService: CacheService
    ) {
    }

    /**
     * 刪除存摺相關cache
     * @param type
     */
    regetData(type?: string) {
        let cache_list = {
            'tw': 'deposit-tw'
            , 'forex': 'deposit-forex'
            , 'gold': 'deposit-gold'
            , 'home': 'user-home'
            , 'all': 'deposit'
            , 'assets': 'deposit-assets'
        };
        let do_deposit = 'deposit';
        if (typeof type !== 'undefined') {
            if (cache_list.hasOwnProperty(type)) {
                do_deposit = cache_list[type];
            } else {
                do_deposit = '';
            }
        }
        if (do_deposit !== '') {
            this._cacheService.removeGroup(do_deposit);
        }
    }

    /**
     * 刪除cache
     * deposit: 所有存款查詢相關
     * deposit-assets: 總資產
     * deposit-tw: 台幣存摺
     * deposit-forex: 外幣存摺
     * deposit-gold: 黃金存摺
     */
    removeAllCache(type?: string) {
        if (typeof type == 'undefined') {
            type = 'deposit';
        }
        this._cacheService.removeGroup(type);
    }

    /**
     * 總資產資料取得
     * @param option
     */
    getAssets(option?: Object): Promise<any> {
        const cache_key = 'deposit-assets';
        const cache_check = this._cacheService.checkCacheSet(option);

        if (!cache_check.reget) {
          // 背景取得，首頁請求，取cache
          const cache_data = this._cacheService.load(cache_key);
          if (cache_data) {
            return Promise.resolve(cache_data);
          }
        } else {
          // 非首頁強制清除cache (取得最新的)
          this._cacheService.remove(cache_key);
        }

        let set_data: any = {};
        let set_header: any = {};
        set_header.background = cache_check.background;
        return this.f2000501.send(set_data, set_header).then(
          (sucessObj) => {
            let output = sucessObj;
            sucessObj['_modify'] = this.modifyAssets(sucessObj);
            let cache_option = this._cacheService.getCacheSet(cache_key);
            this._cacheService.save(cache_key, output, cache_option);
            return Promise.resolve(output);
          },
          (failedObj) => {
            return Promise.reject(failedObj);
          }
        );
    }


    /**
     * 取得所有帳戶列表
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getData(page?: number, sort?: Array<any>, option?: Object, pageSize?: string | number): Promise<any> {
        const cache_check = this._cacheService.checkPaginatorCach('deposit-tw', page, sort, option, pageSize);
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }

        return this.f2000101.getPageData(page, sort, cache_check.background, pageSize).then(
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


    /**
     * 外幣存款查詢
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getForexData(page?: number, sort?: Array<any>, option?: Object, pageSize?: string | number): Promise<any> {
        const cache_check = this._cacheService.checkPaginatorCach('deposit-forex', page, sort, option, pageSize);
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        return this.f2000201.getPageData(page, sort, cache_check.background, pageSize).then(
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


    /**
     * 檢查類別
     */
    checkDepositType(item, depositType) {
        let output = this._formateService.transClone(item);
        let acctType = this._formateService.checkField(item, 'acctType');
        output['showDemandDeposit'] = true;
        if (!DepositTypeSet.hasOwnProperty(depositType)) {
            return output;
        }
        const expirationDateList = DepositTypeSet[depositType]['lastTrnsDate']['expirationDate'];
        if (expirationDateList.indexOf(acctType) > -1) {
            output['showDemandDeposit'] = false;
        }
        return output;
    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * 資產資料整理
     * @param resObj
     */
    private modifyAssets(resObj) {
        this._logger.log('HomePage', 'assets data', resObj);
        let checkData = resObj.data;
        let output: any = {
            status: false,
            msg: '',
            deposit: {},
            twd: {},
            forex: {},
            fund: {},
            gold: {},
            bill: {},
            percent_list: []
        };
        let success_list = [];
        let tmp_key: any;

        // 總資產
        tmp_key = 'totalAmt';
        let tmp_deposit = this.modifyAssetsDetail(checkData, tmp_key);
        output.deposit = tmp_deposit;
        if (tmp_deposit.status) {
            success_list.push(tmp_key);
        }

        let percent_check = [];
        let do_option = {
            total: output.deposit.amount,
            berorePercent: 0,
            last: false
        };
        // 台幣
        tmp_key = 'twnBalance';
        let tmp_twd = this.modifyAssetsDetail(checkData, tmp_key, do_option);
        tmp_twd['id'] = 'twd';
        output.twd = tmp_twd;
        do_option.berorePercent += tmp_twd.percentage;
        percent_check.push(tmp_twd);
        if (tmp_twd.status) {
            success_list.push(tmp_key);
        }
        // 外幣摺台
        tmp_key = 'fxnBalance';
        let tmp_forex = this.modifyAssetsDetail(checkData, tmp_key, do_option);
        tmp_forex['id'] = 'forex';
        output.forex = tmp_forex;
        do_option.berorePercent += tmp_forex.percentage;
        percent_check.push(tmp_forex);
        if (tmp_forex.status) {
            success_list.push(tmp_key);
        }
        // 基金折台
        tmp_key = 'fundBalance';
        let tmp_fund = this.modifyAssetsDetail(checkData, tmp_key, do_option);
        tmp_fund['id'] = 'fund';
        output.fund = tmp_fund;
        do_option.berorePercent += tmp_fund.percentage;
        percent_check.push(tmp_fund);
        if (tmp_fund.status) {
            success_list.push(tmp_key);
        }

        do_option.last = true; // 最後一筆
        // 黃金折台
        tmp_key = 'goldBalance';
        let tmp_gold = this.modifyAssetsDetail(checkData, tmp_key, do_option);
        tmp_gold['id'] = 'gold';
        output.gold = tmp_gold;
        do_option.berorePercent += tmp_gold.percentage;
        percent_check.push(tmp_gold);
        if (tmp_gold.status) {
            success_list.push(tmp_key);
        }

        // percent modify
        if (do_option.berorePercent > 100 && percent_check.length > 0) {
            let more_percnet = do_option.berorePercent - 100;
            percent_check = this._formateService.transArraySort(percent_check, { sort: 'amount', reverse: 'DESC', special: 'amount' });
            let modify_id = (!!percent_check[0]['id']) ? percent_check[0]['id'] : '';
            if (!!output[modify_id]) {
                let new_percent = (output[modify_id]['percentage']) ? output[modify_id]['percentage'] : 0;
                // this._logger.log('HomePage', 'assets percentage', new_percent, more_percnet, new_percent - more_percnet);
                new_percent = Number((new_percent - more_percnet).toFixed(1));
                if (new_percent < 0) {
                    new_percent = 0;
                }
                output[modify_id]['percentage'] = new_percent;
                percent_check[0] = output[modify_id];
            }
        }
        output.percent_list = percent_check;

        if (success_list.length > 0) {
            // 有一個資料就算成功
            output.status = true;
        }
        this._logger.log('HomePage', 'assets modify data', output);
        return output;
    }

    /**
     * 資產資料整理-整理細節
     * @param check_data
     * @param item_key
     */
    private modifyAssetsDetail(check_data, item_key, options?: any) {
        let empty_str = '';
        let sub_output: any = {
            status: false,
            percentage: 0,
            amount: 0,
            data: '',
            old_data: ''
        };
        let doPercent = false;
        let isLast = false;
        let totalAmt = 0;
        let beforeVal = 0;
        if (typeof options == 'object' && options) {
            doPercent = true;
            // tslint:disable-next-line: radix
            totalAmt = (!!options.total) ? parseInt(options.total) : 0;
            beforeVal = (!!options.berorePercent) ? parseFloat(options.berorePercent) : 0;
            isLast = (options.last) ? true : false;
        }

        sub_output.data = this._formateService.checkField(check_data, item_key);
        sub_output.old_data = check_data[item_key];
        if (sub_output.data != '') {
            sub_output.status = true;
            sub_output.amount = this._formateService.transNumber(sub_output.data, 'int');
            if (doPercent) {
				let amount = sub_output.amount;
                let percentage = 0;
                if (isLast) {
                    // 最後一筆
                    if (beforeVal > 100) {
                        beforeVal = 99.9;
                    } else if (beforeVal != 0) {
                        percentage = Number((100 - beforeVal).toFixed(1));
                    } else if (beforeVal == 0 && amount != 0) {
                        percentage = 100;
                    } else {
                        percentage = 0;
                    }
                    if (percentage <= 0 && amount != 0) {
                        percentage = 0.1;
                    }
                } else if (amount != 0) {
                    percentage = Number(((amount / totalAmt) * 100).toFixed(1));
                    if (percentage < 0.1) {
                        percentage = 0.1;
                    }
                }
                sub_output.percentage = percentage;
            }
        } else {
            sub_output.data = empty_str;
        }
        if (!sub_output.status && sub_output.old_data == '0') {
            // 有帳戶但為0元
            sub_output.status = true;
        }

        // this._logger.log('HomePage', 'assets modify subdata', this._formateService.transClone(sub_output));
        return sub_output;
    }


}


