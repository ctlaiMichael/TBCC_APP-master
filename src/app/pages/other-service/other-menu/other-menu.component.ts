/**
 * 其他服務-選單
 * (非行動網銀其他服務，而是新的其他服務，置放其他功能)
 */
import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
    selector: 'app-other-menu',
    templateUrl: './other-menu.component.html',
    styleUrls: [],
    providers: []
})
export class OtherMenuComponent implements OnInit {
    constructor(
    ) {
    }

    ngOnInit() {
    }
}
