import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { OtpOptions } from './otp-options';
import { DialogConfig } from '@base/popup/dialog-config';
import { OtpComponent } from './otp.component';

@Injectable()
export class OtpService extends PopupBaseService<OtpComponent> {
    defaultOptions: OtpOptions;

    init() {
        this.defaultOptions = new OtpOptions();
    }


    show(content?: string, options: OtpOptions = {}): Promise<boolean> {
        const OTP_Judge = document.getElementsByTagName('app-otp');
        if (!!OTP_Judge && OTP_Judge.length > 0) {
            return Promise.reject(
                {
                    title: 'ERROR.TITLE',
                    content: '請勿重複交易'

                });
        }

        const config: DialogConfig = new DialogConfig();
        const component = this.createComponent(OtpComponent, config);

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
        component.ignorCheckInfo = option.ignorCheckInfo;
        component.reqData = option.reqData;
        component.promise.then(this.destroy, this.destroy);
        return component.promise;
    }
}
