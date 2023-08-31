import { Component, OnInit, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
    selector: 'app-risk-test-result',
    templateUrl: './risk-test-result.component.html'
})
export class RiskTestResultComponent implements OnInit {

    @Input() result_data: object;
    pageType = 'result';
    constructor(
        private navgator: NavgatorService
        , private _headerCtrl: HeaderCtrlService
    ) { }

    ngOnInit() {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'menu'
          });
    }
    onClick(type: string) {
        if (type == 'sendResult') {
            this.pageType = 'send_sesult';
        } else if (type == 'back') {
            this.navgator.push('fund');
        }
    }
}
