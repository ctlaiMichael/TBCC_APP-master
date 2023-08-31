import { Injectable } from '@angular/core';
import { PopupBaseService } from '@base/popup/popup-base.service';
import { CertificateOptions } from './certificate-options';
import { DialogConfig } from '@base/popup/dialog-config';
import { CertificateComponent } from './certificate.component';

@Injectable()
export class CertificateService extends PopupBaseService<CertificateComponent> {
    defaultOptions: CertificateOptions;

    init() {
        this.defaultOptions = new CertificateOptions();
    }

    show(content?: string, options: CertificateOptions = {}): Promise<boolean> {
        const config: DialogConfig = new DialogConfig();
        const component = this.createComponent(CertificateComponent, config);
        const option = { ...this.defaultOptions, ...options };
        component.title = option.title;
        component.content = content;
        component.btnYesTitle = option.btnYesTitle;
        component.btnNoTitle = option.btnNoTitle;
        component.promise.then(this.destroy, this.destroy);
        return component.promise;
    }
}
