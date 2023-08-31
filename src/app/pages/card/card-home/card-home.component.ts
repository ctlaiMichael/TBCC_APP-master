/**
 * 信用卡首頁
 */
import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { CardMenuService } from '@pages/card/shared/service/card-menu/card-menu.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';

@Component({
    selector: 'app-card-home',
    templateUrl: './card-home.component.html',
    styleUrls: [],
    providers: []
})
export class CardHomeComponent implements OnInit {
    /**
     * 參數處理
     */
    menuData = [];
    adImg = '';
    private adData: any;

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _mainService: CardMenuService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
    ) {
    }

    ngOnInit() {
        this.menuData = this._mainService.getMainMenu();
        this.adData = this._mainService.getAd('footer');
        if (this.adData && this.adData.hasOwnProperty('image') && this.adData['image']) {
            this.adImg = this.adData.image;
        }
    }


    /**
     * 選單事件
     * @param menu 選單
     */
    onGoEvent(menu) {
        if (typeof menu !== 'object' || !menu || !menu.hasOwnProperty('url')) {
            this._handleError.handleError({
                title: 'ERROR.TITLE',
                content: 'ERROR.DEFAULT'
            });
            return false;
        }
        this.navgator.push(menu.url);
    }

    /**
     * 廣告事件
     */
    onAdEvent() {
        const ad_line = this._formateService.checkField(this.adData, 'url');
        if (ad_line !== '') {
            this.navgator.push(ad_line);
        } else {
            this._logger.error('Card', 'miss ad', this.adData);
        }
    }


}
