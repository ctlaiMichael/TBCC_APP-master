import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { AlertComponent } from '../alert/alert.component';
import { ConfirmOptions } from './confirm-options';
import { DialogConfig } from '@base/popup/dialog-config';
import { ConfirmComponent } from './confirm.component';
import { FieldUtil } from '@shared/util/formate/modify/field-util';

@Injectable()
export class A11yConfirmService extends PopupBaseService<ConfirmComponent> {
    defaultOptions: ConfirmOptions;

    init() {
        this.defaultOptions = new ConfirmOptions();
    }

    show(content: string, options: ConfirmOptions = {}): Promise<boolean> {
        const config: DialogConfig = new DialogConfig();
        const component = this.createComponent(ConfirmComponent, config);
        const option = { ...this.defaultOptions, ...options };
        component.title = option.title;
        component.content = content;
        component.btnYesTitle = option.btnYesTitle;
        component.btnNoTitle = option.btnNoTitle;
        component.param = option.contentParam;

        component.promise.then(this.destroy, this.destroy);
        return component.promise;
    }

      /**
     * 放棄編輯
     * title 標題
     * content 內容
     */
    cancelEdit(set_obj: Object = {}): Promise<any> {
        let set_type = FieldUtil.checkField(set_obj, 'type');
        let set_title = FieldUtil.checkField(set_obj, 'title');
        let set_content = FieldUtil.checkField(set_obj, 'content');
        let msg_title = 'POPUP.CANCEL_EDIT.TITLE'; // 提醒您
        let msg_content = 'POPUP.CANCEL_EDIT.CONTENT'; // 您是否放棄此次編輯？
        if (set_type === 'trans') {
            msg_content = 'POPUP.CANCEL_ALERT.CONTENT'; // 您是否放棄此次交易？
        }

        if (set_title !== '') {
            msg_title = set_title;
        }
        if (set_content !== '') {
            msg_content = set_content;
        }

        return this.show(msg_content, {
            title: msg_title
        });
    }

    bindDevice(): Promise<any> {
        let msg_content = '您的裝置尚未啟用認證完成，使用OTP進行交易必須啟用裝置認證。如欲啟用裝置認證，請您至行動網銀裝置綁定服務進行啟用裝置認證作業。';
        let msg_title = 'ERROR.INFO_TITLE';
        return this.show(msg_content, {
            title: msg_title,
            'btnYesTitle': '立刻啟用',
            'btnNoTitle': '稍後啟用'
        });
    }
}
