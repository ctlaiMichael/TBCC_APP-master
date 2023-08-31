/**
 * 9700 洗錢防制法-客戶資訊資訊
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { DepositUtil } from '@shared/util/formate/mask/deposit-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { F1000110ApiService } from '@api/f1/f1000110/f1000110-api.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
    selector: 'app-launder-prevention',
    templateUrl: './launder-prevention.component.html',
    styleUrls: [],
    providers: [F1000110ApiService]

})
export class LaunderPreventionComponent implements OnInit {
    /**
     * 參數處理
     */
    // @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    // @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

    option1 = ['請選擇', '就業中', '退休', '家管', '學生', '待業中', '學齡前'];
    // tslint:disable-next-line:max-line-length
    option2 = ['請選擇', '軍警', '政府機關', '教育研究', '經商', '金融保險', '電子資訊工程', '建築營造', '製造業', '服務業', '醫療', '法律及會計業', '自由業', '博弈業', '珠寶貴金屬業', '武器戰爭設備', '典當民間融資', '其他：＿＿ '];
    option3 = ['請選擇', '50萬元(未逾)', '50萬以上～100萬元', '100萬以上～300萬元', '300萬以上～500萬元', '500萬以上～1000萬元', '1000萬以上～5000萬元', '5000萬以上～1億元', '1億以上～5億元', '5億以上～10億元'];

    showPage = 'edit';
    isJobOther = false;
    isDisabled = true;
    custInfo = {
        workingStatus: '0', // 工作狀態
        jobType: '0', // 職業別
        occupation: '', // 職業名稱
        annualIncome: '0', // 年收入
        companyName: '', // 公司名稱
        jobTitle: '', // 職稱
    };
    resultData: any;

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _f1000110Service: F1000110ApiService
    ) {
    }

    ngOnInit() {
        
        this.showPage = 'edit';
        this.custInfo.workingStatus = '請選擇';
        this.custInfo.jobType = '請選擇';
        this.custInfo.annualIncome = '請選擇';
    }

    statusChnage() {
        // 工作狀態 選擇就業中: 1
        
        if (this.custInfo.workingStatus == '就業中') {
            this.isDisabled = false;
        } else {
            this.isDisabled = true;
        }
    }

    jobChange() {
        // 職業別 選擇其他: 17
        this.isJobOther = false;
        for (let i = 0; i < this.option2.length; i++) {
            if (this.custInfo.jobType == this.option2[i] && i == 17) {
                this.isJobOther = true;
                this.custInfo.occupation = '';
            }
        }
        if (this.isJobOther == false) {
            this.custInfo.occupation = this.custInfo.jobType;
        }
        
    }

    agreeSend() {
        /* 工作狀態
        * f1000110 欄位
        * 調整 workingStatus:   0:退休   1:家管  2:學生   3:待業    4:就業中   5:學齡前
        *
        */
       let req_workingStatus = this.custInfo.workingStatus;
       let req_annualIncome = this.custInfo.annualIncome;
        for (let i = 0; i < this.option1.length; i++) {
            if (req_workingStatus == this.option1[i]) {
                if (i == 0) {
                    this._handleError.handleError({
                        type: 'dialog',
                        title: 'POPUP.NOTICE.TITLE',
                        content: '請選擇工作狀態'
                    });
                    return false;
                } else if (i == 1) {
                    req_workingStatus = '4';
                } else if (i == 2) {
                    req_workingStatus = '0';
                } else if (i == 3) {
                    req_workingStatus = '1';
                } else if (i == 4) {
                    req_workingStatus = '2';
                } else if (i == 5) {
                    req_workingStatus = '3';
                }
            }
        }
        for (let i = 0; i < this.option2.length; i++) {
            if (i == 0 && this.custInfo.jobType == this.option2[i]) {
                this._handleError.handleError({
                    type: 'dialog',
                    title: 'POPUP.NOTICE.TITLE',
                    content: '請選擇職業別'
                });
                return false;
            }
        }
        for (let i = 0; i < this.option3.length; i++) {
            if (req_annualIncome == this.option3[i]) {
                if (i == 0) {
                    this._handleError.handleError({
                        type: 'dialog',
                        title: 'POPUP.NOTICE.TITLE',
                        content: '請選擇年收入'
                    });
                    return false;
                } else {
                    req_annualIncome = (i - 1).toString();
                }
            }
        }
        // 職業別 選擇其他: 17
        if (this.isJobOther == false) {
            this.custInfo.occupation = this.custInfo.jobType;
        } else {
            if (this.custInfo.occupation == '' || this.custInfo.occupation == 'undefined') {
                this._handleError.handleError({
                    type: 'dialog',
                    title: 'POPUP.NOTICE.TITLE',
                    content: '請填入職業別'
                });
                return false;
            }
        }
        
        // 當工作狀態是就業中，檢查公司名稱和職稱
        // 注意: 這裡workingStatus已經改為電文送出的代號 4: 就業中
        if (req_workingStatus == '4') {
            if (this.custInfo.companyName == '') {
                this._handleError.handleError({
                    type: 'dialog',
                    title: 'POPUP.NOTICE.TITLE',
                    content: '請填入公司名稱'
                });
                return false;
            }
            if (this.custInfo.jobTitle == '') {
                this._handleError.handleError({
                    type: 'dialog',
                    title: 'POPUP.NOTICE.TITLE',
                    content: '請填入職稱'
                });
                return false;
            }
            if (this.checkRule(this.custInfo.companyName) == false || this.checkRule(this.custInfo.jobTitle) == false) {
                this._handleError.handleError({
                    type: 'dialog',
                    title: 'POPUP.NOTICE.TITLE',
                    content: '文字長度限2-26位英數字(半形)或2-13個中文字(全形)。'
                });
                return false;
            }
        } else {
            this.custInfo.companyName = '';
            this.custInfo.jobTitle = '';
        }
        let req = {
            workingStatus: req_workingStatus, // 工作狀態
            occupation: this.custInfo.occupation, // 職業名稱
            annualIncome: req_annualIncome, // 年收入
            companyName: this.custInfo.companyName, // 公司名稱
            jobTitle: this.custInfo.jobTitle // 公司名稱
        };
        
        this._f1000110Service.getData(req).then(
            (result) => {
                
                if (result.status) {
                    
                    this.resultData = result.info_data;
                    this.showPage = 'result';
                } else {
                    result['type'] = 'message';
                    this._handleError.handleError(result);
                    this._headerCtrl.updateOption({
                        'leftBtnIcon': 'menu'
                    });
                }
            },
            (errorObj) => {
                
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                this._headerCtrl.updateOption({
                    'leftBtnIcon': 'menu'
                });
            }
        );
    }

    /* 檢查英數字(1~13)、中文字(2~26)
    * 中文字: 2個字
    * 英數字: 1個字
    * 字數限個字: 26
    * */
    checkRule(str, length?) {
        let max_length = 26;
        if (length != undefined && length != '') {
            max_length = length;
        }
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 255) {
                // 英數字
                max_length -= 1;
            } else if (str.charCodeAt(i) > 255) {
                // 中文字
                max_length -= 2;
            }
            if (max_length < 0) {
                return false;
            }
        }
        return true;
    }

    clickCancel() {
        this.confirm.show('按下確定，將回到首頁', {
            title: '提醒您'
        }).then(
            () => {
                this.navgator.push('user-home');
            },
            () => {
            }
        );
    }

    // /**
    //  * 重新設定page data
    //  * @param item
    //  */
    // onBackPageData(item) {
    //     let output = {
    //         'page': 'launder-prevention',
    //         'type': 'success',
    //         'data': item,
    //     };
    //     
    //     this.backPageEmit.emit(output);
    // }

    // /**
    //  * 失敗回傳
    //  * @param error_obj 失敗物件
    //  */
    // onErrorBackEvent(error_obj) {
    //     let output = {
    //         'page': 'launder-prevention',
    //         'type': 'error',
    //         'data': error_obj
    //     };
    //     this._logger.error('HomePage', 'gold', error_obj);
    //     this.errorPageEmit.emit(output);
    // }
}

