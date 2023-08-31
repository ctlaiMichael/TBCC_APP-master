/**
 * 基金贖回(編輯頁1)
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FundRedeemService } from '@pages/fund/shared/service/fund-redeem.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';


@Component({
    selector: 'app-redeem-confirm',
    templateUrl: './redeem-confirm-page.component.html',
    styleUrls: [],
    providers: [FundRedeemService]
})
export class RedeemConfirmPageComponent implements OnInit {
    @Input() inputData: any;
    @Input() onTrnsType: string;
    @Input() nowToResver: boolean;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showContent = false; //顯示頁面

    // request
    userAddress = {
        'USER_SAFE': '',
        'SEND_INFO': ''
    };

    "SEND_INFO": "";
    transactionObj = {
        serviceId: 'FI000504',
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
        , private router: Router
        , private confirm: ConfirmService
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
        , private _mainService: FundRedeemService
        , private _headerCtrl: HeaderCtrlService
        , private _checkSecurityService: CheckSecurityService
        , private _authService: AuthService
    ) {
    }

    ngOnInit() {
        this._initEvent();
        // this._logger.log("line 62 inputData:", this.inputData);
        // this._logger.log("line 64 onTrnsType:", this.onTrnsType);

        // 安控變數初始化
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.userAddress.SEND_INFO
        };
    }

    private _initEvent() {
        if (this.onTrnsType == '1' && this.nowToResver == false) {
          
            this._headerCtrl.updateOption({
                'leftBtnIcon': 'back',
                'title': '基金贖回'
            });
        } else if (this.onTrnsType == '2' || this.nowToResver == true) {
            this.transactionObj = {
                serviceId: 'FI000506',
                categoryId: '6',
                transAccountType: '1',
            };
            this._headerCtrl.updateOption({
                'leftBtnIcon': 'back',
                'title': '基金贖回(預約)'
            });
        }

        this._headerCtrl.setLeftBtnClick(() => {
            // this.onBackPageData2();
            this.onCancel1();
        });
    }

    //點擊確認
    onConfirm() {
        // 安控變數設置
        // this._logger.log("into ssl!!!!!!");
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.userAddress.SEND_INFO
        };
    }
    // //點擊取消
    // onCancel() {
    //     this.onBackPageData2();
    // }

    //回上一頁
    onCancel1() {
        this.backPageEmit.emit({
            page: 'confirm',
            type: 'cancel'
        });
    }

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
        // this._logger.log("into stepBack function");
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
                    'trustAcnt': this.inputData.trustAcnt,
                    'transCode': this.inputData.transCode,
                    'fundCode': this.inputData.fundCode,
                    'investType': this.inputData.investType,
                    'currency': this.inputData.currency,
                    'inCurrency': this.inputData.inCurrency,
                    'amount': this.inputData.amount,
                    'unit': this.inputData.unit,
                    'redeemAmnt': this.inputData.redeemAmnt,
                    'enrollDate': this.inputData.enrollDate,
                    'effectDate': this.inputData.effectDate,
                    'redeemAcnt': this.inputData.redeemAcnt,
                    'redeemType': this.inputData.redeemType,
                    'redeemUnit': this.inputData.redeemUnit,
                    'trustFee': this.inputData.trustFee,
                    'isContinue': this.inputData.isContinue,
                    'trnsToken': this.inputData.trnsToken,
                    'CDSCrate': this.inputData.CDSCrate,
                    'branchName': this.inputData.branchName, // alex0520
                    'unitCall': this.inputData.unitCall,
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
     * 重新設定page data
     * @param item
     */
    onBackPageData(item, page?) {
        const output = {
            'page': 'list-item',
            'type': 'page_info',
            'data': item
        };
        // (贖回編輯頁1)點查詢
        if (page === 'redeem-edit1') {
            output.page = page;
        }
        this.backPageEmit.emit(output);
    }

    /**
     * 子層返回事件(接收)
     * @param e
     */
    onBackPage(e) {
        this._logger.step('FUND', 'onBackPage', e);
        let page = 'list';
        let pageType = 'list';
        let tmp_data: any;
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
        // this._logger.log("page:", page);
        // this._logger.log("pageType:", pageType);
        // this._logger.log("tmp_data:", tmp_data);
    }

    // /**
    //  * 失敗回傳
    //  * @param error_obj 失敗物件
    //  */
    // onErrorBackEvent(error_obj) {
    //     const output = {
    //         'page': 'list-item',
    //         'type': 'error',
    //         'data': error_obj
    //     };

    //     this.errorPageEmit.emit(output);
    // }


    // // 返回清單
    // onBackPageData2() {
    //     const output = {
    //         'page': 'redeem-confirm',
    //         'type': 'page_info',
    //         'data': ''
    //     };
    //     this.backPageEmit.emit(output);
    // }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

}