/**
 * 外幣匯率(即時)
 *  cardDate	掛牌日期
 *  cardTime	牌告時間
 *  cardTimes	牌告次數
 *  details	本行匯率明細列表
 *      currency	幣別
 *      currencyName	幣別名稱
 *      type	類型(買入、賣出)
 *      promptEx	即期匯率
 *      cashEx	現鈔匯率
 *      tenD	10天匯率
 *      thirtyD	30天匯率
 *      sixtyD	60天匯率
 *      ninetyD	90天匯率
 *      fourMon	120天匯率
 *      sixMon	180天匯率
 *      clearExchange	清算匯率
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000201ReqBody } from './fb000201-req';
import { FB000201ResBody } from './fb000201-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TelegramOption } from '@core/telegram/telegram-option';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FormateService } from '@shared/formate/formate.service';
@Injectable()
export class FB000201ApiService extends ApiBase<FB000201ReqBody, FB000201ResBody> {

    constructor(public telegram: TelegramService<FB000201ResBody>,
        public errorHandler: HandleErrorService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'FB000201');
    }



    getData(set_data?: Object, background?: boolean): Promise<any> {
        // 參數處理
        let option: TelegramOption = new TelegramOption();
        if (background === true) {
            option.background = true;
        }
        let data: FB000201ReqBody = new FB000201ReqBody();

        return this.send(data, option).then(
            (resObj) => {

                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    cardDate: '',   // 掛牌日期
                    cardTime: '',   // 掛牌時間
                    cardTimes: '',  // 掛牌次數
                    dataTime: '',
                    data: [],
                    currency_list: {} // 以幣別為清單
                };

                let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
                output.info_data = telegram;
                if (telegram.hasOwnProperty('cardDate')) {
                    output.cardDate = telegram.cardDate;
                }
                if (telegram.hasOwnProperty('cardTime')) {
                    output.cardTime = telegram.cardTime;
                }
                if (telegram.hasOwnProperty('cardTimes')) {
                    output.cardTimes = telegram.cardTimes;
                }
                if (output.cardDate !== '') {
                    // 掛牌日期 轉換
                    output.cardDate = this._formateService.transDate(output.cardDate, 'date');
                }
                output.dataTime = this._formateService.transDate(output.cardDate + ' ' + output.cardTime);


                let check_obj = this.checkObjectList(telegram, 'details.detail');
                let detail_data = [];
                if (typeof check_obj !== 'undefined') {
                    detail_data = this.modifyTransArray(check_obj);
                    delete output.info_data['details'];
                }
                const modify_data = this._modifyDetailData(detail_data);
                output.data = modify_data.data;
                output.currency_list = modify_data.list;

                if (output.data.length <= 0
                    // tslint:disable-next-line:radix
                    && (output.cardTimes == '' || parseInt(output.cardTimes) == 0)
                ) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY'
                    });
                }

                output.status = true;
                output.msg = '';
                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * 整理細節
     */
    private _modifyDetailData(set_data: Array<any>) {
        let output = {
            list: {},
            data: []
        };

        let list_data = {};
        set_data.forEach((item, item_index) => {
            const data_type = this._formateService.checkField(item, 'type'); // type 買入0 賣出1
            let currency = this._formateService.checkField(item, 'currency'); // 此資料的幣別資訊
            currency = currency.toLocaleUpperCase();
            const currencyName = this._formateService.checkField(item, 'currencyName');
            if (!list_data.hasOwnProperty(currency)) {
                list_data[currency] = {
                    'country': currency, // 幣別
                    'currency': currency, // 幣別
                    'currencyName': '',
                    'order': item_index, // 以下行順序為預設排序
                    'spotBuy': '', // 即期匯率(買入)
                    'spotSell': '', // 即期匯率(賣出)
                    'cashBuy': '', // 現鈔匯率(買入)
                    'cashSell': '', // 現鈔匯率(賣出)
                    'detail': {
                        '10': { 'buy': '', 'sell': '' }, // tenD	10天匯率
                        '30': { 'buy': '', 'sell': '' }, // thirtyD	30天匯率
                        '60': { 'uy': '', 'sell': '' }, // sixtyD	60天匯率
                        '90': { 'buy': '', 'sell': '' }, // ninetyD	90天匯率
                        '120': { 'buy': '', 'sell': '' }, // fourMon	120天匯率
                        '180': { 'buy': '', 'sell': '' }, // sixMon	180天匯率
                        'clear': { 'buy': '', 'sell': '' } // clearExchange	清算匯率
                    }
                };
            }

            if (currencyName !== '' && list_data[currency]['currencyName'] == '') {
                list_data[currency]['currencyName'] = currencyName;
            }
            let item_data = {
                'promptEx': '', // 即期 promptEx
                'cashEx': '', // 現鈔 cashEx
                '10': '', // tenD	10天匯率
                '30': '', // thirtyD	30天匯率
                '60': '', // sixtyD	60天匯率
                '90': '', // ninetyD	90天匯率
                '120': '', // fourMon	120天匯率
                '180': '', // sixMon	180天匯率
                'clear': '' // clearExchange	清算匯率
            };
            item_data['promptEx'] = this._formateService.checkField(item, 'promptEx');
            item_data['cashEx'] = this._formateService.checkField(item, 'cashEx');
            item_data['10'] = this._formateService.checkField(item, 'tenD');
            item_data['30'] = this._formateService.checkField(item, 'thirtyD');
            item_data['60'] = this._formateService.checkField(item, 'sixtyD');
            item_data['90'] = this._formateService.checkField(item, 'ninetyD');
            item_data['120'] = this._formateService.checkField(item, 'fourMon');
            item_data['180'] = this._formateService.checkField(item, 'sixMon');
            item_data['clear'] = this._formateService.checkField(item, 'clearExchange');
            let item_key: any;
            // for (item_key in item_data) {
            //     if (!item_data.hasOwnProperty(item_key)) {
            //         continue;
            //     }
            //     item_data[item_key] = this._formateService.transFinancial(item_data[item_key]);
            // }

            if (data_type == '0') {
                // 買入資料
                list_data[currency]['spotBuy'] = item_data.promptEx;
                list_data[currency]['cashBuy'] = item_data.cashEx;
                list_data[currency]['detail']['10']['buy'] = item_data['10'];
                list_data[currency]['detail']['30']['buy'] = item_data['30'];
                list_data[currency]['detail']['60']['buy'] = item_data['60'];
                list_data[currency]['detail']['90']['buy'] = item_data['90'];
                list_data[currency]['detail']['120']['buy'] = item_data['120'];
                list_data[currency]['detail']['180']['buy'] = item_data['180'];
                list_data[currency]['detail']['clear']['buy'] = item_data['clear'];
            } else {
                // 賣出資料
                list_data[currency]['spotSell'] = item_data.promptEx;
                list_data[currency]['cashSell'] = item_data.cashEx;
                list_data[currency]['detail']['10']['sell'] = item_data['10'];
                list_data[currency]['detail']['30']['sell'] = item_data['30'];
                list_data[currency]['detail']['60']['sell'] = item_data['60'];
                list_data[currency]['detail']['90']['sell'] = item_data['90'];
                list_data[currency]['detail']['120']['sell'] = item_data['120'];
                list_data[currency]['detail']['180']['sell'] = item_data['180'];
                list_data[currency]['detail']['clear']['sell'] = item_data['clear'];
            }
        });

        output.list = list_data;
        output.data = this._formateService.transArrayFillter(list_data, 'order');
        return output;
    }

}
