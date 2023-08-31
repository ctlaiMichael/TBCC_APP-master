/**
 * 台幣綜活存轉綜定存
 */
import { Component, OnInit, transition, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FixedReleaseService } from '../shared/service/fixed-release.service';


@Component({
    selector: 'app-fixed-release-confirm',
    templateUrl: './fixed-release-confirm-page.component.html',
    styleUrls: [],
    providers: [FixedReleaseService]
})



export class FixedReleaseConfirmComponent implements OnInit {
    /**
     *參數設定
     */

    @Input() receivedObj:any;   //f6000201.
    @Input() security;   //安控
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();  //返回上一頁
    constructor(
        private _logger: Logger
        , private mainService: FixedReleaseService
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
        console.log('confirm',this.receivedObj)
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
                e.otpObj.depositNumber = this.receivedObj.fDAccNo.replace(/-/g, ''); // 轉出帳號
                e.otpObj.depositMoney = this.receivedObj.balance; // 金額
                e.otpObj.OutCurr = 'TWD'; // 幣別
                e.transTypeDesc = ''; // 
            } else if (e.securityType === '2') {
                e.signText = {
                    'custId': this._authService.getUserInfo().custId,
                    'fDAccount':this.receivedObj.fDAccNo,
                    'balance':this.receivedObj.balance,
                    'mBAccount':this.receivedObj.mBAccNo,
                    'businessType':'T',
                    'trnsToken':this.receivedObj.trnsToken,
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
