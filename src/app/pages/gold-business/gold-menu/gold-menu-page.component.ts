/**
 * 黃金選單
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Router } from '@angular/router';
// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';

@Component({
    selector: 'app-gold-menu',
    templateUrl: './gold-menu-page.component.html',
    styleUrls: [],
    providers: []
})
export class GoldMenuPageComponent implements OnInit {
    /**
     * 參數設定
     */
    menuData = []; // 憑證服務選單
    constructor(
        // private _logger: Logger
        private router: Router
    ) {

    }

    ngOnInit() {
        this.menuData = this.getMenu();
    }

    onGoEvent(menu) {
        if (typeof menu === 'object' && menu.hasOwnProperty('path') && menu.path !== '') {
            const url_params = (menu.hasOwnProperty('url_params') && typeof menu.url_params === 'object') ? menu.url_params : {};
            this.router.navigate([{ outlets: { primary: menu.path } }], { queryParams: url_params });

        } else {
            // alert('miss menu');
        }
    }
    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    private getMenu() {

        let output = [
            {
                name: 'GOLD.SUB_TITLE.DETIAL', path: 'gold-business/transaction-detail/list' // 黃金交易明細查詢
            }
            , {
                name: 'GOLD.SUB_TITLE.QUOTATION', path: 'security/menu' // 黃金存摺牌價
            }
            , {
                name: 'GOLD.SUB_TITLE.ACTIVE', path: 'gold-business/activation/active' // 黃金存摺申請啟用
            }
            , {
                name: 'GOLD.SUB_TITLE.BUY', path: 'gold-business/buy' // 黃金買進
            }
            , {
                name: 'GOLD.SUB_TITLE.SELL', path: 'gold-business/sell' // 黃金回售
            }
            , {
                name: 'GOLD.SUB_TITLE.SYSTEMATIC_INVESTMENT_PLAN', path: 'gold-business/systematic-investment-plan' // 黃金定期定額買進變
            }
        ];
        return output;
    }

}
