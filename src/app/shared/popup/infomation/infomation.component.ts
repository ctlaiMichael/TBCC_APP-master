import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-infomation',
    templateUrl: './infomation.component.html'
})
export class InfomationComponent implements OnInit {

    title?: string;     // 自定標題
    content?: string;  // 自定內容
    btnTitle?: string;  // 自定按鈕名稱
    doubleButton?: boolean; // 是否有取消按鈕
    btnCancleTitle?: string;  // 自定取消按鈕名稱
    linkList?: any; // 連結設定

    promise: Promise<any>;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.onClickEvent = () => {
                resolve();
            };
            this.onCancleEvent = () => {
                reject();
            };

        });
    }

    ngOnInit() {
        this.doubleButton = false;
    }

    onClickEvent() {
    }
    onCancleEvent() {
    }

}
