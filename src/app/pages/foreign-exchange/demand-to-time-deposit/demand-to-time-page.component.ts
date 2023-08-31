/**
 * 外幣綜活存轉綜定存
 */
import { Component, OnInit, NgModule } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { DepositInquiryService } from '@pages/deposit/shared/service/deposit-inquiry.service';
import { DemandToTimeService } from '@pages/foreign-exchange/shared/service/demand-to-time.service';
import { TwdToForeignService } from '../shared/service/twd-to-foreign.service';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ForexCurrencyLimitDeposit } from "@conf/terms/forex/currency-limit-deposit";
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AccountCheckUtil } from '@shared/util/check/data/account-check-util';
import { CheckService } from '@shared/check/check.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';

// import { AppCheckService } from '@app/lib/hitrust/framework/app_check.service';

@Component({
    selector: 'app-demand-to-time',
    templateUrl: './demand-to-time-page.component.html',
    styleUrls: [],
    providers: [
        DepositInquiryService
        , DemandToTimeService
        , InfomationService
    ]
})
export class DemandToTimePageComponent implements OnInit {
    /**
     * 參數設定
     */
    showNextPage = 'edit';

    /**
     * 下拉選單設定selectObj
     * transfrTimes 轉存期別
     * autoTransCode    續存方式
     *computeIntrstType 計息方式
     */
    selectObj = {};
    objectKeys = Object.keys;

    // 安控機制設定
    securObj = {};

    // 接收電文資料
    info_data: any = {};        //目前未用


    //f5000101傳回資訊
    trnsObj = {
        trnsAcnt: [],   //轉出帳號
        trnsCurr: []    //幣別
    };

    // 編輯頁須檢核參數
    sendObj = {
        "custId": ""
        , "trnsfrOutAccnt": ''  //綜存帳號
        , "trnsfrOutCurr": ''   //轉存幣別
        , "trnsfrOutCurrDesc": ''   //轉存幣別(中文)
        , "transfrTimes": ''    //轉存期別˙
        , "transfrTimesDesc": ''    //轉存期別(中文)
        , "autoTransCode": ''   //續存方式
        , "autoTransCodeDesc": ''   //續存方式(中文)
        , "transfrAmount": ''   //轉存金額
        , "businessType": '' //次營業日註記
        , "trnsToken": ''       //交易控制碼
        , "computeIntrstType": '' //計息方式
        , "computeIntrstTypeDesc": '' //計息方式(中文)
        , "intrstRate": '' //定存利率
        , "SEND_INFO": ""
        , "USER_SAFE": ""
    }
    errorObj = {
        "custId": ""
        , "trnsfrOutAccnt": ""
        , "trnsfrOutCurr": ""
        , "transfrTimes": ""
        , "autoTransCode": ""
        , "transfrAmount": ""
        , "businessType": ""
        , "trnsToken": ""
        , "computeIntrstType": ""
        , "intrstRate": ""
    }
    //安控
    transactionObj = {
        serviceId: 'F6000301',
        categoryId: '4',
        transAccountType: '1',
    };
    //傳至結果頁
    resultObj = {};
    disSelFlag = false;
    searchExchangeFlag = 'exchange'; //外幣存款利率hidden Flag
    constructor(
        private _logger: Logger
        , private router: Router
        // , private _mainService: DepositInquiryService
        , private _mainService: DemandToTimeService
        , private twdToForeignService: TwdToForeignService
        , private infomationService: InfomationService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private _errorCheck: CheckService
        , private systemParameterService: SystemParameterService
    ) { }

    ngOnInit() {
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
        this.gettrnsfrAccount();

        this.selectObj = this._mainService.getSelectData();    //獲取下拉選內容

    }


    /**
     * 取得綜存帳號
     */
    gettrnsfrAccount(): Promise<any> {

        return this.twdToForeignService.getData('2').then(
            (result) => {
                if (result.info_data.hasOwnProperty('businessType') && result.info_data.businessType == 'N') {
                    this._handleError.handleError({
                        type: 'message',
                        title: '',
                        content: "本交易限營業時間內始得辦理"
                    });
                }
                if (result.trnsOutAccts.length != 0) {
                    this.trnsObj.trnsAcnt = result.trnsOutAccts;    //5000101接回來之Array
                    this.sendObj.businessType = result.info_data.businessType;
                    this.sendObj.trnsToken = result.info_data.trnsToken
                } else {
                    //你未設定綜存帳號，尚無法執行本項交易，欲設定綜存帳號，請洽本行營業單位辦理
                    this._handleError.handleError({
                        type: 'message',
                        title: 'FIELD.INFO_TITLE',
                        content: "你未設定綜存帳號，尚無法執行本項交易，欲設定綜存帳號，請洽本行營業單位辦理"
                    });
                }
            }
            , (errorObj) => {
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                this.navgator.push('foreign-exchange');
            }
        );
    }

