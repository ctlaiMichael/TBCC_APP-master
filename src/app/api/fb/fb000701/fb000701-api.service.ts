
/**
 * 黃金存摺牌價(即時)
 *      goldRateDate;//	掛牌日期	string	1	YYYMMDD(民國年)
 *      goldRateTime;//	牌告時間	string	1	HHMMSS
 *      g1GSaleAmt;//	黃金存摺1公克賣出價格	string	1
 *      g1GBuyAmt;//	黃金存摺1公克買進價格	string	1
 *      g1KGSaleAmt;//	黃金條塊1公斤賣出價格	string	1
 *      g1KGBalanceAmt;//	黃金條塊1公斤轉換補繳差額	string	1	若為0則無掛牌,請顯示 －
 *      g500GSaleAmt;//	黃金條塊500公克賣出價格	string	1	若為0則無掛牌,請顯示 －
 *      g500GBalanceAmt;//	黃金條塊500公克轉換補繳差額	string	1	若為0則無掛牌,請顯示 －
 *      g250GSaleAmt;//	黃金條塊250公克賣出價格	string	1	若為0則無掛牌,請顯示 －
 *      g250GBalanceAmt;//	黃金條塊250公克轉換補繳差額	string	1	若為0則無掛牌,請顯示 －
 *      g100GSaleAmt;//	黃金條塊100公克賣出價格	string	1	若為0則無掛牌,請顯示 －
 *      g100GBalanceAmt;//	黃金條塊100公克轉換補繳差額	string	1	若為0則無掛牌,請顯示 －
 *      g1TSaleAmt;//	黃金條塊一台兩賣出價格	string	1	若為0則無掛牌,請顯示 －
 *      g1TBalanceAmt;//	黃金條塊一台兩轉換補繳差額	string	1	若為0則無掛牌,請顯示 －
 *
 * 黃金存摺牌告 如果電文回覆的金額="999999999999"，應該顯示 "-" 307 吳政修
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000701ReqBody } from './fb000701-req';
import { FB000701ResBody } from './fb000701-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TelegramOption } from '@core/telegram/telegram-option';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FB000701ApiService extends ApiBase<FB000701ReqBody, FB000701ResBody> {

    constructor(public telegram: TelegramService<FB000701ResBody>,
        public errorHandler: HandleErrorService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'FB000701');
    }


    getData(set_data?: Object, background?: boolean): Promise<any> {
        // 參數處理
        let option: TelegramOption = new TelegramOption();
        if (background === true) {
            option.background = true;
        }
        let data: FB000701ReqBody = new FB000701ReqBody();


        return this.send(data, option).then(
            (resObj) => {
                let output = {
                    info_data: {},
                    status: false,
                    msg: 'Error',
                    date: '',
                    time: '',
                    unit: 'TWD',
                    dataTime: '',
                    data1: {},
                    data2: []
                };

                // 1公克
                let g_1 = { name: 'PG_GOLD.RATE.BARS.1G', sell: '', buy: '' };
                // 1公斤
                let bar_1000 = { name: 'PG_GOLD.RATE.BARS.1KG', sell: '', balance: '' };
                // 500公克
                let bar_500 = { name: 'PG_GOLD.RATE.BARS.500G', sell: '', balance: '' };
                // 250公克
                let bar_250 = { name: 'PG_GOLD.RATE.BARS.250G', sell: '', balance: '' };
                // 100公克
                let bar_100 = { name: 'PG_GOLD.RATE.BARS.100G', sell: '', balance: '' };
                // 1台兩<br>(金鑽條塊)
                let bar_06 = { name: 'PG_GOLD.RATE.BARS.37G', sell: '', balance: '' };
                // 1公克
                let bar_01 = { name: 'PG_GOLD.RATE.BARS.1G', sell: '- -', balance: '- -' }; // 固定輸出

                let myteltgram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
                output.info_data = myteltgram;

                output.date = this._formateService.checkField(myteltgram, 'goldRateDate');
                output.time = this._formateService.checkField(myteltgram, 'goldRateTime');
                if (output.date !== '') {
                    output.date = this._formateService.transDate(output.date, 'date');
                }
                output.dataTime = this._formateService.transDate(output.date + ' ' + output.time);


                g_1.sell = this._checkField(myteltgram, 'g1GSaleAmt', { currency: output.unit });
                g_1.buy = this._checkField(myteltgram, 'g1GBuyAmt', { currency: output.unit });
                bar_1000.sell = this._checkField(myteltgram, 'g1KGSaleAmt', { currency: output.unit });
                bar_1000.balance = this._checkField(myteltgram, 'g1KGBalanceAmt', { currency: output.unit });
                bar_500.sell = this._checkField(myteltgram, 'g500GSaleAmt', { currency: output.unit });
                bar_500.balance = this._checkField(myteltgram, 'g500GBalanceAmt', { currency: output.unit });
                bar_250.sell = this._checkField(myteltgram, 'g250GSaleAmt', { currency: output.unit });
                bar_250.balance = this._checkField(myteltgram, 'g250GBalanceAmt', { currency: output.unit });
                bar_100.sell = this._checkField(myteltgram, 'g100GSaleAmt', { currency: output.unit });
                bar_100.balance = this._checkField(myteltgram, 'g100GBalanceAmt', { currency: output.unit });
                bar_06.sell = this._checkField(myteltgram, 'g1TSaleAmt', { currency: output.unit });
                bar_06.balance = this._checkField(myteltgram, 'g1TBalanceAmt', { currency: output.unit });

                output.status = true;
                output.data1 = g_1;
                output.data2.push(bar_1000);
                output.data2.push(bar_500);
                output.data2.push(bar_250);
                output.data2.push(bar_100);
                output.data2.push(bar_06);
                output.data2.push(bar_01);
                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * 回傳變數處理
     * @param set_data 物件
     * @param field 欄位
     * @param emt_str 空值時處理
     *
     * 黃金存摺牌告 如果電文回覆的金額="999999999999"，應該顯示 "-" 307 吳政修
     * native: money >= 99999999999L
     */
    private _checkField(set_data, field, option?: Object) {
        const empty_str = (option.hasOwnProperty('empty_str')) ? option['empty_str'] : '- -';
        const field_type = (option.hasOwnProperty('type')) ? option['type'] : 'money';
        let output = empty_str;
        let data = this._formateService.checkField(set_data, field);
        if (ObjectCheckUtil.checkEmpty(data, true, true)) {
            output = data;
            if (field_type === 'money') {
                const currency = (option.hasOwnProperty('currency')) ? option['currency'] : '';
                output = this._formateService.transMoney(data, currency);
            }
        }
        let check_amount = this._formateService.transNumber(output);
        // tslint:disable-next-line:radix
        if (parseInt(check_amount) >= 99999999999) {
            output = empty_str;
        }
        return output;
    }


}
