import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { MsgOverviewService } from '../shared/service/msg-overview.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { RateInformService } from '../shared/service/rate-inform.service';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';

export interface RateInformObj {
  id: string; // 編號
  currency: string; // 幣別
  type: 'ForeignExchange' | 'TWDExchange'; // 買賣別
  exchangeType: 'PROMPT' | 'CASH'; // 種類
  condition: 'Big' | 'Small'; // 條件
  exchange: string; // 匯率
  frequency: string; // 頻率
}

@Component({
  selector: 'app-rate-inform-page',
  templateUrl: './rate-inform-page.component.html',
  styleUrls: ['./rate-inform-page.component.css']
})
export class RateInformPageComponent implements OnInit {

  rateInformList: Array<RateInformObj> = [];
  deleteSelected: Array<boolean> = [];
  showCreate = true;

  constructor(
    private navigator: NavgatorService,
    private msgOverviewService: MsgOverviewService,
    private headerCtrl: HeaderCtrlService,
    private rateInform: RateInformService,
    private _logger: Logger,
    private _handleError: HandleErrorService,
    private uiContentService: UiContentService
  ) { }

  ngOnInit() {
    // 取得到價匯率
    this.getRateInformList();
    this.headerCtrl.setLeftBtnClick(() => {
      this.cancel();
    });
  }

  createRateInform() {
    this.navigator.push('edit-rate-inform',
      {
        edit: false
      });
  }

  editRateInform(index: number) {
    this._logger.log(`editRateInform = ${JSON.stringify(this.rateInformList[index])}`);
    let frequency = this.rateInformList[index].frequency;
    frequency = frequency === '0' ? 'OnlyOnce' : frequency === '99' ? 'BusinessOnce' : frequency;
    this.rateInformList[index].frequency = frequency;
    this.navigator.push('edit-rate-inform',
      {
        edit: true,
        rateInformObj: this.rateInformList[index]
      }
    );
  }

  onDeleteItem(index) {
    this.deleteSelected[index] = !this.deleteSelected[index];
  }

  cancel() {
    let i = this.navigator.getHistoryLength() - 2;
    while (this.navigator.getHistory()[i] == 'rate-inform' || this.navigator.getHistory()[i] == 'edit-rate-inform') {
      i--;
    }
    this.navigator.push(this.navigator.getHistory()[i]);
  }

  // 確定變更
  confirm() {
    // 發送多次刪除到價通知的電文
    let errList = [];
    let deleteIdList = [];
    this.deleteSelected.forEach((deleteSelect, index) => {
      if (deleteSelect) {
        deleteIdList.push(this.rateInformList[index].id);
      }
    });
    if (deleteIdList.length == 0) {
      return;
    }
    this._logger.log(`deleteIdList = ${deleteIdList}`);
    deleteIdList.forEach((deleteId, index) => {
      this.rateInform.delRateInform(deleteId).then(res => {
        this._logger.log(`del rate inform api send ${deleteId}`)
        let tmp = this.rateInform.modify_p1000002(res);
        if (!!tmp) {
          errList.push(tmp);
        }
        if (index === deleteIdList.length - 1) {
          this._logger.log(`delete rate inform done`);
          // 有錯誤訊息
          if (errList.length > 0) {
            this._logger.error(`errList = ${errList}`);
          }
          // 跑完多個刪除到價通知API
          this.getRateInformList();
        }
      }).catch(err => {
        this._logger.error(err);
      });
    });
  }

  // 取得到價匯率
  getRateInformList() {
    this.rateInform.queryRateInform().then(res => {
      this.uiContentService.scrollTop();
      if (!!res.details && !!res.details.detail) {
        this.rateInformList = ObjectCheckUtil.modifyTransArray(res.details.detail);
        // window.scroll(0,0);
      } else {
        this.rateInformList = [];
      }
      this.resetDeleteSelected();
    }).catch(err => {
      this._handleError.handleError(err);
    });
  }

  resetDeleteSelected() {
    this.deleteSelected = new Array(this.rateInformList.length).fill(false);
  }

  public showTypeTitle(originText) {
    return this.rateInform.showTypeTitle(originText);
  }

  public showTypeRow(originText) {
    return this.rateInform.showTypeRow(originText);
  }

  public showExchangeType(originText) {
    return this.rateInform.showExchangeType(originText);
  }

  public showCondition(originText) {
    return this.rateInform.showCondition(originText);
  }
}
