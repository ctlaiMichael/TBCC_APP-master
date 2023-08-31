/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone, Output,EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';
@Component({
    selector: 'app-certify',
    templateUrl: './certify.component.html',
    styleUrls: [],
    providers: []
})

/**
 * 結果頁
 */

export class CertifyComponent implements OnInit {

    @Output() verify: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private _logger: Logger
        , private router: Router
    ) { }

    ngOnInit() {
    };

    onResult(){
        this.verify.emit(true);
    }
    // onBackMenu() {
    //     this.router.navigate(['otherService/menu']);
    // };
}
