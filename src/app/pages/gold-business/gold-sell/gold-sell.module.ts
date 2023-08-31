import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoldSellRoutingModule } from './gold-sell-routing.module';
import { GoldSellAgreementPageComponent } from './gold-sell-agreement-page/gold-sell-agreement-page.component';
import { GoldSellEditPageComponent } from './gold-sell-edit-page/gold-sell-edit-page.component';
import { GoldSellConfirmPageComponent } from './gold-sell-confirm-page/gold-sell-confirm-page.component';
import { FormsModule } from '@angular/forms';
import { GoldSellBuyService } from '../shared/service/gold-sell-buy.service';
import { GoldDetailService } from '../shared/service/gold-detail.service';
import { FB000705ApiService } from '@api/fb/fb000705/fb000705-api.service';
import { FB000706ApiService } from '@api/fb/fb000706/fb000706-api.service';
import { SharedModule } from '@shared/shared.module';
import { SelectSecurityComponent } from '@shared/transaction-security/select-security/select-security.component';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { FB000707ApiService } from '@api/fb/fb000707/fb000707-api.service';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
// import { FB000710ApiService } from '@api/fb/fb000710/fb000710-api.service';
import { UserSetCertifyModule } from '@pages/user-set/shared/component/popup/certify.module';
import { UserSetResultModule } from '@pages/user-set/shared/component/result/result.module';
import { FB000708ApiService } from '@api/fb/fb000708/fb000708-api.service';
import { GoldBusinessSharedModule } from '../shared/gold-business-shared.module';
import { FB000709ApiService } from '@api/fb/fb000709/fb000709-api.service';

@NgModule({
  providers: [
    GoldSellBuyService,
    GoldDetailService,
    FB000705ApiService,
    FB000706ApiService,
    FB000707ApiService,
    FB000708ApiService,
    FB000709ApiService
    // FB000710ApiService
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    GoldSellRoutingModule,
    SelectSecurityModule,
    CheckSecurityModule,
    UserSetCertifyModule,
    GoldBusinessSharedModule
  ],
  declarations: [
    GoldSellAgreementPageComponent,
    GoldSellEditPageComponent,
    GoldSellConfirmPageComponent]
})
export class GoldSellModule { }
