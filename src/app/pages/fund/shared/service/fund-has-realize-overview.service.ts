/**
 *基金已實現損益總覽
 */
import { Injectable, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000201ApiService } from '@api/fi/fI000201/fI000201-api.service';
import { CacheService } from '@core/system/cache/cache.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()

export class FundHasRealizeOverviewService {
    constructor(
        private _logger: Logger,
        private fi000201: FI000201ApiService
        , private _cacheService: CacheService
        , private _formateService: FormateService
    ) { }

    getOverview(set_data): Promise<any> {
        let option = {
            'background': false,
            'reget': false
        };
        const cache_key = 'fund-profit-loss';
        const cache_check = this._cacheService.checkCacheSet(option);
        if (cache_check.reget) {
            // 強制取得最新的
            this._cacheService.remove(cache_key);
        } else {
            // 取cache
            const cache_data = this._cacheService.load(cache_key);
            if (cache_data) {
                return Promise.resolve(cache_data);
            }
        }
        return this.fi000201.getData(set_data).then(
            (sucess) => {
                let output: any = sucess;
                let modify_data = this._modifyData(sucess.data);
                output.modify_data = modify_data;
                let cache_option = this._cacheService.getCacheSet(cache_key);
                this._cacheService.save(cache_key, output, cache_option);
                return Promise.resolve(output);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }

    /**
     * 資料整理
     * @param resObj
     * currency	幣別
     * incomeState	全年損益(有正負號)
     * payAmt	給付總額
     * intAmt	交易所得(有正負號)
     * terminateAmount	解約金額
     * amount	原始信託金額
     */
    private _modifyData(resObj: Array<any>) {
        let output: any = {
            incomeState: [], // 全年損益
            payAmt: [], // 給付總額
            intAmt: [], // 交易所得
            terminateAmount: [], // 解約金額
            amount: [], // 原始信託金額
        };
        resObj.forEach((item) => {
            let currency = this._formateService.checkField(item, 'currency');
            let tmp_data = {
                currency: this._formateService.checkField(item, 'currency'),
                incomeState: this._formateService.checkField(item, 'incomeState'),
                payAmt: this._formateService.checkField(item, 'payAmt'),
                intAmt: this._formateService.checkField(item, 'intAmt'),
                terminateAmount: this._formateService.checkField(item, 'terminateAmount'),
                amount: this._formateService.checkField(item, 'amount')
            };
            let check_data: any;
            let tmp_key: any;
            // 全年損益
            tmp_key = 'incomeState';
            check_data = this._modifyItem(currency, tmp_key, item, true);
            if (!!check_data) {
                output[tmp_key].push(check_data);
            }
            // 給付總額
            tmp_key = 'payAmt';
            check_data = this._modifyItem(currency, tmp_key, item);
            if (!!check_data) {
                output[tmp_key].push(check_data);
            }
            // 交易所得
            tmp_key = 'intAmt';
            check_data = this._modifyItem(currency, tmp_key, item, true);
            if (!!check_data) {
                output[tmp_key].push(check_data);
            }
            // 解約金額
            tmp_key = 'terminateAmount';
            check_data = this._modifyItem(currency, tmp_key, item);
            if (!!check_data) {
                output[tmp_key].push(check_data);
            }
            // 原始信託金額
            tmp_key = 'amount';
            check_data = this._modifyItem(currency, tmp_key, item);
            if (!!check_data) {
                output[tmp_key].push(check_data);
            }
        });
        return output;
    }

    /**
     * 整理細項
     * @param currency 幣別
     * @param set_key 欄位
     * @param data 資料
     * @param check_type 檢查正負號
     */
    private _modifyItem(currency, set_key, item, check_type?: boolean) {
        let output = {
            currency: currency,
            data: '',
            number: 0,
            formate: '',
            type: '',
            class: ''
        };
        let class_list = {
            '+': 'font_red',
            '-': 'font_bl_gre'
        };
        let field_data = this._formateService.checkField(item, set_key);
        if (field_data == '') {
            return undefined;
        }
        output.data = field_data;
        output.number = parseFloat(field_data);
        if (!!check_type && output.number != 0) {
            output.type = (output.number > 0) ? '+' : '-';
            if (!!class_list[output.type]) {
                output.class = class_list[output.type];
            }
        }
        output.formate = output.type + this._formateService.transMoney(Math.abs(output.number), currency);
        return output;
    }

}
