/**
 * 外幣綜活存轉綜定存
 */
import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';


@Component({
  selector: 'app-info-check',
  templateUrl: './info-check-page.component.html',
  styleUrls: [],
  providers: []
})
export class InfoCheckPageComponent implements OnInit {
  /**
   * 參數設定
   */
  @Input() data;
  showNextPage = false;
  // popup參數


  constructor(
    private _logger: Logger
    , private router: Router
    , private _headerCtrl: HeaderCtrlService
    , private confirm: ConfirmService
    , private navgator: NavgatorService
  ) {

  }

  ngOnInit() {
    this._headerCtrl.setLeftBtnClick(() => {
      this.cancelEdit();
  });
  }
  //跳出popup是否返回
  cancelEdit() {
    this.confirm.show('您是否放棄此次編輯?', {
        title: '提醒您'
    }).then(
        () => {
            //確定
            this.navgator.push('credit');
        },
        () => {

        }
    );
};
  /**
   * go
   *
   */

  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

  onNextPage() {
    this.showNextPage=true;
  };


}


