/**
 * 金融資訊選單
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';

@Component({
    selector: 'app-insurance-edit',
  templateUrl: './insurance-edit-page.component.html',
    styleUrls: [],
    providers: []
})
export class InsuranceEditPageComponent implements OnInit {
    /**
     * 參數設定
     */


    constructor(
        private _logger: Logger
        , private router: Router
    ) {
        // this._logger.step('Financial', 'hi');
    }

    ngOnInit() {

    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

}
