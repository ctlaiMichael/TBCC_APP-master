import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { NavgatorService } from '@core/navgator/navgator.service';
import { GoldtermsConfirmPageComponent } from '@pages/gold-business/goldterms/confirm/goldterms-confirm-page.component';
import { CheckService } from '@shared/check/check.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { GoldTermsService } from '@pages/gold-business/shared/service/gold-terms.service';

@Component({
    selector: 'app-goldterms-edit-page',
    templateUrl: 'goldterms-edit-page.component.html'
})

export class GoldtermsEditPageComponent implements OnInit {
    @Input() goldtermsInfo;
    @Output() goldtermsPage: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(GoldtermsConfirmPageComponent) goldtermsConfirm: GoldtermsConfirmPageComponent;

    titleMsg = '';
    goldTermStatus = '';
    // request
    tmpGoldtermsInfo = {
        'goldAccount': '',
        'trnsfrOutAccount': '',
        'fixAmount6': '',
        'fixAmount16': '',
        'fixAmount26': '',
        'fixFee': '',
        'fixCloseDay': '',
        'pauseCode': '',
        'pauseBeginDay': '',
        'pauseEndDay': '',
        'fixCode': '',
        'trnsToken': '',
        'USER_SAFE': '',
        'SEND_INFO': '',
        'vipFlag': '',
        'vipType': '',
        'vipFixFee': '',
        'actBeginDay': '',
        'actEndDay': '',
        'graceBeginDay': '',
        'graceEndDay': '',
        'firstGoldBuyFlag': '',
        'selectChange': '',
        'payMethod': '',
        'fixAmount6Checked': false,
        'fixAmount16Checked': false,
        'fixAmount26Checked': false,
        'org': ''
    };
    // check error
    errorMsg: any = { 'day6': '', 'day16': '', 'day26': '' };
    returnObj = {
        'pageName': 'confirm',
        'data': {}
    };
    goldAcctsList = [];   // 轉出帳號列表
    trnsfrAcctsList = []; // 轉出帳號列表
    balance = '';          // 可用餘額
    goldMenu: any;
    twMenu: any;
    // 安控傳參
    transactionObj = {
        serviceId: 'FB000711',
        categoryId: '7',
        transAccountType: '1',
    };
    tmpAmt = {
        amt6: '',
        amt16: '',
        amt26: '',
        fixFee: ''
    };
    tmpDate = {
        beg: {
            min: '',
            max: '2019-12-31',
            selected: ''
        },
        end: {
            min: '',
            max: '2019-12-31',
            selected: ''
        }
    };
    dateData = {
        year: '',
        month: '',
        date: '',
        dateformate: '',
        today: ''
    };

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private alert: AlertService
        , private navgator: NavgatorService
        , private _checkService: CheckService
        , private goldTerms: GoldTermsService
    ) { }

    ngOnInit() {
        // logger.debug('GoldtermsEditPageComponent goldtermsInfo:' + JSON.stringify(this.goldtermsInfo));
        this.prepareData();
        this._headerCtrl.setLeftBtnClick(() => {
            this.doCancel();
        });
    }

    prepareData() {
        // prepareData
        let amt6 = this.goldtermsInfo.fixAmount6.replace('.00', '');
        this.tmpAmt.amt6 = (amt6 === '0') ? '' : amt6;
        let amt16 = this.goldtermsInfo.fixAmount16.replace('.00', '');
        this.tmpAmt.amt16 = (amt16 === '0') ? '' : amt16;
        let amt26 = this.goldtermsInfo.fixAmount26.replace('.00', '');
        this.tmpAmt.amt26 = (amt26 === '0') ? '' : amt26;
        let fixFee = this.goldtermsInfo.fixFee.replace('.00', '');
        this.tmpAmt.fixFee = (fixFee === '0') ? '' : fixFee;

        this.tmpGoldtermsInfo.goldAccount = this.goldtermsInfo.goldAccount;
        this.tmpGoldtermsInfo.trnsfrOutAccount = this.goldtermsInfo.trnsfrOutAccount;
        this.tmpGoldtermsInfo.fixAmount6 = this.tmpAmt.amt6;
        this.tmpGoldtermsInfo.fixAmount16 = this.tmpAmt.amt16;
        this.tmpGoldtermsInfo.fixAmount26 = this.tmpAmt.amt26;
        this.tmpGoldtermsInfo.fixFee = this.tmpAmt.fixFee;
        this.tmpGoldtermsInfo.fixCloseDay = this.goldtermsInfo.fixCloseDay;
        this.tmpGoldtermsInfo.pauseCode = this.goldtermsInfo.pauseCode;
        this.tmpGoldtermsInfo.pauseBeginDay = this.goldtermsInfo.pauseBeginDay;
        this.tmpGoldtermsInfo.pauseEndDay = this.goldtermsInfo.pauseEndDay;
        // this.tmpGoldtermsInfo.fixCode = this.goldtermsInfo.fixCode;
        this.tmpGoldtermsInfo.vipFlag = this.goldtermsInfo.vipFlag;
        this.tmpGoldtermsInfo.vipType = this.goldtermsInfo.vipType;
        this.tmpGoldtermsInfo.vipFixFee = this.goldtermsInfo.vipFixFee;
        this.tmpGoldtermsInfo.actBeginDay = this.goldtermsInfo.actBeginDay;
        this.tmpGoldtermsInfo.actEndDay = this.goldtermsInfo.actEndDay;
        this.tmpGoldtermsInfo.graceBeginDay = this.goldtermsInfo.graceBeginDay;
        this.tmpGoldtermsInfo.graceEndDay = this.goldtermsInfo.graceEndDay;
        this.tmpGoldtermsInfo.trnsToken = this.goldtermsInfo.trnsToken;
        this.tmpGoldtermsInfo.org = this.goldtermsInfo;

        switch (this.goldtermsInfo.fixCode) {
            case '1':
                this.goldTermStatus = '未約定';
                break;
            case '2':
                switch (this.goldtermsInfo.pauseCode) {
                    case '' || null:
                        this.goldTermStatus = '正常扣款';
                        break;
                    case '1':
                        this.goldTermStatus = '暫停扣款';
                        break;
                    case '2':
                        this.goldTermStatus = '恢復扣款';
                        break;
                }
                break;
        }

        if (this.goldtermsInfo.trnsfrAcctsList.length > 0) {
            // logger.debug('this.goldtermsInfo.trnsfrAcctsList:' + JSON.stringify(this.goldtermsInfo.trnsfrAcctsList));
            this.trnsfrAcctsList = this.goldtermsInfo.trnsfrAcctsList;
            this.tmpGoldtermsInfo.trnsfrOutAccount = this.goldtermsInfo.trnsfrAcctsList[0].acctNo;
            this.balance = this.goldtermsInfo.trnsfrAcctsList[0].usefulBalance;
            this.twMenu = this.goldtermsInfo.trnsfrAcctsList[0];
        }

        // 停扣日期處理
        this.pauseMinDate();
        // 判斷是否首次購買
        (!!this.goldtermsInfo.trnsfrOutAccount) ? this.isFirstGoldBuy('N') : this.isFirstGoldBuy('Y');
    }

    // 停扣日期處理
    pauseMinDate() {
        // 起訖日init, today/today+1
        this.dateData = this.goldTerms.dateFormate('nextDay');
        this.tmpDate.beg.min = this.dateData.today;
        this.tmpDate.beg.selected = this.dateData.today;
        this.tmpDate.end.min = this.dateData.dateformate;
        this.tmpDate.end.selected = this.dateData.dateformate;
    }

    // 判斷是否首次購買
    isFirstGoldBuy(inp) {
        if (inp === 'N') {
            this.tmpGoldtermsInfo.firstGoldBuyFlag = 'N';
            this.titleMsg = 'GOLD.TERMS.TITLE_EDIT';
            this.tmpGoldtermsInfo.selectChange = '1';
        } else if (inp === 'Y') {
            this.tmpGoldtermsInfo.firstGoldBuyFlag = 'Y';
            this.titleMsg = 'GOLD.TERMS.TITLE_EDIT_FIRST';
        }
        // header title處理
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': this.titleMsg
        });
    }

    // 日期click
    dateClick(day) {
        this.errorMsg[day] = '';
        switch (day) {
            case 'day6':
                this.tmpGoldtermsInfo.fixAmount6Checked = !this.tmpGoldtermsInfo.fixAmount6Checked;
                this.tmpGoldtermsInfo.fixAmount6 = '';
                break;
            case 'day16':
                this.tmpGoldtermsInfo.fixAmount16Checked = !this.tmpGoldtermsInfo.fixAmount16Checked;
                this.tmpGoldtermsInfo.fixAmount16 = '';
                break;
            case 'day26':
                this.tmpGoldtermsInfo.fixAmount26Checked = !this.tmpGoldtermsInfo.fixAmount26Checked;
                this.tmpGoldtermsInfo.fixAmount26 = '';
                break;
        }
    }
    // 變更checked狀態
    chgFixAmountChecked(day, status) {
        // logger.debug('chgFixAmountChecked dat,status:' + day + '/' + status);
        if (day === 'day6') {
            this.tmpGoldtermsInfo.fixAmount6Checked = status;
        } else if (day === 'day16') {
            this.tmpGoldtermsInfo.fixAmount16Checked = status;
        } else if (day === 'day26') {
            this.tmpGoldtermsInfo.fixAmount26Checked = status;
        }
    }
    // 輸入金額後檢核
    amtClick(day, amt, checkType?: any) {
        // logger.debug('amtClick dat,amt:' + day + '/' + amt);
        // 未輸入金額就離開,取消checked
        if (amt === '') {
            this.chgFixAmountChecked(day, false);
            return;
        }

        // 有輸入金額時的狀態判斷
        let checkNumber = this._checkService.checkNumber(amt);
        let checkAmtResult = (!!checkNumber.status && amt >= 3000 && amt % 1000 === 0) ? true : false;
        if (checkAmtResult) {
            this.chgFixAmountChecked(day, true);
        } else {
            if (checkType === undefined || checkType !== 'noShow') {
                this.chgFixAmountChecked(day, false);
                this.errorMsg[day] = 'GOLD.TERMS.CHECK_AMOUNT_ERROR';
            }
        }
    }
    // 清除錯誤訊息
    msgClear(day) {
        // logger.debug('msgClear:' + day);
        this.errorMsg[day] = '';
        if (day === 'day6') {
            this.tmpGoldtermsInfo.fixAmount6 = '';
        } else if (day === 'day16') {
            this.tmpGoldtermsInfo.fixAmount16 = '';
        } else if (day === 'day26') {
            this.tmpGoldtermsInfo.fixAmount26 = '';
        }
    }

    onChangeTwAcct(menu: any) {
        // logger.debug('onChangeTwAcct:' + JSON.stringify(menu));
        this.trnsfrAcctsList.forEach(element => {
            // logger.debug(JSON.stringify(element));
            if (element.acctNo === menu) {
                this.balance = element.usefulBalance;
            }
        });
        // logger.debug('goldtermsInfo:' + JSON.stringify(this.goldtermsInfo));
    }

    radioChg(selectChange) {
        // 1:變更新台幣約定扣款帳號
        // 2:變更約定扣款日期及金額
        // 3:變更扣款狀態
        // logger.debug('radioChg:' + selectChange);
        this.tmpGoldtermsInfo.trnsfrOutAccount = this.goldtermsInfo.trnsfrOutAccount;
        this.tmpGoldtermsInfo.fixAmount6 = this.tmpAmt.amt6;
        this.tmpGoldtermsInfo.fixAmount16 = this.tmpAmt.amt16;
        this.tmpGoldtermsInfo.fixAmount26 = this.tmpAmt.amt26;
        this.chgFixAmountChecked('day6', (this.tmpAmt.amt6 !== '') ? true : false);
        this.chgFixAmountChecked('day16', (this.tmpAmt.amt16 !== '') ? true : false);
        this.chgFixAmountChecked('day26', (this.tmpAmt.amt26 !== '') ? true : false);
        this.tmpGoldtermsInfo.payMethod = '';
        this.tmpGoldtermsInfo.pauseBeginDay = this.goldtermsInfo.pauseBeginDay;
        this.tmpGoldtermsInfo.pauseEndDay = this.goldtermsInfo.pauseEndDay;

        if (selectChange === '1') {
            this.tmpGoldtermsInfo.trnsfrOutAccount = this.goldtermsInfo.trnsfrAcctsList[0].acctNo;
            this.balance = this.goldtermsInfo.trnsfrAcctsList[0].usefulBalance;
            this.twMenu = this.goldtermsInfo.trnsfrAcctsList[0];
        }
        if (selectChange === '2') {
            this.tmpGoldtermsInfo.fixAmount6 = '';
            this.tmpGoldtermsInfo.fixAmount16 = '';
            this.tmpGoldtermsInfo.fixAmount26 = '';
            this.chgFixAmountChecked('day6', false);
            this.chgFixAmountChecked('day16', false);
            this.chgFixAmountChecked('day26', false);
        }
    }

    // 上一步
    doCancel() {
        this.goldtermsPage.emit({
            'pageName': 'selectacct',
        });
        // const confirmOpt = new ConfirmOptions();
        // confirmOpt.btnYesTitle = 'BTN.CHECK';
        // confirmOpt.btnNoTitle = 'BTN.CANCEL';
        // confirmOpt.title = 'POPUP.CANCEL_EDIT.TITLE';
        // this.confirm.show('POPUP.CANCEL_EDIT.CONTENT', confirmOpt)
        //     .then(() => {
        //         this.navgator.popTo('gold-business');
        //     })
        //     .catch(() => { });
    }

    // 清空錯誤訊息
    clearMsg() {
        this.goldtermsInfo.goldQuantity = '';
        this.errorMsg['goldQuantity'] = '';
    }

    // 停扣日期檢核
    checkPauseDate(type) {
        // logger.debug('tmpDate:' + JSON.stringify(this.tmpDate));
        if (type === 'beg' && (this.tmpDate.beg.selected < this.tmpDate.beg.min)) {
            return this.alert.show('GOLD.TERMS.PAUSE_BEGDATE_LT_TODAY', { title: 'GOLD.TERMS.TITLE' })
                .then(() => {
                    this.pauseMinDate();
                    return;
                });
        }
        if (type === 'end' && (this.tmpDate.end.selected < this.tmpDate.end.min)) {
            return this.alert.show('GOLD.TERMS.PAUSE_ENDDATE_LT_TOMORROW', { title: 'GOLD.TERMS.TITLE' })
                .then(() => {
                    this.pauseMinDate();
                    return;
                });
        }
        if (this.tmpDate.beg.selected > this.tmpDate.end.selected) {
            return this.alert.show('GOLD.TERMS.PAUSE_ENDDATE_LE_BEGDATE', { title: 'GOLD.TERMS.TITLE' })
                .then(() => {
                    this.pauseMinDate();
                    return;
                });
        }
    }

    // 確定
    checkEvent() {
        // logger.debug('checkEvent 0:' + JSON.stringify(this.tmpGoldtermsInfo));
        if (this.tmpGoldtermsInfo.firstGoldBuyFlag === 'Y') {
            // 首次
            this.tmpGoldtermsInfo.fixCode = '1'; // 約定
            this.tmpGoldtermsInfo.pauseCode = '';
            this.tmpGoldtermsInfo.fixCloseDay = '';
            this.tmpGoldtermsInfo.fixFee = '50';
            this.tmpGoldtermsInfo.fixAmount6 = (this.tmpGoldtermsInfo.fixAmount6 === '') ? '0' : this.tmpGoldtermsInfo.fixAmount6;
            this.tmpGoldtermsInfo.fixAmount16 = (this.tmpGoldtermsInfo.fixAmount16 === '') ? '0' : this.tmpGoldtermsInfo.fixAmount16;
            this.tmpGoldtermsInfo.fixAmount26 = (this.tmpGoldtermsInfo.fixAmount26 === '') ? '0' : this.tmpGoldtermsInfo.fixAmount26;
        } else {
            // payMethod
            // 1:恢復扣款
            // 2:暫停扣款
            // 3:終止扣款
            this.tmpGoldtermsInfo.fixCloseDay = this.goldtermsInfo.fixCloseDay;
            this.tmpGoldtermsInfo.pauseBeginDay = this.goldtermsInfo.pauseBeginDay;
            this.tmpGoldtermsInfo.pauseEndDay = this.goldtermsInfo.pauseEndDay;
            if (this.tmpGoldtermsInfo.payMethod === '3') {
                // 終止扣款
                this.tmpGoldtermsInfo.fixCode = '3'; // 終止
                this.tmpGoldtermsInfo.fixAmount6 = '0';
                this.tmpGoldtermsInfo.fixAmount16 = '0';
                this.tmpGoldtermsInfo.fixAmount26 = '0';
                this.tmpGoldtermsInfo.fixFee = '0';
                this.tmpGoldtermsInfo.fixCloseDay = this.dateData.today;
            } else {
                if (this.tmpGoldtermsInfo.payMethod === '2') {
                    // 暫停扣款
                    this.tmpGoldtermsInfo.pauseBeginDay = this.tmpDate.beg.selected;
                    this.tmpGoldtermsInfo.pauseEndDay = this.tmpDate.end.selected;
                    this.tmpGoldtermsInfo.pauseCode = '1'; // 暫停扣款
                }
                if (this.tmpGoldtermsInfo.payMethod === '1') {
                    // 恢復扣款
                    this.tmpGoldtermsInfo.pauseBeginDay = '';
                    this.tmpGoldtermsInfo.pauseEndDay = '';
                }
                this.tmpGoldtermsInfo.fixCode = '2'; // 變更
                if (this.goldtermsInfo.pauseCode === '1') {
                    this.tmpGoldtermsInfo.pauseCode = '2'; // org停扣 -> new恢復
                }
            }
        }

        // logger.debug('checkEvent 1:' + JSON.stringify(this.tmpGoldtermsInfo));
        // 暫停扣款日期檢核
        if (this.tmpGoldtermsInfo.firstGoldBuyFlag === 'N' &&
            this.tmpGoldtermsInfo.payMethod === '2') {
            if (this.tmpGoldtermsInfo.pauseBeginDay === '' ||
                this.tmpGoldtermsInfo.pauseEndDay === '') {
                return this.alert.show('GOLD.TERMS.PAUSE_DATE_NO_SELECT', { title: 'GOLD.TERMS.TITLE' })
                    .then(() => { return; });
            }
        }

        // 定期定額扣款日期與金額檢核
        let amt6 = (this.tmpGoldtermsInfo.fixAmount6 === '') ? 0 : Number(this.tmpGoldtermsInfo.fixAmount6);
        let amt16 = (this.tmpGoldtermsInfo.fixAmount16 === '') ? 0 : Number(this.tmpGoldtermsInfo.fixAmount16);
        let amt26 = (this.tmpGoldtermsInfo.fixAmount26 === '') ? 0 : Number(this.tmpGoldtermsInfo.fixAmount26);
        let fixFee = (this.tmpGoldtermsInfo.fixFee === '') ? 0 : Number(this.tmpGoldtermsInfo.fixFee);
        let balance = Number(this.balance.replace('.00', ''));
        // logger.debug('amt0 6/16/26/fee:' + amt6 + '/' + amt16 + '/' + amt26 + '/' + fixFee);
        if ((this.tmpGoldtermsInfo.firstGoldBuyFlag === 'Y') ||
            (this.tmpGoldtermsInfo.firstGoldBuyFlag === 'N' && this.tmpGoldtermsInfo.selectChange !== '3')) {
            if (this.tmpGoldtermsInfo.fixAmount6Checked && amt6 === 0 ||
                this.tmpGoldtermsInfo.fixAmount16Checked && amt16 === 0 ||
                this.tmpGoldtermsInfo.fixAmount26Checked && amt26 === 0) {
                return this.alert.show('GOLD.TERMS.CHECK_AMOUNT_ERROR', { title: 'GOLD.TERMS.TITLE' })
                    .then(() => { return; });
            }

            if (this.tmpGoldtermsInfo.fixCode !== '3' && amt6 === 0 && amt16 === 0 && amt26 === 0) {
                return this.alert.show('GOLD.TERMS.NO_SELECT_DATE', { title: 'GOLD.TERMS.TITLE' })
                    .then(() => { return; });
            }

            if (this.tmpGoldtermsInfo.firstGoldBuyFlag === 'Y' && balance < (amt6 + amt16 + amt26 + fixFee)) {
                // logger.debug('balance/amt:' + balance + '/' + (amt6 + amt16 + amt26 + fixFee));
                return this.alert.show('GOLD.TERMS.NOMONEY', { title: 'GOLD.TERMS.TITLE' })
                    .then(() => { return; });
            }
        }

        if (this.tmpGoldtermsInfo.fixCode === '1' || this.tmpGoldtermsInfo.fixCode === '2') {
            if (amt6 === 0 && amt16 === 0 && amt26 === 0) {
                return this.alert.show('GOLD.TERMS.CHECK_AMOUNT_ERROR', { title: 'GOLD.TERMS.TITLE' })
                    .then(() => { return; });
            }
        }

        // 扣款狀態尚未選擇
        if (this.tmpGoldtermsInfo.selectChange === '3' && this.tmpGoldtermsInfo.payMethod === '') {
            return this.alert.show('GOLD.TERMS.NO_SELECT_PAYMETHOD', { title: 'GOLD.TERMS.TITLE' })
                .then(() => { return; });
        }

        // 安控檢核
        if (!this.tmpGoldtermsInfo.SEND_INFO['status']) {
            // error handle
            let errorObj = {
                type: 'dialog',
                content: this.tmpGoldtermsInfo.SEND_INFO['message'],
                message: this.tmpGoldtermsInfo.SEND_INFO['message']
            };
            this._handleError.handleError(errorObj);
            return;
        }

        // logger.debug('go to confirm');
        // logger.debug('tmpGoldtermsInfo:' + JSON.stringify(this.tmpGoldtermsInfo));
        this.returnObj.data = this.tmpGoldtermsInfo;
        this.goldtermsPage.emit(this.returnObj);

    }

    // 安控檢核
    securityOptionBak(e) {
        // logger.debug('securityOptionBak:' + JSON.stringify(e));
        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.tmpGoldtermsInfo.SEND_INFO = e.sendInfo;
            this.tmpGoldtermsInfo.USER_SAFE = e.sendInfo.selected;
        } else {
            // do errorHandle 錯誤處理 推業或POPUP
            // e.ERROR['type'] = 'message';
            // this._handleError.handleError(e);
            let error_obj: any = (!!e.ERROR) ? e.ERROR : e;
            error_obj['type'] = 'message';
            this._handleError.handleError(error_obj);
        }
    }


}
