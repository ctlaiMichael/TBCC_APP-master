/**
 * 外幣綜活存轉綜定存
 */
import { Component, OnInit, transition, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { TimeDepositTerminateService } from '../shared/service/time-deposit-terminate.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';


@Component({
    selector: 'app-time-deposit-terminate-confirm',
    templateUrl: './time-deposit-terminate-confirm-page.component.html',
    styleUrls: [],
    providers: [TimeDepositTerminateService]
})



export class TimeDepositTerminateConfirmComponent implements OnInit {
    /**
     *參數設定
     */

    @Input() receivedObj;   //f6000402.
    @Input() security;   //安控
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();  //返回上一頁
    constructor(
        private _logger: Logger
        , private _timeDepositTerminateService: TimeDepositTerminateService
        , private _checkSecurityService: CheckSecurityService
        , private _authService: AuthService
        , private _headerCtrl: HeaderCtrlService
    ) {
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
          });
    }

    ngOnInit() {
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.security.SEND_INFO
        }
    }

    //返回至確認頁面
    cancelEdit() {
        this.backToEdit.emit({
            type: 'goEdit',
            value: true
        });
    };

    onNextPage() {
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.security.SEND_INFO
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
                    'custId': this._authService.getUserInfo().custId,
                    'account': this.receivedObj.account,
                    'trnsToken': this.receivedObj.trnsToken,
                    'startDate': this.receivedObj.startDate,
                    'maturityDate': this.receivedObj.maturityDate,
                    'currencyName': this.receivedObj.currencyName,
                    'margin': this.receivedObj.margin,
                    'tax': this.receivedObj.tax,
                    'profit': this.receivedObj.profit,
                    'total': this.receivedObj.total,
                    'amount': this.receivedObj.amount,
                    'trnsfrRate': this.receivedObj.trnsfrRate,
                    'interestIncome': this.receivedObj.interestIncome,
                    'midInt': this.receivedObj.midInt,
                    'insuAmt': this.receivedObj.insuAmt,
                    'insuAmtTw': this.receivedObj.insuAmtTw,
                    'insuRate': this.receivedObj.insuRate,
                    'xsAcct': this.receivedObj.xsAcct,
                    'accountBranch': this.receivedObj.accountBranch,
                    'agentBranch': this.receivedObj.agentBranch,
                    'xfdueDate': this.receivedObj.xfdueDate,
                    'xfMmDd': this.receivedObj.xfMmDd,
                    'taxTw': this.receivedObj.taxTw,
                    'bACKINTAMT': this.receivedObj.bACKINTAMT,
                    'arcIssuDate': this.receivedObj.arcIssuDate,
                    'arcExpDate': this.receivedObj.arcExpDate,
                    'interestRate': this.receivedObj.interestRate,
                    'cancelRate': this.receivedObj.cancelRate,
                    'intTW': this.receivedObj.intTW
                };
            };
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    // 把S做為output傳回;
                    this.backPageEmit.emit({
                        type: 'goResult',
                        value: true,
                        securityResult: S
                    });
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
}
