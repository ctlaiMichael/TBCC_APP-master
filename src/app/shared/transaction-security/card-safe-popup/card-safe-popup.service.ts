import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { CardSafePopUpOptions } from './card-safe-popup-options';
import { DialogConfig } from '@base/popup/dialog-config';
import { CardSafePopUpComponent } from './card-safe-popup.component';

@Injectable()
export class CardSafePopupService extends PopupBaseService<CardSafePopUpComponent> {
    defaultOptions: CardSafePopUpOptions;

    init() {
        this.defaultOptions = new CardSafePopUpOptions();
    }

    show(content?: string, options: CardSafePopUpOptions = {}): Promise<boolean> {
        const CardSafe_Judge = document.getElementsByTagName('app-CardSafe-popup');

        if (!!CardSafe_Judge && CardSafe_Judge.length > 0) {
            return Promise.reject(
                {
                    title: 'ERROR.TITLE',
                    content: '請勿重複交易'
                });
        }

        const config: DialogConfig = new DialogConfig();
        const component = this.createComponent(CardSafePopUpComponent, config);
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
