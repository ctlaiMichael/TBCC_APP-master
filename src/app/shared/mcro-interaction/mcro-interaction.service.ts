import { Injectable, Component, ComponentRef } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { DialogConfig } from '@base/popup/dialog-config';


@Injectable()
// tslint:disable-next-line: class-name
export class mcroInteractionervice extends PopupBaseService<any> {

  // defaultOptions: AlertOptions;

  init() {

  }

  // show(content: string, options: AlertOptions = {}): Promise<boolean> {
  //   const config: DialogConfig = new DialogConfig();
  //   const component = this.createComponent(AlertComponent, config);
  //   const option = { ...this.defaultOptions, ...options };
  //   component.title = option.title;
  //   component.content = content;
  //   component.btnTitle = option.btnTitle;
  //   component.promise.then(this.destroy, this.destroy);
  //   return component.promise;
  // }
}
