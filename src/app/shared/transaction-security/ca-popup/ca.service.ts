import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { CaOptions } from './ca-options';
import { DialogConfig } from '@base/popup/dialog-config';
import { CaComponent } from './ca.component';

@Injectable()
export class CaService extends PopupBaseService<CaComponent> {
    defaultOptions: CaOptions;

    init() {
        this.defaultOptions = new CaOptions();
    }

    show(content?: string, options: CaOptions = {}): Promise<boolean> {
        const CA_Judge = document.getElementsByTagName('app-Ca');

        if (!!CA_Judge && CA_Judge.length > 0) {
            return Promise.reject(
                {
                    title: 'ERROR.TITLE',
                    content: '請勿重複交易'
                });
        }

        const config: DialogConfig = new DialogConfig();
        const component = this.createComponent(CaComponent, config);
        const option = { ...this.defaultOptions, ...options };
        component.title = option.title;
        component.content = content;
        component.transAccountType = options.transAccountType;
        component.showCaptcha = options.showCaptcha;
        component.btnYesTitle = option.btnYesTitle;
        component.btnNoTitle = option.btnNoTitle;
        component.promise.then(this.destroy, this.destroy);
        return component.promise;
    }
}
