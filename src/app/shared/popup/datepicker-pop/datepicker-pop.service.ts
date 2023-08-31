/**
 * 日歷popup
 */
import { Injectable, Component, ComponentRef } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { DialogConfig } from '@base/popup/dialog-config';
import { DatepickerPopComponent } from './datepicker-pop.component';
import { DatepickerPopOptions } from './datepicker-pop-options';

@Injectable()
export class DatepickerPopService extends PopupBaseService<DatepickerPopComponent> {

  defaultOptions: DatepickerPopOptions;

  init() {
    this.defaultOptions = new DatepickerPopOptions();
  }

  /**
   * 顯示日期選單
   * @param set_data
   *  date: 當前選擇的日期
   *  min: 最小日期
   *  max: 最大日期
   */
  show(set_data: Object): Promise<boolean> {
    let config: DialogConfig = new DialogConfig();
    config.panelClass = ['popup_content', 'no_padding'];
    const component = this.createComponent(DatepickerPopComponent, config);
    const option = { ...this.defaultOptions, ...set_data };

    if (option.date && typeof option.date === 'string') {
      component.Date_Defalult = new Date(option.date);
    } else {
      component.Date_Defalult = option.date;
    }
    if (option.min && option.min !== '') {
      component.min = option.min;
    }
    if (option.max && option.max !== '') {
      component.max = option.max;
    }
    component.popOpen(); // 執行開啟事件

    component.promise.then(this.destroy, this.destroy);
    return component.promise;
  }
}
