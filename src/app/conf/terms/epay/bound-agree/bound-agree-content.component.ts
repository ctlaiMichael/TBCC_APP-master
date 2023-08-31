/**
 * 
 * 
 * outbound 同意條款
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-bound-agree-content',
    templateUrl: './bound-agree-content.component.html',
    styleUrls: [],

})
export class BoundAgreeContentComponent implements OnInit {
    /**
     * 參數處理
     */
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    agreeChecked = false;
    content?: string;  // 自定按鈕名稱

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _handleError: HandleErrorService
    ) {
    }

    ngOnInit() {
        let content_html = [];
        content_html.push('茲因辦理跨境電子支付交易之需要，本人同意貴行向財團法人金融聯合徵信中心查詢本人之“電子支付帳戶使用者通報案件及加強身分確認註記資料(電腦代號P33)"。');
        this.content = `
            <p class="inner_content">
            ` + content_html.join('<br>') + `
            </p>
        `;
    }

    checkClick() {
        this.agreeChecked = true;
    }

    // agreeSend(agreeResult) {
    //     if (agreeResult == false) {
    //         this.onBackPageData(agreeResult);
    //     } else {
    //         if (this.agreeChecked == true) {
    //             this.onBackPageData(agreeResult);
    //         } else {
    //             this._handleError.handleError({
    //                 type: 'dialog',
    //                 title: 'POPUP.NOTICE.TITLE',
    //                 content: '未勾選已閱讀條款。'
    //             });
    //         }
    //     }
    // }

    //點擊同意
    agreeSend() {
        if (this.agreeChecked == true) {
            this.onBackPageData({}, 'bound-agree-enter');
        } else {
            return false;
        }
    }
    //點擊不同意
    notAgree() {
        this.onBackPageData({},'bound-agree-back');
    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item, page: string) {
        let output = {
            'page': 'enter-agree',
            'type': 'success',
            'data': item,
        };
        if (page !== '') {
            output.page = page
        }
        logger.error("bound-agree backevent(), output.page:", output.page);
        this.backPageEmit.emit(output);
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj) {
        let output = {
            'page': 'enter-agree',
            'type': 'error',
            'data': error_obj
        };
        this._logger.error('HomePage', 'gold', error_obj);
        this.errorPageEmit.emit(output);
    }
}

