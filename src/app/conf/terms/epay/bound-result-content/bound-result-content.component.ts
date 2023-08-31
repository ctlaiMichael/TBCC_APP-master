/**
 * 
 * 
 * outbound 結果資訊
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-bound-result-content',
    templateUrl: './bound-result-content.component.html',
    styleUrls: [],

})
export class BoundResultContentComponent implements OnInit {
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
        content_html.push('您已完成“跨境電子支付交易“之首次交易身分確認作業！請等待3分鐘後重新掃描QRcode完成付款。');
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
    onConfirm() {
        if (this.agreeChecked == true) {
            this.onBackPageData({}, 'bound-result-enter');
        } else {
            return false;
        }
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

