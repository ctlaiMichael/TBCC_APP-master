import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { ConfirmDualContentOptions } from './confirm-dual-content-options';
import { DialogConfig } from '@base/popup/dialog-config';
import { ConfirmDualContentComponent } from './confirm-dual-content.component';

@Injectable()
export class ConfirmDualContentService extends PopupBaseService<ConfirmDualContentComponent> {
    defaultOptions: ConfirmDualContentOptions;

    init() {
        this.defaultOptions = new ConfirmDualContentOptions();
    }

    show(content: string, contentSecond: string, options: ConfirmDualContentOptions = {}): Promise<boolean> {
        const config: DialogConfig = new DialogConfig();
        const component = this.createComponent(ConfirmDualContentComponent, config);
        const option = { ...this.defaultOptions, ...options };
        component.title = option.title;
        component.content = content;
        component.btnYesTitle = option.btnYesTitle;
        component.btnNoTitle = option.btnNoTitle;
        component.param = option.contentParam;
        component.titleSecond = option.titleSecond;
        component.contentSecond = contentSecond;
        component.paramSecond = option.contentParamSecond;

        component.promise.then(this.destroy, this.destroy);
        return component.promise;
    }
}
