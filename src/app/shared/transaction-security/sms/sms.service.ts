import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { DialogConfig } from '@base/popup/dialog-config';
import { SmsComponent } from './sms.component';
import { SmsOptions } from './sms-options';
import { UserMaskUtil } from '@shared/util/formate/mask/user-mask-util';

@Injectable()
export class SmsService extends PopupBaseService<SmsComponent> {
    defaultOptions: SmsOptions;

    init() {
        this.defaultOptions = new SmsOptions();
    }


    show(content?: string, options: SmsOptions = {}): Promise<boolean> {
        const OTP_Judge = document.getElementsByTagName('app-sms');
        if (!!OTP_Judge && OTP_Judge.length > 0) {
            return Promise.reject(
                {
                    title: 'ERROR.TITLE',
                    content: '請勿重複交易'

                });
        }

        const config: DialogConfig = new DialogConfig();
        const component = this.createComponent(SmsComponent, config);

        const option = { ...this.defaultOptions, ...options };
        component.title = option.title;
        if (!content || content === '') {
            content = option.content;
        }
        component.content = content; // 目前固定取得
        component.btnYesTitle = option.btnYesTitle;
        component.btnNoTitle = option.btnNoTitle;
        component.transAccountType = option.transAccountType;
        component.showCaptcha = option.showCaptcha;
        // component.ignorCheckInfo = option.ignorCheckInfo;
        component.reqData = option.reqData;
        component.markPhone=UserMaskUtil.phone(option.reqData['phone']);
        component.promise.then(this.destroy, this.destroy);
        return component.promise;
    }
}
