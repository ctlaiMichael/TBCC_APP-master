import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CommonUtil } from '@shared/util/common-util';
import { DomUtil } from '@shared/util/dom-util';
/**
 * Injectable service
 * @export
 */
@Injectable()
export class LoadingSpinnerService {
    loading = {};

    /**
     * @description spinners BehaviorSubject
     */
    public spinnerSubject: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    /**
     * Creates an instance of LoadingSpinnerService.
     */
    constructor() {

    }

    /**
     * To show spinner
     * @memberof HtLoadingSpinnerService
     */
    show(key: string) {
        (<any>document).addEventListener('touchmove', this.handler, {passive: false});
        this.loading[key] = 'run';
        sessionStorage.disableNativeReturn = true; // 停用實體返回鍵(此service不可import headerCtrl service)
        this.spinnerSubject.next(true);
    }

    handler(e) {
        e.preventDefault();
    }

    /**
     * To hide spinner
     * @memberof HtLoadingSpinnerService
     */
    hide(key: string) {
        (<any>document).removeEventListener('touchmove', this.handler, {passive: true});
        delete this.loading[key];
        if (CommonUtil.isEmptyObject(this.loading)) {
            this.spinnerSubject.next(false);
            delete sessionStorage.disableNativeReturn; // 停用實體返回鍵(此service不可import headerCtrl service)
        }
    }

    /**
     * 設定section捲動
     */
    setSectionScroll(overflowY: string) {
        if (!DomUtil.isInitialPage()) {
            const sections = document.getElementsByTagName('section');
            for (let i = 0; i < sections.length; i++) {
                sections[i].style.overflowY = overflowY;
            }
        }
    }

    getMessage(): Observable<any> {
        return this.spinnerSubject.asObservable();
    }
}
