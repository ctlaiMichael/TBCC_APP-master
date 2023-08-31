/**
 * 投資理財選單
 * 換約顯示機制：
 *      1. 強制引導顯示policy=1
 *      2. 此次登入狀態無記錄使用者狀態為同意還是不同意(中台若紀錄已同意，就不顯示)
 *      3. 已記錄使用者為不同意狀態，且使用者點選選單的申購等功能，提示使用者後，強制顯示換約條款
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { SUB_MENU } from '@conf/menu/sub-menu';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { IncomeNotifyService } from '@pages/fund/shared/service/income-notify.service';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { FundApplyProvision } from '@conf/terms/fund/fund-apply-provision';
import { CacheService } from '@core/system/cache/cache.service';
import { ActivatedRoute } from '@angular/router';
import { FI000712ApiService } from '@api/fi/fI000712/fi000712-api.service';
import { FI000705ApiService } from '@api/fi/fi000705/fI000705-api.service';

@Component({
    selector: 'app-fund-menu',
    templateUrl: './fund-menu.component.html',
    styleUrls: [],
    providers: [IncomeNotifyService]
})
export class FundMenuComponent implements OnInit {
    count = 0;
    menuData = []; //
    private mainMenuKey = 'fund';
    showData: boolean;
    notifyData: any;
    nowStep = '';
    // 停損獲利點設定
    incomeSetting = {
        incomePoint: 0.0, // 停損點
        profitPoint: 0.0 // 獲利點
    };

    /* 使用者不同意條款後，成功進入基金業務功能
    * accessList: 可執行的功能
    * notAccessList: 不可執行的功能
    * */
    fundList = {
        accessList: [
            'safe-check', // 風險承受度測驗
            'pay-change', // 定期不定額查詢異動
            'reserve-cancel', // 查詢預約取消基金
            'income-notify', // 停損獲利點通知
            'profit-report', // 基金投資損益報告
            'rich-profit-report', // 致富投資損益報告
            'has-realize', // 已實現損益查詢
            'fund-redeem' // 基金贖回
        ],
        notAccessList: [
            'fund-purchase', // 基金申購
            'fund-convert', // 基金轉換
            'fund-deposit-account', // 現金收益存入帳號異動
            'fund-statement', // 信託對帳單寄送方式
            'fund-balance-set' // 基金停損點設定
        ]
    };
    accessFundFlag = true; // 判斷是否有簽約註記
    agreeProvision: any; // 同意條款


    constructor(
        private _logger: Logger,
        private navgator: NavgatorService
        , private route: ActivatedRoute
        , private _formateService: FormateService
        , private _handleError: HandleErrorService
        , private _authService: AuthService
        , private alert: AlertService
        , private confirm: ConfirmService
        , private _incomeNotifyService: IncomeNotifyService
        , private _fi000705Service: FI000705ApiService
        , private _fi000712Service: FI000712ApiService
    ) { }

    ngOnInit() {
        let show_policy = false;
        this.route.queryParams.subscribe(params => {
            if (params.hasOwnProperty('policy') && !!params.policy && params.polic == '1') {
                show_policy = true;
            }
        });
        this.menuData = this.getMenu();
        this.checkAccess(show_policy); // 判斷顯示頁面
    }


    /**
     * 同意條款 - 回傳結果
     * @param e
     */
    onProvision(e) {
        this._logger.step('FUND', 'fund onProvision', e);
        let page = e.page;
        let pageType = e.type;
        let tmp_data = e.data;
        if (tmp_data === true) {
            // agree
            // 發FI000712 信託契約換約申請，成功後轉基金選單
            let req: any = {};
            this._fi000712Service.send(req).then(
                (succsObj) => {
                    if (succsObj.status) {
                        // 換約成功
                        this.setPolicyRes('1'); // 重新設定
                        this.accessFundFlag = true;
                        this.doFinish(true);
                    } else {
                        // 換約失敗
                        this.accessFundFlag = false;
                        this._handleError.handleError({
                            type: 'dialog',
                            title: 'ERROR.TITLE',
                            content: succsObj.msg
                        }).then(
                            () => {
                                this.doFinish(true);
                            }
                        );
                    }
                },
                (errorObj) => {
                    // 信託契約換約申請服務回應錯誤
                    errorObj['type'] = 'dialog';
                    this._handleError.handleError(errorObj).then(
                        () => {
                            // 異常暫不發訊息
                            this.showPolicy();
                        }
                    );
                }
            );
        } else {
            // 不同意換約
            this.setPolicyRes('0');
            this.accessFundFlag = false;
            this.doFinish(true);
        }
    }


    onGoEvent(menu) {
        if (typeof menu !== 'object' || !menu.hasOwnProperty('url')) {
            this._handleError.handleError({
                title: 'ERROR.TITLE',
                content: 'ERROR.DEFAULT'
            });
            return false;
        }

        // 檢查不可執行的功能
        let pushFlag = true;
        if (this.accessFundFlag == false) {
            this.fundList.notAccessList.forEach(item => {
                this._logger.step('FUND', 'notAccessList: ', item, menu.url);
                if (item == menu.url) {
                    pushFlag = false;
                    this._logger.step('FUND', '不可執行: ', item);
                }
            });
        }
        if (pushFlag == true) {
            this.navgator.push(menu.url);
        } else {
            // 按鈕: 我知道了
            this.alert.show('由於您未簽署「特定金錢信託投資國內外有價證券信託約定書」，僅可進行查詢交易及贖回交易', {
                title: 'ERROR.TITLE',
                btnTitle: 'BTN.HAVE_READ' // 我知道了
            }).then(
                () => {
                    // 20190617 客戶提出需求表示，盡量維持在投資理財頁面，並再次出現換約條款
                    //          需求變更請參考Excel文件: 轉置案UAT問題追蹤表@20190617.xls，問題編號221
                    this.showPolicy();
                }
            );
        }
    }

    /**
     * 停損停利通知取得
     */
    checkIncomeNotify() {
        // isfundIncomeNotified: 紀錄停損停利是否已經通知過了
        let isfundIncomeNotified = this._authService.getTmpInfo('isfundIncomeNotified');
        // this._logger.step('FUND', 'checkIncomeNotify', isfundIncomeNotified);
        if (!isfundIncomeNotified || isfundIncomeNotified == '') {
            this._authService.updateTmpInfo({ 'isfundIncomeNotified': '1' });
            // this._logger.step('FUND', '取得通知資料');
            let page = 1;
            const reqData = {};
            this._incomeNotifyService.checkNotify();
        } else {
            // this._logger.step('FUND', '第二次進來');
        }
    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__| PART_BOX: private
    // --------------------------------------------------------------------------------------------

    private getMenu() {
        let output: Array<any> = [];
        if (SUB_MENU.hasOwnProperty(this.mainMenuKey)) {
            const menuSet = this._formateService.transClone(SUB_MENU[this.mainMenuKey]);
            output = menuSet.data;
            this.showData = true;

        } else {
            this.showData = false;
            this._handleError.handleError({
                type: 'message',
                title: 'ERROR.TITLE',
                content: 'ERROR.DEFAULT'
            });
        }
        return output;
    }

    /**
     * 判斷顯示頁面
     * @param show_policy
     */
    private checkAccess(show_policy: boolean) {
        let fundAgreeFlag = this._authService.getTmpInfo('fundAgreeFlag', 'string');
        this.accessFundFlag = (fundAgreeFlag == '1') ? true : false;
        let do_policy = false;
        if (show_policy) {
            // 強制顯示
            do_policy = true;
        } else if (fundAgreeFlag == '') {
            // 沒有值強制顯示(若使用者不同意，仍顯示選單，除非執行申購，強制要求執行showPolicy)
            do_policy = true;
        }
        this._logger.step('FUND', 'do/show/accflag/agreestr', do_policy, show_policy, this.accessFundFlag, fundAgreeFlag);
        if (do_policy) {
            // 未簽訂
            this.showPolicy();
        } else {
            this.doFinish(true);
        }
    }

    private showPolicy() {
        this.setPolicyRes(''); // 重新設定
        if (this.nowStep != 'agree') {
            this.agreeProvision = new FundApplyProvision();
            this.nowStep = 'agree';
        }
    }

    /**
     * 執行結果畫面
     */
    private doFinish(doNotify?: boolean) {
        this.nowStep = 'showMenu';
        //投資理財導頁
        if (doNotify !== false) {
            // 檢查停損獲利點是否通知
            this.checkIncomeNotify();
        }
        let params = this.navgator.getParams();
        if (typeof params === 'object' && params != null) {
            if (params.hasOwnProperty('path')) {
                this.navgator.push(params.path, params);
            }
        }
    }

    /**
     * 設定暫存換約狀態
     * @param val
     */
    private setPolicyRes(val: string) {
        this._authService.updateTmpInfo({ fundAgreeFlag: val }); // 重新設定
    }


}
