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

@Component({
    selector: 'app-agree-terms-content',
    templateUrl: './agree-terms-content.component.html',
    styleUrls: [],

})
export class AgreeTermsContentComponent implements OnInit {
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
        content_html.push('歡迎來到合庫商業銀行，本行提供您購置自用耐久性消費品、子女教育、結婚、家庭生活支出及理財投資用途之房屋貸款。');

        content_html.push('申請條件');
        content_html.push('● 年滿20歲以上，具還款能力之自然人。');
        content_html.push('● 銀行往來信用紀錄正常。');
        content_html.push('● 提供本人所有之完整建物及其基地，並已設定首順位最高限額抵押權予本行者。');
        content_html.push('● 持有合庫網路銀行帳戶。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        content_html.push('● 憑證或OTP：尚未辦理憑證或OTP者，請先至營業單位申請憑證或OTP服務。');
        this.content = `
            <p class="inner_content">
            ` + content_html.join('<br>') + `
            </p>
        `;
    }

    checkClick() {
        // this.agreeChecked = true;
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
        // if (this.agreeChecked == true) {
        //     this.onBackPageData({}, 'bound-agree-enter');
        // } else {
        //     return false;
        // }
    }
    //點擊不同意
    notAgree() {
        // this.onBackPageData({},'bound-agree-back');
    }

    // /**
    //  * 重新設定page data
    //  * @param item
    //  */
    // onBackPageData(item, page: string) {
    //     let output = {
    //         'page': 'enter-agree',
    //         'type': 'success',
    //         'data': item,
    //     };
    //     if (page !== '') {
    //         output.page = page
    //     }
    //     logger.error("bound-agree backevent(), output.page:", output.page);
    //     this.backPageEmit.emit(output);
    // }

    // /**
    //  * 失敗回傳
    //  * @param error_obj 失敗物件
    //  */
    // onErrorBackEvent(error_obj) {
    //     let output = {
    //         'page': 'enter-agree',
    //         'type': 'error',
    //         'data': error_obj
    //     };
    //     this._logger.error('HomePage', 'gold', error_obj);
    //     this.errorPageEmit.emit(output);
    // }
}

