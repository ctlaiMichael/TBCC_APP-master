/**
 * 首頁使用Service
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { DepositInquiryService } from '@pages/deposit/shared/service/deposit-inquiry.service'; // 存款查詢(all)
import { GoldService } from '@pages/financial/shared/service/gold.service'; // 黃金存摺牌價
import { ExchangeService } from '@pages/financial/shared/service/exchange.service'; // 外幣匯率
import { CardBillService } from '@pages/card/shared/service/card-bill-service/card-bill.service'; // 信用卡
import { MathUtil } from '@shared/util/formate/number/math-util';
import { DateUtil } from '@shared/util/formate/date/date-util';

@Injectable()
export class UserHomeService {
    /**
     * 參數處理
     */
    private closeAssets = false;

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _depositInquiryService: DepositInquiryService
        , private _goldService: GoldService
        , private _forexRateService: ExchangeService
        , private _cardBillService: CardBillService
    ) {
    }


    /**
     * 首頁資產取得
     * 目前：以台幣資產為主
     * 12/9 不採用分次取得 > 我的金庫
     *      "f20:twnBalance" 台幣
     *      "f20:fxnBalance" 外幣摺台
     *      "f20:fundBalance" 基金折台
     *      "f20:goldBalance" 黃金折台
     *      "f20:totalAmt" 加總金額
     */
    getAssets(): Promise<any> {

        let option = {
            background: true,
            reget: false
        };
        let output: any = {
            status: false,
            close: false,
            msg: '',
            data: {
                deposit: '',
                twd: '',
                forex: '',
                fund: '',
                gold: '',
                bill: ''
            },
            error_deposit: {},
            error_bill: {},
            error_twd: {},
            error_forex: {},
            error_fund: {},
            error_gold: {}
        };
        if (this.closeAssets) {
            output.close = true;
            return Promise.resolve(output);
        }

        // 我的金庫:
        return this._depositInquiryService.getAssets(option).then(
            (resObj) => {
                this._logger.log('HomePage', 'assets data', resObj);
                if (resObj.close) {
                    output.close = true;
                } else if (typeof resObj['_modify'] == 'object' && resObj['_modify']) {
                    let checkData = resObj['_modify'];
                    output.status = checkData.status;

                    let empty_str = '- -';
                    // 總資產
                    output.data.deposit = checkData.deposit.data;
                    output.error_deposit = checkData.deposit;
                    if (!checkData.deposit.status || checkData.deposit.data == '') {
                        output.data.deposit = empty_str;
                    }
                    // 台幣
                    output.data.twd = checkData.twd.data;
                    output.error_twd = checkData.twd;
                    if (!checkData.twd.status || checkData.twd.data == '') {
                        output.data.twd = empty_str;
                    }
                    // 外幣摺台
                    output.data.forex = checkData.forex.data;
                    output.error_forex = checkData.forex;
                    if (!checkData.forex.status || checkData.forex.data == '') {
                        output.data.forex = empty_str;
                    }
                    // 基金折台
                    output.data.fund = checkData.fund.data;
                    output.error_fund = checkData.fund;
                    if (!checkData.fund.status || checkData.fund.data == '') {
                        output.data.fund = empty_str;
                    }
                    // 黃金折台
                    output.data.gold = checkData.gold.data;
                    output.error_gold = checkData.gold;
                    if (!checkData.gold.status || checkData.gold.data == '') {
                        output.data.gold = empty_str;
                    }
                }

                return Promise.resolve(output);
            },
            (errorObj) => {
                this._logger.error('HomePage', 'assets data', errorObj);
                return Promise.reject(errorObj);
            }
        );

        // return new Promise((resolve, reject) => {
        //     let output: any = {
        //         status: false,
        //         msg: '',
        //         error_deposit: {
        //             status: false, // false 無取得data
        //             data: {}
        //         },
        //         error_bill: {
        //             status: false, // false 無取得data
        //             data: {}
        //         },
        //         data: {
        //             deposit: '',
        //             bill: ''
        //         }
        //     };

        //     let finishData = {
        //         deposit: false,
        //         // 信用卡總資產關閉
        //         bill: true
        //     };
        //     const checkCallBackEvent = (check_type) => {
        //         this._logger.step('HomePage', 'close ', check_type);
        //         if (finishData.hasOwnProperty(check_type)) {
        //             finishData[check_type] = true;
        //         }
        //         let tmp_key: any;
        //         if (finishData.deposit && finishData.bill) {
        //             if (!output.error_deposit.status && !output.error_bill.status) {
        //                 // 全部取得失敗
        //                 this._logger.step('HomePage', 'end error', output);
        //                 reject(output);
        //             } else {
        //                 // 有一個資料就算成功
        //                 output.status = true;
        //                 this._logger.step('HomePage', 'end success', output);
        //                 resolve(output);
        //             }
        //         }
        //     };
        //     // 存款查詢
        //     this.getDeposit().then(
        //         (depositData) => {
        //             output.error_deposit.status = true;
        //             output.data.deposit = depositData;
        //             output.error_deposit.data = depositData;
        //             checkCallBackEvent('deposit');
        //         },
        //         (errorObj) => {
        //             output.error_deposit.status = false;
        //             output.error_deposit.data = errorObj;
        //             checkCallBackEvent('deposit');
        //         }
        //     );

        //     // 信用卡查詢: 目前關閉2019/10/01
        //     // this.getBill().then(
        //     //     (billData) => {
        //     //         output.error_bill.status = true;
        //     //         output.data.bill = billData;
        //     //         output.error_bill.data = billData;
        //     //         checkCallBackEvent('bill');
        //     //     },
        //     //     (errorObj) => {
        //     //         output.error_bill.status = false;
        //     //         output.error_bill.data = errorObj;
        //     //         checkCallBackEvent('bill');
        //     //     }
        //     // );

        // });
    }

    /**
     * 總資產查詢
     * 目前取得台幣總資產
     */
    getDeposit(): Promise<any> {
        let output = '';
        let option = {
            background: true,
            reget: false
        };

        return this._depositInquiryService.getData(1, [], option).then(
            (resObj) => {
                this._logger.log('HomePage', 'deposit data', resObj);
                let tmp_data = this._formateService.checkField(resObj['info_data'], 'totalAcctAmt');
                if (tmp_data === '') {
                    return Promise.reject(resObj);
                } else {
                    output = this._formateService.transMoney(tmp_data, 'TWD');
                    return Promise.resolve(output);
                }
            },
            (errorObj) => {
                this._logger.error('HomePage', 'deposit data', errorObj);
                return Promise.reject(errorObj);
            }
        );
    }


    /**
     * 信用卡查詢
     * 目前取得信用卡資料
     */
    getBill(): Promise<any> {
        let output = '';
        let option = {
            background: true,
            reget: false
        };

        return this._cardBillService.getData({}, option).then(
            (resObj) => {
                this._logger.log('HomePage', 'card bill data', resObj);
                output = resObj.payableAmt; // 本期應繳金額
                output = resObj.paidAmt; // 本期應繳金額
                return Promise.resolve(output);
            },
            (errorObj) => {
                this._logger.error('HomePage', 'card bill data', errorObj);
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * 信用卡
     */
    getCardBill(): Promise<any> {
        let output = {
            'dataTime': '',
            'data': {
                'allAmt': '0', // 所有額度
                'useAmt': '0', // 已用額度
                'usableAmt': '0', // 可用餘額
                'bill': '0', // 未繳金額(本期應繳金額)
                'paidAmt': '0', // 當期信用卡已繳金額
                'percent': '0', // 已用額度%
                'dateline': {
                    'date': '00',
                    'month': '00',
                    'preMonth': '',
                    'day': '00'
                }
            }
        };
        let option = {
            background: true,
            reget: false
        };
        return this._cardBillService.getData({}, option).then(
            (resObj) => {
                this._logger.log('HomePage', 'card data', resObj);
                output.data.bill = resObj.payableAmt; // 本期應繳金額
                output.data.paidAmt = resObj.paidAmt; // 當期信用卡已繳金額
                output.data.percent = MathUtil.toPercent(output.data.useAmt, output.data.allAmt).toString();
                output.dataTime = DateUtil.transDate(resObj.dataTime, 'date');
                output.data.dateline.month = resObj.currentMonth;
                output.data.dateline.preMonth = resObj.preMonth;

                return Promise.resolve(output);
            },
            (errorObj) => {
                this._logger.error('HomePage', 'card data', errorObj);
                return Promise.reject(errorObj);
            }
        );
    }



    /**
     * 外幣匯率
     */
    getForexRate(): Promise<any> {
        let output = {};
        let option = {
            background: true,
            reget: false
        };
        return this._forexRateService.getData({}, option).then(
            (resObj) => {
                this._logger.log('HomePage', 'forex rate data', resObj);
                output = resObj;
                return Promise.resolve(output);
            },
            (errorObj) => {
                this._logger.error('HomePage', 'forex rate data', errorObj);
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * 黃金存摺即時牌價
     */
    getGold(): Promise<any> {
        let output = {
            unit: '',
            data1: {
                name: '',
                sell: '',
                buy: ''
            },
            data2: []
        };
        let option = {
            background: true,
            reget: false
        };
        return this._goldService.getGoldTodayData({}, option).then(
            (resObj) => {
                this._logger.log('HomePage', 'gold data', resObj);
                output = resObj;
                return Promise.resolve(output);
            },
            (errorObj) => {
                this._logger.error('HomePage', 'gold data', errorObj);
                return Promise.reject(errorObj);
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




}


