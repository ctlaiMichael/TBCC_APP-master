/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { addressService } from '@pages/user-set/shared/service/address.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';

@Component({
    selector: 'app-confirm-address-page',
    templateUrl: './confirm-address-page.component.html',
    styleUrls: [],
    providers: [addressService]
})
/**
  * 網路連線密碼變更
  */
export class ConfirmAddressPageComponent implements OnInit {

    @Input() userAddress;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();  //返回上一頁
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }
    // securityResult = {};
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
            'sendInfo': this.userAddress.SEND_INFO
        }
    }
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
    /**
    * 點選確認，傳回
    */
    goResult() {

        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.userAddress.SEND_INFO
        }

    };
    stepBack(e) {
        
        if (e.status) {
            // OTP須帶入的欄位
            if (e.securityType === '3') {
                e.otpObj.depositNumber = ''; // 轉出帳號
                e.otpObj.depositMoney = ''; // 金額
                e.otpObj.OutCurr = ''; // 幣別
                e.transTypeDesc = ''; // 
            } else if (e.securityType === '2') {
                e.signText = {
                    'custId': this._authService.getUserInfo().custId,
                    'newZipCode': this.userAddress.USER_ZIPCODE,
                    'newAddress': this.userAddress.USER_ADDRESS,
                    'newTel': this.userAddress.USER_TEL
                };
            }
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    
                    // this.securityResult = S;
                    this.backPageEmit.emit({
                        type: 'goResult',
                        value: true,
                        securityResult: S
                    });
                }, (F) => {
                    // this.backPageEmit.emit({
                    //     type: 'goResult',
                    //     value: false,
                    //     securityResult: F
                    // });
                    
                }
            );
        } else {
            return false;
        }
    }
}
