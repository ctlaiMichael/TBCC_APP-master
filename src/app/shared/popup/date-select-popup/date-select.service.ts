import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { DialogConfig } from '@base/popup/dialog-config';
import { DateSelectComponent } from './date-select.component';
import { DateSelectOptions } from '@base/popup/date-select-options';

@Injectable()
export class DateSelectService extends PopupBaseService<DateSelectComponent> {
    defaultOptions: DateSelectOptions;

    init() {
        this.defaultOptions = new DateSelectOptions();
    }

    show(options: DateSelectOptions = {}): Promise<boolean> {
        const config: DialogConfig = new DialogConfig();
        const component = this.createComponent(DateSelectComponent, config);
        const option = { ...this.defaultOptions, ...options };
        // console.error(option);
        component.title = option.title;
        component.dateType = option.dateType;
        component.dateArr = option.dateArr;
        component.showPopupFlag = false;

        component.promise.then(this.destroy, this.destroy);
        return component.promise;
      }

}
