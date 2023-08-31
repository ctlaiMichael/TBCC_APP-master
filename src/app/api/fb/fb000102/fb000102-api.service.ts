
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000102ReqBody } from './fb000102-req';
import { FB000102ResBody } from './fb000102-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NumberUtil } from '@shared/util/formate/number/number-util';

@Injectable()
export class FB000102ApiService extends ApiBase<FB000102ReqBody, FB000102ResBody> {

    constructor(public telegram: TelegramService<FB000102ResBody>,
        public errorHandler: HandleErrorService) {
        super(telegram, errorHandler, 'FB000102');
    }


    send(data: FB000102ReqBody): Promise<any> {
        // 參數處理
        /**
         * 台幣放款利率
         */
        return super.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    dataTime: '',
                    data: {
                        loanAddRate1: ''  // 基準放款指數(本行)
                        , loanAddRate2: ''  // 基準放款指數(原農民銀行)
                        , CreditCardRate: ''  // 信用卡循環信用利率
                        , BaseRate: ''  // 基準利率
                        , BaseRateM: ''  // 月基準利率
                        , FDRate: ''  // 定儲指數利率
                        , FDRateM: ''  // 定儲指數月指標利率
                        , BaseRate2: ''  // 基準利率(原農民銀行)
                        , FDRate2: ''  // 定儲指數利率(原農民銀行)
                    }
                };


                let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
                if (telegram.hasOwnProperty('date') && telegram['date']) {
                    output.dataTime = telegram['date'];
                }
                if (telegram.hasOwnProperty('loanAddRate1') && telegram['loanAddRate1']) {
                    output.data.loanAddRate1 = NumberUtil.toFinancial(telegram['loanAddRate1']);
                    // output.data.loanAddRate1 = telegram['loanAddRate1'];
                }
                if (telegram.hasOwnProperty('loanAddRate2') && telegram['loanAddRate2']) {
                    output.data.loanAddRate2 = NumberUtil.toFinancial(telegram['loanAddRate2']);
                    // output.data.loanAddRate2 = telegram['loanAddRate2'];
                }
                if (telegram.hasOwnProperty('CreditCardRate') && telegram['CreditCardRate']) {
                    // dd.dddd ~ dd.dddd%
                    let tmp_str = telegram['CreditCardRate'].split('~');
                    let tmp_list = [];
                    tmp_str.forEach(item => {
                        tmp_list.push(NumberUtil.toFinancial(item));
                    });
                    output.data.CreditCardRate = tmp_list.join(' ~ ') + '%';
                    // output.data.CreditCardRate = NumberUtil.toFinancial(telegram['CreditCardRate']);
                }
                if (telegram.hasOwnProperty('BaseRate') &&  telegram['BaseRate']
                    && telegram['BaseRate'].hasOwnProperty('detail') &&  telegram['BaseRate']['detail']
                    && telegram['BaseRate']['detail'].hasOwnProperty('normalFix') &&  telegram['BaseRate']['detail']['normalFix']
                ) {
                    output.data.BaseRate = NumberUtil.toFinancial(telegram['BaseRate']['detail']['normalFix']);
                }

                if (telegram.hasOwnProperty('BaseRateM') &&  telegram['BaseRateM']
                    && telegram['BaseRateM'].hasOwnProperty('detail') &&  telegram['BaseRateM']['detail']
                    && telegram['BaseRateM']['detail'].hasOwnProperty('normalFix') &&  telegram['BaseRateM']['detail']['normalFix']
                ) {
                    output.data.BaseRateM = NumberUtil.toFinancial(telegram['BaseRateM']['detail']['normalFix']);
                }
                if (telegram.hasOwnProperty('FDRate') &&  telegram['FDRate']
                    && telegram['FDRate'].hasOwnProperty('detail') &&  telegram['FDRate']['detail']
                    && telegram['FDRate']['detail'].hasOwnProperty('normalFix') &&  telegram['FDRate']['detail']['normalFix']
                ) {
                    output.data.FDRate = NumberUtil.toFinancial(telegram['FDRate']['detail']['normalFix']);
                }
                if (telegram.hasOwnProperty('FDRateM') &&  telegram['FDRateM']
                    && telegram['FDRateM'].hasOwnProperty('detail') &&  telegram['FDRateM']['detail']
                    && telegram['FDRateM']['detail'].hasOwnProperty('normalFix') &&  telegram['FDRateM']['detail']['normalFix']
                ) {
                    output.data.FDRateM = NumberUtil.toFinancial(telegram['FDRateM']['detail']['normalFix']);
                }
                if (telegram.hasOwnProperty('BaseRate2') &&  telegram['BaseRate2']
                    && telegram['BaseRate2'].hasOwnProperty('detail') &&  telegram['BaseRate2']['detail']
                    && telegram['BaseRate2']['detail'].hasOwnProperty('normalFix') &&  telegram['BaseRate2']['detail']['normalFix']
                ) {
                    output.data.BaseRate2 = NumberUtil.toFinancial(telegram['BaseRate2']['detail']['normalFix']);
                }
                if (telegram.hasOwnProperty('FDRate2') &&  telegram['FDRate2']
                    && telegram['FDRate2'].hasOwnProperty('detail') &&  telegram['FDRate2']['detail']
                    && telegram['FDRate2']['detail'].hasOwnProperty('normalFix') &&  telegram['FDRate2']['detail']['normalFix']
                ) {
                    output.data.FDRate2 = NumberUtil.toFinancial(telegram['FDRate2']['detail']['normalFix']);
                }
                output.status = true;
                output.msg = '';
                output.info_data = telegram;
                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }
}