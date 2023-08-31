import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { AutoLogoutComponent } from './auto-logout.component';
import { DialogConfig } from '@base/popup/dialog-config';

@Injectable()
export class A11yAutoLogoutService extends PopupBaseService<AutoLogoutComponent> {

  init() {
  }

  show(deadline: number): Promise<boolean> {
    const config: DialogConfig = new DialogConfig();
    const component = this.createComponent(AutoLogoutComponent, config);
    component.deadline = deadline;
    component.promise.then(this.destroy, this.destroy);
    component.start();
    return component.promise;
  }

}
