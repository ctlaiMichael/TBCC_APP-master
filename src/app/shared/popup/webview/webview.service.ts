import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { WebviewOptions } from './webview-options';
import { DialogConfig } from '@base/popup/dialog-config';
import { WebviewComponent } from './webview.component';

@Injectable()
export class WebviewService extends PopupBaseService<WebviewComponent> {
    defaultOptions: WebviewOptions;

    init() {
        this.defaultOptions = new WebviewOptions();
    }

    show(content: string, options: WebviewOptions = {}): Promise<boolean> {
      const config: DialogConfig = new DialogConfig();
      const component = this.createComponent(WebviewComponent, config);
      const option = { ...this.defaultOptions, ...options };
      component.title = option.title;
      component.btnYesTitle = option.btnYesTitle;
      component.btnNoTitle = option.btnNoTitle;
      component.url = content;

      component.promise.then(this.destroy, this.destroy);
      return component.promise;
    }
}
