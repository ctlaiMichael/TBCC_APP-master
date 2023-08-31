import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { BlockTypeObj, MsgOverviewService } from '../shared/service/msg-overview.service';
import { Logger } from '@core/system/logger/logger.service';
import { PushService } from '@lib/plugins/push.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
  selector: 'app-fund-balance-overview-page',
  templateUrl: './fund-balance-overview-page.component.html',
  styleUrls: ['./fund-balance-overview-page.component.css']
})
export class FundBalanceOverviewPageComponent implements OnInit {
  blockType: BlockTypeObj;
  constructor(
    private navigator: NavgatorService,
    private msgOverviewService: MsgOverviewService,
    private _logger: Logger,
    private push: PushService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.blockType = this.msgOverviewService.getBlockType();
  }

  goFundBalance() {
    if (this.blockType.TCB_ALERT_FUND) {
      this.navigator.push('fund-balance-set')
    }
  }

  onFundChange() {
    this._logger.log(`this.blockType.TCB_ALERT_FUND = ${this.blockType.TCB_ALERT_FUND}}`);
    this.updateBlockType();
    let strSetBlockTarget = "TCB_ALERT_FUND";
    let strSetBlockBlockType = "";
    if (this.blockType.TCB_ALERT_FUND) {
      strSetBlockBlockType = "0";
    } else {
      strSetBlockBlockType = "3";
    }
    this.push.setBlock(strSetBlockTarget, strSetBlockBlockType).then(res => {
      this._logger.log(`setBlock res = ${JSON.stringify(res)}`);
      let temp = this.msgOverviewService.checkPluginSuccess(res);
      if (!!temp) {
        this.alert.show(temp).then(() => {
          this.blockType.TCB_ALERT_FUND = !this.blockType.TCB_ALERT_FUND;
          this.updateBlockType();
        });
      }
    })
  }

  updateBlockType() {
    this.msgOverviewService.saveBlockType(this.blockType);
  }

}
