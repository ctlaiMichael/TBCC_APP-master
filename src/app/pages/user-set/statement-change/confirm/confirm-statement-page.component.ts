/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';

@Component({
    selector: 'app-confirm-statement-page',
    templateUrl: './confirm-statement-page.component.html',
    styleUrls: [],
    providers: []
})
/**
  * 網路連線密碼變更
  */
export class ConfirmStatementPageComponent implements OnInit {



    @Input() inputContent;
    @Input() userMail;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();  //返回上一頁
	
    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _checkSecurityService: CheckSecurityService
        , private _authService: AuthService
    ) { }

    securityObj = {
        'action': 'init',
        'sendInfo': {}
    };
    ngOnInit() {
        
        this.inputContent.input_1 = this.inputContent.input_1.replace(/\*/, "");
        this.inputContent.input_2 = this.inputContent.input_2.replace(/\*/, "");
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
    }

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
                e.transTypeDesc=''; // 
            }else if (e.securityType === '2') {
                e.signText = {
                    'custId': this._authService.getUserInfo().custId,
                    'newEmail': this.userMail.NEW_MAIL,
                    'transFlag': "1"
                };
            };;
            
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    
                    // 把S做為output傳回;
					  this.backPageEmit.emit({
                        type: 'goResult',
                        value: true   ,
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
