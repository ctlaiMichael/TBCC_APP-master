import { Injectable } from '@angular/core';
import { InputCertProtectPwdComponent } from './input-cert-protect-pwd.component';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { DialogConfig } from '@base/popup/dialog-config';
import { InputCertOptions } from './input-cert-protect-pwd-option';

@Injectable()
export class InputCertProtectPwdService extends PopupBaseService<InputCertProtectPwdComponent> {

  defaultOptions: InputCertOptions;

  init() {
    this.defaultOptions = new InputCertOptions();
}

  show(options: InputCertOptions = {}): Promise<string> {
    const config: DialogConfig = new DialogConfig();
    const component = this.createComponent(InputCertProtectPwdComponent, config);
    const option = { ...this.defaultOptions, ...options };
    component.title = option.title;
    component.certUpdate = option.certUpdate;
    
    component.promise.then(this.destroy, this.destroy);
    return component.promise;
  }
}
