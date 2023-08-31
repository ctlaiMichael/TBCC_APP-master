/**
 * 最新消息-選單
 */
import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
    selector: 'app-news-menu',
    templateUrl: './news-menu.component.html',
    styleUrls: [],
    providers: []
})
export class NewsMenuComponent implements OnInit {
    constructor(
    ) {
    }

    ngOnInit() {
    }
}
