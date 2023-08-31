/**
 * Header
 */
import { Component, OnInit, Input, Output, Renderer2, NgZone, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
@Component({
    selector: 'app-confirm-email-page',
    templateUrl: './confirm-email-page.component.html',
    styleUrls: [],
    providers: []
})
/**
  * Email變更
  */
export class ConfirmMailPageComponent implements OnInit {

    @Input() userMail;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();  //返回上一頁

    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }
    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _checkSecurityService: CheckSecurityService
        , private _authService: AuthService
    ) { }

    ngOnInit() {
        
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '交易確認'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.userMail.SEND_INFO
        }
    };
    //跳出popup是否返回
    cancelEdit() {
        // this.confirm.show('您是否放棄此次編輯?', {
        //     title: '提醒您'
        // }).then(
        //     () => {
        //         //確定
        //         this.navgator.push('user-set');
        //     },
        //     () => {

        //     }
        // );
        this.backToEdit.emit({
            type: 'goEdit',
            value: true
        });
    };
    goResult() {

        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.userMail.SEND_INFO
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
                    'newEmail': this.userMail.NEW_MAIL,
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
