import { Component, OnInit, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
  selector: 'app-record-result-page',
  templateUrl: './record-result-page.component.html',
  styleUrls: []
})
export class RecordResultPageComponent implements OnInit {

  @Input() dataObj;

  // 預設功能 Title
  headerObj = {
    title: 'FUNC_SUB.CARDLESS.SEARCH_CANCEL',
    style: 'result',
    leftBtnIcon: 'menu'
  };

  trnsTime: any;
  isSuccess = false;
  resultContent = '';

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private _navigator: NavgatorService,
  ) { }

  ngOnInit() {
    this._headerCtrl.setOption(this.headerObj);
    console.log('trnsTime:', this.dataObj);
    console.log('typeof trnsTime:', typeof this.dataObj);
    if (typeof this.dataObj == 'object') {
      this.isSuccess = false;
      this.resultContent = this.dataObj['hostCodeMsg'];
      console.log('this.resultContent:', this.resultContent);
    } else {
      this.isSuccess = true;
      this.trnsTime = this.dataObj;
    }
  }

  /**
   * 返回無卡提款
   * @memberof RecordResultPageComponent
   */
  backNocard() {
    this._navigator.push('nocard');
  }
}
