/**
 * email輸入欄位
 *
 * setData = {
 *      title : '欄位標題',
 *      placeholder: '欄位說明'
 * }
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { TranslateService } from '@ngx-translate/core';
import { CheckService } from '@shared/check/check.service';
import { UserCheckUtil } from '@shared/util/check/data/user-check-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';

@Component({
    selector: 'app-email-temp',
    templateUrl: './email-temp.component.html',
    styleUrls: [],

})
export class EmailTempComponent implements OnInit, OnChanges {
    /**
     * 參數處理
     */
    @Input() setData: any;
    @Input() valueStr: any;
    @Input() errorStr: any;
    @Output() backValueEmit: EventEmitter<string> = new EventEmitter<string>();
    title = 'FIELD.EMAIL'; // 電子信箱
    placeholderStr = 'FIELD.EMAIL_EDIT'; // 請輸入電子信箱
    inp_data = '';
    error_data = '';
    disabledFlag = false;
    requireFlag = false;

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _checkService: CheckService
        , private translate: TranslateService
    ) {
    }


    ngOnInit() {
        if (typeof this.valueStr === 'string' && this.valueStr !== '' && this.inp_data != this.valueStr) {
            // 避免init時資料消失
            this.inp_data = this.valueStr;
            this.onCheckEvent();
        }
        if (typeof this.setData === 'object' && this.setData) {
            if (this.setData.hasOwnProperty('require')) {
                this.requireFlag = (!!this.setData['require']) ? true : false;
            }
            if (this.setData.hasOwnProperty('title') && this.setData['title'] && this.setData['title'] !== '') {
                this.translate.get(this.setData['title']).subscribe((val) => {
                    if (this.requireFlag) {
                        this.title = '*' + val;
                    } else {
                        this.title = val;
                    }
                });
            }
            if (this.setData.hasOwnProperty('placeholder') && this.setData['placeholder'] && this.setData['placeholder'] !== '') {
                this.placeholderStr = this.setData['placeholder'];
            }
            if (this.setData.hasOwnProperty('readOnlyFlag')) {
                this.disabledFlag = (!!this.setData['readOnlyFlag']) ? true : false;
            }
            if (this.disabledFlag) {
                this.placeholderStr = ''; // disabled不顯示說明視窗
            }
        }
    }

    ngOnChanges() {
        if (typeof this.errorStr === 'string' && this.errorStr !== '' && this.error_data != this.errorStr) {
            this.error_data = this.errorStr;
        }
    }

    /**
     * 返回上一層
     * @param e data
     * @param type 類別
     */
    onBackPageData(e, type?: string) {
        if (type === 'change') {
            // change event
            this._logger.step('Email', 'change', this.inp_data);
            // 檢查密碼格式
            this.onCheckEvent();
        } else {
            // module change (focuse in)
            this._logger.step('Email', 'model change', this.inp_data);
        }
        this.backValueEmit.emit(this.inp_data);
    }

    /**
     * 資料檢查
     */
    onCheckEvent() {
        this.error_data = '';
        let do_check = false;
        // 空值檢查
        if (!ObjectCheckUtil.checkEmpty(this.inp_data, true, false)) {
            if (this.requireFlag) {
                // 顯示空值錯誤
                // 非必須輸入欄位，空值不檢核
                do_check = true;
            }
        } else {
            do_check = true; // 只要有輸入都要做檢查
        }
        if (do_check) {
            const check_data = UserCheckUtil.checkEmail(this.inp_data);
            if (!check_data.status) {
                this.error_data = check_data.msg;
                this.errorStr = check_data.msg;
            }
        }
    }

}

