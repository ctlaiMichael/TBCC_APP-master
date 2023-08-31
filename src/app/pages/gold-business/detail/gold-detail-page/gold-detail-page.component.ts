import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { GoldDetailService } from '@pages/gold-business/shared/service/gold-detail.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { logger } from '@shared/util/log-util';

@Component({
  selector: 'app-gold-detail-page',
  templateUrl: './gold-detail-page.component.html',
  styleUrls: ['./gold-detail-page.component.css']
})
export class GoldDetailPageComponent implements OnInit {
  constructor(
    private headerCtrl: HeaderCtrlService,
    private golddetail: GoldDetailService,
    private navgator: NavgatorService,
    private handleerror: HandleErrorService
  ) { }
  objs = [{//黃金帳戶清單內容
    acctNo: '',
    usefulBalance: '',
    lastTransDay: '',
    openBranchId: '',
    openBranchIdName: ''
  }];

  currentTime: any;//查詢時間
  ngOnInit() {
    this.golddetail.getData().then(
      (res) => {
        this.currentTime = res[0];
        this.objs = res[1];
      },
      (error) => {
        logger.debug('serviceLocations info error');
        this.handleerror.handleError(error);
      }
    ).catch(getDataError => {
      logger.error(`getDataError = ${JSON.stringify(getDataError)}`);
      this.handleerror.handleError(getDataError);
    });
  }
  goList(obj) {
    this.navgator.push('goldList', obj);
  }

}
