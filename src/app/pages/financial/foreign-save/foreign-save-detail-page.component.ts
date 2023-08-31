/**
 * Header
 */
import { Component, OnInit, Input,Output, Renderer2, NgZone, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-foreign-save-detail-page',
    templateUrl: './foreign-save-detail-page.component.html',
    styleUrls: [],
})
export class ForeignSaveDetailPageComponent implements OnInit {

    showData = false;
    @Input() detailData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    hasPap: boolean; // 是否有父層
    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
    ) {
        this.hasPap = false;
        // this._headerCtrl.updateOption({
        //     'leftBtnIcon': 'back',
        //     'title':this.titleName
        // });
        // this._headerCtrl.setLeftBtnClick(() => {
        //     this.onBackPageData();
        // });
    }
    ngOnInit() {
        if (this.detailData) {
            this.showData = true;
        }
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title':this.detailData.currName+this.detailData.currency
        });
          this._headerCtrl.setLeftBtnClick(() => {
            this.onBackPageData();
        });
    }
      /**
   * 重新設定page data
   * @param item 
   */
  onBackPageData() {
    this.backPageEmit.emit({});
  }






}
