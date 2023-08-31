import {Component, OnInit} from '@angular/core';
import {NavgatorService} from '@core/navgator/navgator.service';
import {branchDetail} from '@pages/location/location-search-page/locationobject';
import {HeaderCtrlService} from '@core/layout/header/header-ctrl.service';
import {TicketItem} from '@pages/take-number/shared/component/number-ticket/number-ticket.interface';

@Component({
  selector: 'app-take-number-ticket',
  templateUrl: './take-number-ticket.component.html',
  styleUrls: ['./take-number-ticket.component.css']
})
export class TakeNumberTicketComponent implements OnInit {

  selectBranchItem: branchDetail;     // 該分行資料
  ticketRecords: TicketItem[] = [];   // 票卡紀錄
  updateTime = '';                    // 更新時間
  recordSearchTerm = '';              // 紀錄查詢條件: 選擇縣市, 選擇地區

  constructor(
    private navigator: NavgatorService,
    private headerCtrl: HeaderCtrlService,
  ) {
  }

  ngOnInit() {
    this.initPage();
  }

  initPage() {
    const params = this.navigator.getParams();
    if (params[0] === 'take-number-ticket') {
      this.ticketRecords = params[1];
      this.updateTime = params[2];
      this.recordSearchTerm = params[4];
    }

    this.headerCtrl.setLeftBtnClick(() => {
      this.navigator.push('take-number', ['take-number-back', this.recordSearchTerm]);
    });
  }

  onConfirmEvent(e?) {
    if (!!e) {
      // from take-number-search
      this.navigator.push('take-number', ['take-number-back', e]);
    } else {
      // from take-number
      this.navigator.push('take-number', ['take-number-back', this.recordSearchTerm]);
    }
  }

}
