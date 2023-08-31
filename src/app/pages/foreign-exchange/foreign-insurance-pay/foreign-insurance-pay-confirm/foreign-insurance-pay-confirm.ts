/**
 * 外幣繳保費(確認頁)
 */
import { Component, OnInit, transition, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ForeignInsurancePayService } from '../../shared/service/foreign-insurance-pay.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-foreign-insurance-pay-confirm',
    templateUrl: './foreign-insurance-pay-confirm.html',
    styleUrls: [],
    providers: [ForeignInsurancePayService]
})

export class ForeignInsurancePayConfirmComponent implements OnInit {
    nowPage = 'confirm';
    @Input() reqData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    timeLeft: number = 60;
    timeout_flag: boolean = false;//倒數=0，disable確定按鈕
    interval: any;
    result_data: any = {}; //儲存結果電文
    info_data: any = {};
    resTitle = '';
    trnsRsltCode = '';
    hostCodeMsg = '';

    // request
    userAddress = {
        'USER_SAFE': '',
        'SEND_INFO': ''
    };

    "SEND_INFO": "";
    transactionObj = {
        serviceId: 'F5000202',
        categoryId: '6',
        transAccountType: '1',
    };

    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }

    safeE = {};


    constructor(
        private _logger: Logger
        , private _checkSecurityService: CheckSecurityService
        , private _headerCtrl: HeaderCtrlService
        , private _authService: AuthService
        , private navgator: NavgatorService
        , private _mainService: ForeignInsurancePayService
        , private _handleError: HandleErrorService
        , private alert: AlertService
    ) { }

    ngOnInit() {
        //左側返回
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('foreign-exchange');
        });
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '外幣繳保費'
        });

        // 即時轉帳倒數機制
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else if (this.timeLeft === 0) {
                this.timeout_flag = true;
            } else {
                clearInterval(this.interval);
            }
        }, 1000)

        // 安控變數初始化
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.userAddress.SEND_INFO
        };
    }

    onNextPage() {
        clearInterval(this.interval);
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.userAddress.SEND_INFO
        }
    }

    // 安控函式
    securityOptionBak(e) {
        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.userAddress.SEND_INFO = e.sendInfo;
            this.userAddress.USER_SAFE = e.sendInfo.selected;
            this.securityObj = {
                'action': 'init',
                'sendInfo': e.sendInfo
            };
        } else {
            // do errorHandle 錯誤處理 推業或POPUP
            e['type'] = 'message';
            this._handleError.handleError(e.ERROR);
        }
    }

    stepBack(e) {
        if (e.status) {
            if (e.securityType === '3') {
                e.otpObj.depositNumber = ''; // 轉出帳號 
                e.otpObj.depositMoney = ''; // 金額 
                e.otpObj.OutCurr = ''; // 幣別 
                e.transTypeDesc = ''; // 
            } else if (e.securityType === '2') {
                e.signText = {
                    // 憑證 寫入簽章本文
                    'custId': this._authService.getUserInfo().custId,
                    'paymentObject': this.reqData.paymentObject,
                    'trnsfrOutAcct': this.reqData.trnsfrOutAcct,
                    'trnsfrOutCurr': this.reqData.trnsfrOutCurr,
                    'trnsfrAmount': this.reqData.trnsfrAmount,
                    'paymentNumber': this.reqData.paymentNumber,
                    'trnsToken': this.reqData.trnsToken
                };
            }
            // 統一叫service 做加密 
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    // 把S做為output傳回; 
                    // this.backPageEmit.emit({
                    //     type: 'goResult',
                    //     value: true,
                    //     securityResult: S
                    // });
                    this.safeE = {
                        securityResult: S
                    };
                    this.getResult(this.reqData, this.safeE);

                }, (F) => {
                    this.backPageEmit.emit({
                        type: 'goResult',
                        value: false,
                        securityResult: F
                    });
                }
            );
        } else {
            return false;
        }
    }

    getResult(reqData, securityResult) {
        this._mainService.getInsResult(reqData, securityResult).then(
            (result) => {
                this.result_data = result;
                this.info_data = result.info_data;
                this.resTitle = result.title;
                this.trnsRsltCode = result.trnsRsltCode;
                this.hostCodeMsg = result.hostCode;
                //電文發成功，切換結果頁
                this.nowPage = 'result';
            },
            (errorObj) => {
                this._handleError.handleError(errorObj);
                this.navgator.push('foreign-exchange');
            }
        );
    }

    /**
 * 過交易時間
 */
    confirm_notification() {
        this.navgator.push('foreign-exchange');
    }

    /**
* 子層返回事件(分頁)
* @param e
*/
    onPageBackEvent(e) {
        let page = 'list';
        let pageType = 'list';
        let tmp_data: any;
        let week_obj = [];
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('type')) {
                pageType = e.type;
            }
            if (e.hasOwnProperty('data')) {
                tmp_data = e.data;
            }
        }
    }

    /**
* 失敗回傳(分頁)
* @param error_obj 失敗物件
*/
    onErrorBackEvent(e) {
        this._logger.step('Deposit', 'onErrorBackEvent', e);
        let page = 'list';
        let pageType = 'list';
        let errorObj: any;
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('type')) {
                pageType = e.type;
            }
            if (e.hasOwnProperty('data')) {
                errorObj = e.data;
            }
        }
        // 列表頁：首次近來錯誤推頁
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
    }

}
