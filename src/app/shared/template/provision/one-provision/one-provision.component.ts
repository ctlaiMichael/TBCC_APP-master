/**
 * 約定條款
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ProvisionOptions } from '@base/options/provision-options';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';

@Component({
    selector: 'app-one-provision',
    templateUrl: './one-provision.component.html',
    styleUrls: [],

})
export class OneProvisionComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() provisionOption: ProvisionOptions;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    agreeChecked = false;
    showSubTitle = false;
    showInfo = false;
    showAgree = false;
    contentHtml = ''; // 內容

    title?: string;     // 自定標題
    sub_title?: string; // 子標題
    content?: string;  // 自定內容
    agree_msg?: string;  // 同意勾選文案
    agree_check?: string;  // 同意勾選檢查文案
    btnTitle?: string;  // 自定按鈕名稱
    btnCancleTitle?: string;  // 自定取消按鈕名稱
    infoData?: Array<any>;
    linkList?: any; // 連結設定

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _handleError: HandleErrorService
        , private _uiContentService: UiContentService
    ) {
    }

    ngOnInit() {
        this._uiContentService.scrollTop(); // 移到最上方
        // this._logger.step('FUND', 'this.provisionOption: ', this.provisionOption);
        this.title = this.provisionOption.title;
        this.sub_title = this.provisionOption.sub_title;
        this.content = this.provisionOption.content;
        this.agree_msg = this.provisionOption.agree_msg;
        this.agree_check = this.provisionOption.agree_check;
        this.btnTitle = this.provisionOption.btnTitle;
        this.btnCancleTitle = this.provisionOption.btnCancleTitle;
        this.infoData = this.provisionOption.infoData;
        if (this.sub_title !== '') {
            let tmp_html = [];
            tmp_html.push(this.sub_title);
            tmp_html.push(this.content);
            this.contentHtml = tmp_html.join('<br><br>');
        } else {
            this.contentHtml = this.content;
        }
        if (this.infoData.length > 0) {
            this.showInfo = true;
        }
        if (this.agree_msg != '') {
            this.showAgree = true;
        } else {
            this.agreeChecked = true;
        }
    }

    onCheckEvent() {
        // this._logger.step('FUND', 'OTP', this.agreeChecked);
        this.agreeChecked = (!this.agreeChecked) ? true : false;
        // this._logger.step('FUND', 'OTP', this.agreeChecked);
    }

    agreeSend(agree) {
        if (agree === true && !this.agreeChecked) {
            this._handleError.handleError({
                type: 'dialog',
                title: 'ERROR.INFO_TITLE',
                content: this.agree_check
            });
        } else {
            this.onBackPageData(agree);
        }
    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item) {
        let output = {
            'page': 'provision',
            'type': 'one-provision',
            'data': item,
        };
        this.backPageEmit.emit(output);
    }

}