    //選擇完綜存帳號後，幣別跟著變動chgAccount

    chgCurrency() {
        if (this.sendObj.trnsfrOutAccnt == '') {
            // this.trnsObj.trnsAcnt.forEach(element => {
            //     if (element['trnsfrOutAccnt'] == this.sendObj.trnsfrOutAccnt) {
            //         this.trnsObj.trnsCurr = element['trnsOutCurr'].split(",");
            //     }
            // });
            this._handleError.handleError({
                type: 'dialog',
                title: 'ERROR.INFO_TITLE',
                content: "請先選擇轉出帳號，轉存幣別因轉出帳號的不同，有不同的設定。"
            });
        }
    };

    //轉存限制資訊
    depositInfomation() {
        const set_data = new ForexCurrencyLimitDeposit();
        this.infomationService.show(set_data);
    };
    //查詢外幣存款牌告利率
    searchExchange() {
        this.searchExchangeFlag = 'search';
    };
    //綜活存轉綜定存之優惠
    goOffer() {
        this.navgator.push('web:demandOffer', {});
        // let purchaseUse = this.systemParameterService.get('MSG_F6000301_2_URL');
        // this.navgator.push(purchaseUse);
    }
    //從金融資訊回來
    backExchange(e) {
        this.searchExchangeFlag = 'exchange';
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('foreign-exchange', {});
        });
    };
    /**
     * 檢核
     */
    onCheckEvent() {
        const check_act = AccountCheckUtil.checkActNum(this.sendObj.trnsfrOutAccnt);
        //帳號
        if (!check_act.status) {
            this.errorObj.trnsfrOutAccnt = check_act.msg;
        };

        //幣別
        if (this.sendObj.trnsfrOutCurr == '') {
            this.errorObj.trnsfrOutCurr = "未選擇轉存幣別";
        } else {
            this.errorObj.trnsfrOutCurr = "";
        };

        //轉存期別
        if (this.sendObj.transfrTimes == '') {
            this.errorObj.transfrTimes = "未選擇轉存期別";
        } else {
            this.errorObj.transfrTimes = "";
        };

        //續存方式
        if (this.sendObj.autoTransCode == '') {
            this.errorObj.autoTransCode = "未選擇續存方式";
        } else {
            this.errorObj.autoTransCode = "";
        };

        //金額檢核
        const check_money = this._mainService.checkMoney(this.sendObj.transfrAmount, this.sendObj.trnsfrOutCurrDesc);       // 轉帳金額檢核native
        if (!check_money.status) {
            this.errorObj.transfrAmount = check_money.msg;
        };
        const check_amount = this._errorCheck.checkMoney(this.sendObj.transfrAmount);             // 轉帳金額檢核
        if (!check_amount.status) {
            this.errorObj.transfrAmount = check_amount.msg;
        };


        if (check_money.status && check_amount.status) {
            this.errorObj.transfrAmount = '';
        };
        //計息方式
        if (this.sendObj.computeIntrstType == '') {
            this.errorObj.computeIntrstType = "未選擇計息方式";
        } else {
            this.errorObj.computeIntrstType = "";
        };


    }

    // 確認頁返回編輯頁

    toEditPage(e) {
        if (e) {
            this._headerCtrl.setLeftBtnClick(() => {
                this.cancelEdit();
            });
            this.showNextPage = 'edit';
        }
    }

    //跳出popup是否返回
    cancelEdit() {
        this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
            title: '提醒您'
        }).then(
            () => {
                //確定
                this.navgator.push('foreign-exchange');
            },
            () => {

            }
        );
    };


    /**
     * f6000302 外匯綜活存轉綜定存利率查詢
     */
    getRate() {
        this.onCheckEvent();
        for (let key of this.objectKeys(this.errorObj)) {
            if (this.errorObj[key].length !== 0) {
                this._handleError.handleError({
                    type: 'dialog',
                    title: '提醒您',
                    content: "輸入項目有誤，請再次確認輸入欄位。"
                });
                return;
            }

        }
        let reqObj = {
            'currency' : this.sendObj.trnsfrOutCurr
            , 'transfrTimes' : this.sendObj.transfrTimes
            , 'trnsfrOutAccnt': this.sendObj.trnsfrOutAccnt
            , 'transfrAmount': this.sendObj.transfrAmount
            , 'autoTransCode': this.sendObj.autoTransCode
            , 'computeIntrstType': this.sendObj.computeIntrstType
            };
        this._mainService.getRate(reqObj).then(
            (result) => {
                //success
                this.sendObj.intrstRate = result.rate;
                this.showNextPage = 'confirm';
            }
            , (errorObj) => {
                //error
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                return Promise.reject(errorObj);
            }
        )
    }


    onChange(checkItem) {
        switch (checkItem) {
            case 'acct':
                if (this.sendObj.trnsfrOutAccnt) {
                    this.errorObj.trnsfrOutAccnt = "";
                }
                if (this.sendObj.trnsfrOutAccnt != '') {
                    this.trnsObj.trnsAcnt.forEach(element => {
                        if (element['trnsfrOutAccnt'] == this.sendObj.trnsfrOutAccnt) {
                            this.trnsObj.trnsCurr = element['trnsOutCurr'].split(",");
                        }
                    });
                }
                this.sendObj.trnsfrOutCurr = '';
                break;
            case 'curr':
                if (this.sendObj.trnsfrOutCurr) {
                    this.errorObj.trnsfrOutCurr = "";
                }
                this.sendObj.trnsfrOutCurrDesc = this.sendObj.trnsfrOutCurr
                break;
            case 'trnsPeriod':      //續存期別

                if (this.sendObj.transfrTimes == '00' || this.sendObj.autoTransCode == '2') {
                    this.sendObj.computeIntrstType = '5';
                    this.sendObj.computeIntrstTypeDesc = '到期領息';
                    this.errorObj.computeIntrstType = '';
                    this.disSelFlag = true;
                } else {
                    this.disSelFlag = false;
                }
                this.sendObj.transfrTimesDesc = this.selectObj['transfrTimes'][this.sendObj.transfrTimes];
                break;
            case 'maturityInstruction': //續存方式

                if (this.sendObj.transfrTimes == '00' || this.sendObj.autoTransCode == '2') {
                    this.sendObj.computeIntrstType = '5';
                    this.sendObj.computeIntrstTypeDesc = '到期領息';
                    this.errorObj.computeIntrstType = '';
                    this.disSelFlag = true;
                } else {
                    this.disSelFlag = false;
                }
                this.sendObj.autoTransCodeDesc = this.selectObj['autoTransCode'][this.sendObj.autoTransCode];
                break;
            case 'transfrAmount':
                if (this.sendObj.transfrAmount && this.errorObj.transfrAmount == '') {
                    this.errorObj.transfrAmount = "";
                }
                break;

            case 'interestReceiptType': //計息方式

                this.sendObj.computeIntrstTypeDesc = this.selectObj['computeIntrstType'][this.sendObj.computeIntrstType];
                break;
        }
    }

    securityOptionBak(e) {
        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.sendObj.SEND_INFO = e.sendInfo;
            this.sendObj.USER_SAFE = e.sendInfo.selected;
        } else {
            // do errorHandle 錯誤處理 推業或POPUP
            e['type'] = 'message';
            this._handleError.handleError(e.ERROR);
        }
    }
    //結果頁
    goResult(e) {
        // this.onSend(e);
        if (e.securityResult.ERROR.status == true) {
            this.onSend(this.sendObj, e);
        } else {

        }
    };
    /**
     * 送最後電文
     */
    onSend(sendObj, security) {

        this.onCheckEvent();
        let errStatus = true;
        for (let key in this.errorObj) {
            if (this.errorObj[key] != '' && this.errorObj[key]) {
                errStatus = false;
            }
        }
        if (errStatus) {
            this._mainService.onSend(sendObj, security).then(
                (res) => {
                    if (res.hasOwnProperty('status') && res.status == true && res.hasOwnProperty('info_data')) {
                        // this.success_data = res.success_data;
                        if (res.hasOwnProperty('info_data')) {
                            this.resultObj = res.info_data;
                        };
                        this.showNextPage = 'result';
                    } else {
                        let error = {};
                        error['type'] = 'message';
                        this._handleError.handleError(error);
                    };
                },
                (errorObj) => {
                    errorObj['type'] = 'message';
                    this._handleError.handleError(errorObj);
                });
        }

    }


}


