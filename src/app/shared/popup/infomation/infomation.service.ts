import { Injectable, Component, ComponentRef } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { DialogConfig } from '@base/popup/dialog-config';
import { InfomationOptions } from '@base/popup/infomation-options';
import { InfomationComponent } from './infomation.component';

@Injectable()
export class InfomationService extends PopupBaseService<InfomationComponent> {

  defaultOptions: InfomationOptions;

  init() {
    this.defaultOptions = new InfomationOptions();
  }

  show(options: InfomationOptions = {}): Promise<boolean> {
    const config: DialogConfig = new DialogConfig();
    const component = this.createComponent(InfomationComponent, config);
    const option = { ...this.defaultOptions, ...options };
    // console.error(option);
    component.title = option.title;
    component.btnTitle = option.btnTitle;
    component.content = option.content;
    component.doubleButton = option.doubleButton;
    component.btnCancleTitle = option.btnCancleTitle;
    component.linkList = option.linkList;

    component.promise.then(this.destroy, this.destroy);
    return component.promise;
  }
}
