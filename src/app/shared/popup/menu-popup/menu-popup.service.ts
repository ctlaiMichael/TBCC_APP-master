import { Injectable, Component, ComponentRef } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { DialogConfig } from '@base/popup/dialog-config';
import { MenuPopupComponent } from './menu-popup.component';

@Injectable()
export class MenuPopupService extends PopupBaseService<MenuPopupComponent> {

  defaultOptions = {
    title: '請選擇',
    menu: []
  };

  init() {
  }

  show(options): Promise<boolean> {
    const config: DialogConfig = new DialogConfig();
    const component = this.createComponent(MenuPopupComponent, config);
    const option = { ...this.defaultOptions, ...options };
    // console.error(option);
    component.title = option.title;
    component.menu = option.menu;

    component.promise.then(this.destroy, this.destroy);
    return component.promise;
  }
}
