/**
 * 網銀登入密碼
 * 8~12
 * setData = {
 *      title : '欄位標題',
 *      placeholder: '欄位說明'
 * }
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { CheckService } from '@shared/check/check.service';
import { AuthCheckUtil } from '@shared/util/check/word/auth-check-util';

@Component({
    selector: 'app-login-pswd',
    templateUrl: './login-pswd.component.html',
    styleUrls: [],

})
export class LoginPswdComponent implements OnInit, OnChanges {
    /**
     * 參數處理
     */
    @Input() setData: any;
    @Input() valueStr: any;
    @Input() errorStr: any;
    @Output() backValueEmit: EventEmitter<string> = new EventEmitter<string>();
    title = 'SHARED.LOGIN.PSWD'; // 行動網銀登入密碼
    placeholderStr = 'SHARED.LOGIN.PSWD_EDIT'; // 請輸入行動網銀登入密碼
    inp_data = '';
    error_data = '';
    isa11y = false;
    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _checkService: CheckService
        , private localStorageService: LocalStorageService
    ) {
    }


    ngOnInit() {
        this.isa11y = this.localStorageService.getObj('appMode').isA11y;;
       
        if (typeof this.valueStr === 'string' && this.valueStr !== '' && this.inp_data != this.valueStr) {
            // 避免init時資料消失
            this.inp_data = this.valueStr;
            this.onCheckEvent();
        }
        if (typeof this.setData === 'object' && this.setData) {
            if (this.setData.hasOwnProperty('title') && this.setData['title'] && this.setData['title'] !== '') {
                this.title = this.setData['title'];
            }
            if (this.setData.hasOwnProperty('placeholder') && this.setData['placeholder'] && this.setData['placeholder'] !== '') {
                this.placeholderStr = this.setData['placeholder'];
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
            this._logger.step('Pswd', 'change', this.inp_data);
            // 檢查密碼格式
            this.onCheckEvent();
        } else {
            // module change (focuse in)
            this._logger.step('Pswd', 'model change', this.inp_data);
        }
        this.backValueEmit.emit(this.inp_data);
    }

    /**
     * 資料檢查
     */
    onCheckEvent() {
        this.error_data = '';
        const check_data = AuthCheckUtil.checkOldPswd(this.inp_data);
        if (!check_data.status) {
            this.error_data = check_data.msg;
            this.errorStr = check_data.msg;
        }
    }

}

