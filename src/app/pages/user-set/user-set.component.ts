/**
 *  個人設定 (原其他服務)
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';

@Component({
    selector: 'app-user-set',
    templateUrl: './user-set.component.html',
    styleUrls: [],
    providers: []
})
export class UserSetComponent implements OnInit {
    /**
     * 參數設定
     */
    // menuData = []; // 其他服務選單

    constructor(private _logger: Logger, private router: Router) {}

    ngOnInit() {
        // this.menuData = this.getMenu();
    }

    /**
     * go
     *
     */
    // onGoEvent(menu) {
    //     this._logger.step('otherService', 'goto', menu);
    //     if (typeof menu === 'object' && menu.hasOwnProperty('path') && menu.path !== '') {
    //         const url_params = (menu.hasOwnProperty('url_params') && typeof menu.url_params === 'object') ? menu.url_params : {};
    //         this.router.navigate([{ outlets: { primary: menu.path } }], { queryParams: url_params });

    //     } else {
    //         alert('miss menu');
    //     }
    // }



    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__| 
    // --------------------------------------------------------------------------------------------

    // private getMenu() {
    //     let output = [
    //         {
    //             name: '網路連線密碼變更', path: 'user-set/netPwdChg'
    //         }
    //         , {
    //             name: '網路連線代號變更', path: 'user-set/netCodeChg'
    //         }
    //         , {
    //             name: '通訊地址變更', path: 'user-set/addressChg'
    //         }
    //         , {
    //             name: 'E-mail變更', path: 'user-set/mailChg'
    //         }
    //         , {
    //             name: '常用帳號設定', path: 'user-set/commonAccount'
    //         }
    //         , {
    //             name: '約定轉入帳號設定', path: 'user-set/agreedAccount'
    //         }
    //         , {
    //             name: 'SSL轉帳密碼變更', path: 'user-set/sslChg'
    //         }
    //         , {
    //             name: '綜合對帳單服務', path: 'user-set/statementMenu'
    //         } 
    //         , {
    //             name: '共同行銷', path: 'user-set/commonMarket'
    //         }
    //     ];


    //     return output;
    // }

}
