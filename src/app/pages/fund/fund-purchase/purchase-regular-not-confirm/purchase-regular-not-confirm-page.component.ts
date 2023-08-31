/**
 * 基金申購(定期定額)確認頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';

@Component({
    selector: 'app-purchase-regular-not-confirm',
    templateUrl: './purchase-regular-not-confirm-page.component.html',
    styleUrls: [],
    providers: []
})
export class PurchaseRegularNotConfirmPageComponent implements OnInit {
    /**
      * 參數處理
      */
    @Input() purchaseInfo: any; //fi000710 資訊,確認頁顯示用
    @Input() investAttribute: string; //客戶投資屬性 1:保守2:穩健3:積極
    @Input() fundSubject: any; //基金投資標的資訊
    @Input() serviceBranch: any; //服務分行， branchName: 服務分行名稱, unitCall: 服務分行電話, prospectus: 公開說明書取得方式，0:已取得並詳閱,1:已自行下載
    //okCode: Y:同意投資屬性低客戶購買高風險產品， N:不同意投資屬性低客戶購買高風險產品
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showContent = false;
    riskLvl = ''; //基金風險等級 ex: RR1 => 1

    // request
    userAddress = {
        'USER_SAFE': '',
        'SEND_INFO': ''
    };

    transactionObj = {
        serviceId: 'FI000710',
        categoryId: '6',
        transAccountType: '1',
    };

    securityObj = {
        'action': 'init',
        'sendInfo': {}
    };

    safeE = {};

    showBalanceLoss = '';
    showBalancePros = '';

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private _formateServcie: FormateService
        , private navgator: NavgatorService
        , private _checkSecurityService: CheckSecurityService
        , private _authService: AuthService
        , private confirm: ConfirmService
    ) {

    }

    ngOnInit() {
        this._logger.log("line 63 purchaseInfo:", this.purchaseInfo);
        this._logger.log("line 64 investAttribute:", this.investAttribute);
        this._logger.log("line 65 fundSubject:", this.fundSubject);
        this._logger.log("line 68 serviceBranch:", this.serviceBranch);
        this._checkReqData();
        //判斷基金風險屬性，塞入request用 riskLvl
        switch (this.fundSubject['risk']) {
            case 'RR1':
                this.riskLvl = '1';
                break;
            case 'RR2':
                this.riskLvl = '2';
                break;
            case 'RR3':
                this.riskLvl = '3';
                break;
            case 'RR4':
                this.riskLvl = '4';
                break;
            case 'RR5':
                this.riskLvl = '5';
                break;
        }
        let sLossCD = this._formateServcie.checkField(this.purchaseInfo, 'sLossCD');
        let sProCD = this._formateServcie.checkField(this.purchaseInfo, 'sProCD');
        let sLoss = this._formateServcie.checkField(this.purchaseInfo, 'sLoss');
        let sPro = this._formateServcie.checkField(this.purchaseInfo, 'sPro');
        //處理用於畫面顯示之停損停利值
        if (sLoss != '') {
            if (sLossCD != '-') {
                this.showBalanceLoss = '+';
            } else {
                this.showBalanceLoss = '-';
            }
            this.showBalanceLoss += sLoss;
        } else {
            this.showBalanceLoss = '--';
        }
        if (sPro != '') {
            if (sProCD != '-') {
                this.showBalancePros = '+';
            } else {
                this.showBalancePros = '-';
            }
            this.showBalancePros += sPro;
        } else {
            this.showBalancePros = '--';
        }

        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '基金定期不定額申購'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.onCancel();
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
        this._logger.log("into ssl!!!!!!");
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.userAddress.SEND_INFO
        };
    }

    //點擊取消
    onCancel() {
        this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
            title: '提醒您'
        }).then(
            () => {
                // 確定
                // this.onBackPageData({});
                this.navgator.push('fund');
            },
            () => {

            }
        );
    }
    //上一步
    onCancel1() {
        this.onBackPageData({
            page: 'confirm'
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
        this._logger.log("into stepBack function");
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
                    'enrollDate': this.purchaseInfo.enrollDate,
                    'currency': this.purchaseInfo.currency,
                    'amount': this.purchaseInfo.amount,
                    'payAcnt': this.purchaseInfo.payAcnt,
                    'effectDate': this.purchaseInfo.effectDate,
                    'baseRate': this.purchaseInfo.baseRate,
                    'favorRate': this.purchaseInfo.favorRate,
                    'serviceFee': this.purchaseInfo.serviceFee,
                    'fundType': this.serviceBranch.fundType,
                    'investAttribute': this.investAttribute,
                    'riskLvl': this.riskLvl,
                    'okCode': this.serviceBranch.okCode,
                    'prospectus': this.serviceBranch.prospectus,
                    'payDateS': this.purchaseInfo.payDateS,
                    'salesId': this.purchaseInfo.salesId,
                    'salesName': this.purchaseInfo.salesName,
                    'introId': this.purchaseInfo.introId,
                    'introName': this.purchaseInfo.introName,
                    'branchName': this.serviceBranch.branchName,
                    'unitCall': this.serviceBranch.unitCall,
                    'code': this.purchaseInfo.code,
                    'payDate31': this.purchaseInfo.payDate31,
                    'payDate5W': this.purchaseInfo.payDate5W,
                    'notiCD': this.purchaseInfo.notiCD,
                    'sLossCD': this.purchaseInfo.sLossCD,
                    'sLoss': this.purchaseInfo.sLoss,
                    'sProCD': this.purchaseInfo.sProCD,
                    'sPro': this.purchaseInfo.sPro,
                    'continue': this.purchaseInfo.continue,
                    'decline1Cd': this.purchaseInfo.decline1Cd,
                    'decline1': this.purchaseInfo.decline1,
                    'decline2Cd': this.purchaseInfo.decline2Cd,
                    'decline2': this.purchaseInfo.decline2,
                    'decline3Cd': this.purchaseInfo.decline3Cd,
                    'decline3': this.purchaseInfo.decline3,
                    'decline4Cd': this.purchaseInfo.decline4Cd,
                    'decline4': this.purchaseInfo.decline4,
                    'decline5Cd': this.purchaseInfo.decline5Cd,
                    'decline5': this.purchaseInfo.decline5,
                    'gain1Cd': this.purchaseInfo.gain1Cd,
                    'gain1': this.purchaseInfo.gain1,
                    'gain2Cd': this.purchaseInfo.gain2Cd,
                    'gain2': this.purchaseInfo.gain2,
                    'gain3Cd': this.purchaseInfo.gain3Cd,
                    'gain3': this.purchaseInfo.gain3,
                    'gain4Cd': this.purchaseInfo.gain4Cd,
                    'gain4': this.purchaseInfo.gain4,
                    'gain5Cd': this.purchaseInfo.gain5Cd,
                    'gain5': this.purchaseInfo.gain5,
                    'trnsToken': this.purchaseInfo.trnsToken
                };
                this._logger.log("line 203 e stepback:", e);
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

    private _checkReqData() {
        let check_list = ['salesId', 'salesName', 'introId', 'introName'];

        check_list.forEach(item => {
            let check_str = '';
            check_str = this._formateServcie.checkField(this.purchaseInfo, item);
            if (check_str != '') {
                check_str = this._formateServcie.transEmpty(check_str, 'all');
                if (check_str == '' || check_str== ' ') {
                    this.purchaseInfo[item] = '';
                }
            }
        });
    }
}
