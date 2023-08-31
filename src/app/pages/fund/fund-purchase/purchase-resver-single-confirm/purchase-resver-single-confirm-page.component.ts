/**
 * 基金申購(單筆)確認頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';

@Component({
    selector: 'app-purchase-resver-single-confirm',
    templateUrl: './purchase-resver-single-confirm-page.component.html',
    styleUrls: [],
    providers: []
})
export class PurchaseResverSingleConfirmPageComponent implements OnInit {
    /**
      * 參數處理
      */
    @Input() purchaseInfo: any; //fi000403 資訊,確認頁顯示用
    @Input() balanceData: any; //停損停利資訊
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showContent = false;

    // request
    userAddress = {
        'USER_SAFE': '',
        'SEND_INFO': ''
    };

    "SEND_INFO": "";
    transactionObj = {
        serviceId: 'FI000406',
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
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private _formateServcie: FormateService
        , private navgator: NavgatorService
        , private _checkSecurityService: CheckSecurityService
        , private _authService: AuthService
    ) {

    }

    ngOnInit() {
        //*** 停損點、停利點，需從上一頁發api回傳過來，目前沒做
        //*** 通知/出場，需從上一頁發api回傳過來，目前沒做
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '基金單筆申購(預約)'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('fund');
        });

        // 安控變數初始化
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.userAddress.SEND_INFO
        };

    }

    //點擊確認
    onConfirm() {
        // 安控變數設置
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.userAddress.SEND_INFO
        };

    }

    //點擊取消
    onCancel() {

    }

    // private changeResultPage() {

    // }

    // 安控函式
    securityOptionBak(e) {
        this._logger.log('securityOptionBak: ', e);
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
            this._logger.log(e);
            if (e.securityType === '3') {
                e.otpObj.depositNumber = ''; // 轉出帳號 
                e.otpObj.depositMoney = ''; // 金額 
                e.otpObj.OutCurr = ''; // 幣別 
                e.transTypeDesc = ''; // 
            } else if (e.securityType === '2') {
                e.signText = {
                    // 憑證 寫入簽章本文
                    'custId': this._authService.getUserInfo().custId,
                    'trustAcnt': this.purchaseInfo.trustAcnt,
                    'fundCode': this.purchaseInfo.fundCode,
                    'fundType': this.purchaseInfo.fundType,
                    'amount': this.purchaseInfo.amount,
                    'payAcnt': this.purchaseInfo.payAcnt,
                    'salesId': this.purchaseInfo.salesId,
                    'salesName': this.purchaseInfo.salesName,
                    'introId': this.purchaseInfo.introId,
                    'introName': this.purchaseInfo.introName,
                    'enrollDate': this.purchaseInfo.enrollDate,
                    'effectDate': this.purchaseInfo.effectDate,
                    'currency': this.purchaseInfo.currency,
                    'baseRate': this.purchaseInfo.baseRate,
                    'favorRate': this.purchaseInfo.favorRate,
                    'serviceFee': this.purchaseInfo.serviceFee,
                    'trnsToken': this.purchaseInfo.trnsToken,
                };
            }
            // 統一叫service 做加密 
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    this._logger.log(S);
                    // 把S做為output傳回; 
                    // this.backPageEmit.emit({
                    //     type: 'goResult',
                    //     value: true,
                    //     securityResult: S
                    // });
                    this.safeE = {
                        securityResult: S
                    };
                    this.showContent = true;
                    this._logger.log("showContent:", this.showContent);

                }, (F) => {
                    this._logger.log(F);
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

    /**
     * 子層返回事件(分頁)
     * @param e
     */
    onPageBackEvent(e) {
        this._logger.step('Deposit', 'onPageBackEvent', e);
        let page = 'list';
        let pageType = 'list';
        let tmp_data: any;
        let fundStatus: any;
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
            if (e.hasOwnProperty('fundStatus')) {
                fundStatus = e.fundStatus;
            }
        }
        this._logger.log("page:", page);
        this._logger.log("pageType:", pageType);
        this._logger.log("tmp_data:", tmp_data);
        this._logger.log("fundStatus:", fundStatus);
    }



    /**
     * 返回上一層
     * @param item
     */
    onBackPageData(item?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'purchase-tag',
            'type': 'back',
            'data': item
        };
        if (item.hasOwnProperty('page')) {
            output.page = item.page;
        }
        if (item.hasOwnProperty('type')) {
            output.type = item.type;
        }
        if (item.hasOwnProperty('data')) {
            output.data = item.data;
        }
        this.backPageEmit.emit(output);
    }

    // // --------------------------------------------------------------------------------------------
    // //  ____       _            _         _____                 _
    // //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    // //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    // //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    // //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // // --------------------------------------------------------------------------------------------

}