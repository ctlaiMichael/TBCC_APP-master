/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone, ViewChild } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
// import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';
import { GoldService } from '@pages/financial/shared/service/gold.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-gold-page',
    templateUrl: './gold-page.component.html',
    styles: [

    ],
    providers: [GoldService]
})
export class GoldPageComponent implements OnInit {

    menu_data = [];
    active_menu: any = {
        id: '',
        name: ''
    };
    btnflag = false;

    constructor(
        private _logger: Logger
        , private _mainService: GoldService
        , private navigator: NavgatorService
    ) { }

    ngOnInit() {
        this.menu_data = this._mainService.getMenuData();
        this.active_menu = this.menu_data[0];
    }





    /**
     * tab切換
     * @param menu 
     */
    onTabClick(menu) {
        this.active_menu = menu;
    }

    // 自訂查詢時隱藏btn
    onBtnflag(e) {
        this.btnflag = e;
    }

    /**
     * 買進回售轉址
     * @param type 
     */
    onGoToEvent(type) {
        this.navigator.push(type);
    }

}
