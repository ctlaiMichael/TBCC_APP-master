import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { MsgOverviewService, BlockTypeObj } from '../shared/service/msg-overview.service';
import { PushService } from '@lib/plugins/push.service';
import { Logger } from '@core/system/logger/logger.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { MsgSettingsNavParam } from '../msg-overview-settings-page/msg-overview-settings-page.component';

@Component({
  selector: 'app-otp-alert-term-page',
  templateUrl: './otp-alert-term-page.component.html',
  styleUrls: ['./otp-alert-term-page.component.css']
})
export class OtpAlertTermPageComponent implements OnInit {
  blockType: BlockTypeObj;
  agreeStatement = false;
  result_btn=false;
  constructor(
    private navigator: NavgatorService,
    private msgOverviewService: MsgOverviewService,
    private push: PushService,
    private logger: Logger,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.blockType = this.msgOverviewService.getBlockType();
  }

  disagree() {
    this.navigator.push('msg-overview-settings');
  }

  agree() {
    this.push.setBlock('TCB_ACCOUNT_OTP', '0').then(res => {
      this.logger.log(`setBlock res = ${JSON.stringify(res)}`);
      let temp = this.msgOverviewService.checkPluginSuccess(res);
      if (!!temp) {
        this.alert.show(temp).then(() => {
          this.navigator.push('msg-overview-settings');
          return;
        });
      } else {
        this.blockType.OTP_PWD_ALERT = true;
        this.msgOverviewService.saveBlockType(this.blockType);
        this.result_btn=true;
      }
    });
  }
  goMenu(){
    const navParam: MsgSettingsNavParam = {
      expandAccount: true
    };
    this.navigator.push('msg-overview-settings',navParam);
  }
}
