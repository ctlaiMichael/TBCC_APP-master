/**
 * 外幣綜活存轉綜定存
 */
import { Component, OnInit, transition, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
    selector: 'app-demand-to-time-result',
    templateUrl: './demand-to-time-result-page.component.html',
    styleUrls: []
})



export class DemandToTimeResultPageComponent implements OnInit {
    /**
     *參數設定
     */
    @Input() resultObj;
    constructor(
        private navgator: NavgatorService
        , private _headerCtrl: HeaderCtrlService
    ) {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'menu',
            'title': '交易結果'
        });
    }

    ngOnInit() {
    };

    goMenu() {
        this.navgator.push('foreign-exchange', {});
    }
}
