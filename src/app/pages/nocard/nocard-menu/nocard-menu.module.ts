import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { NocardMenuRoutingModule } from "./nocard-menu-routing.module";
import { NocardMenuComponent } from "./nocard-menu-page.component";

import { FN000101ReqBody } from '@api/fn/fn000101/fn000101-req';
import { FN000101ApiService } from '@api/fn/fn000101/fn000101-api.service';
import { FN000102ReqBody } from '@api/fn/fn000102/fn000102-req';
import { FN000102ApiService } from '@api/fn/fn000102/fn000102-api.service';
import { FN000105ReqBody } from '@api/fn/fn000105/fn000105-req';
import { FN000105ApiService } from '@api/fn/fn000105/fn000105-api.service';
import { NocardAccountService } from '../shared/service/nocard-account.service';
import { DeviceService } from '@lib/plugins/device.service';
import { AuthService } from '@core/auth/auth.service';

@NgModule({
  imports: [SharedModule, CommonModule, NocardMenuRoutingModule],
  providers: [
    FN000101ReqBody,
    FN000101ApiService,
    FN000102ReqBody,
    FN000102ApiService,
    FN000105ReqBody,
    FN000105ApiService,
    NocardAccountService,
    AuthService,
    DeviceService
  ],
  declarations: [
    NocardMenuComponent
  ]
})
export class NocardMenuModule {}
