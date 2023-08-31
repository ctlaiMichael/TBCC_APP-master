import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { AlertComponent } from '../alert/alert.component';
import { DialogConfig } from '@base/popup/dialog-config';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { ConfirmCheckBoxOptions } from './confirm-checkbox-options';
import { ConfirmCheckBoxComponent } from './confirm-checkbox.component';

@Injectable()
export class ConfirmCheckBoxService extends PopupBaseService<ConfirmCheckBoxComponent> {
    defaultOptions: ConfirmCheckBoxOptions;

    init() {
        this.defaultOptions = new ConfirmCheckBoxOptions();
    }

    show(content: string, options: ConfirmCheckBoxOptions = {}): Promise<any> {
        const config: DialogConfig = new DialogConfig();
        const component = this.createComponent(ConfirmCheckBoxComponent, config);
        const option = { ...this.defaultOptions, ...options };
        component.title = option.title;
        component.content = content;
        component.btnYesTitle = option.btnYesTitle;
        component.btnNoTitle = option.btnNoTitle;
        component.param = option.contentParam;
        component.checkbox = option.checkbox;
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


}
