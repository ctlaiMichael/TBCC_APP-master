import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-menu-popup',
    templateUrl: './menu-popup.component.html'
})
export class MenuPopupComponent implements OnInit {
    promise: Promise<any>;

    title?: string;     // 自定標題
    menu: Array<any> = [];


    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.onClickEvent = (item) => {
                resolve(item);
            };
            this.onCancleEvent = () => {
                reject();
            };

        });
    }

    ngOnInit() {
    }

    onClickEvent(item) {
    }
    onCancleEvent() {
    }


}
