import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { PatternOptions } from './pattern-options';
import { DialogConfig } from '@base/popup/dialog-config';
import { PatternComponent } from './pattern.component';

@Injectable()
export class PatternService extends PopupBaseService<PatternComponent> {
    defaultOptions: PatternOptions;

    init() {
        this.defaultOptions = new PatternOptions();
    }

    show(content?: string, options: PatternOptions = {}): Promise<boolean> {
        const Pattern_Judge = document.getElementsByTagName('app-Pattern');
        if (!!Pattern_Judge && Pattern_Judge.length > 0) {
            return Promise.reject(
                {
                    title: 'ERROR.TITLE',
                    content: '請勿重複交易'
                });
        }

        const config: DialogConfig = new DialogConfig();
        const component = this.createComponent(PatternComponent, config);
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
