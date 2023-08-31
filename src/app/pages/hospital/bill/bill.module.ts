import { NgModule } from '@angular/core';
import { BillRoutingModule } from './bill-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AccountMaskModule } from '@shared/formate/mask/account/account-mask.module';
import { UserMaskModule } from '@shared/formate/mask/user/user-mask.module';

// ---------------- Pages Start ---------------- //
import { BillMenuPageComponent } from './bill-menu/bill-menu-page.component';
import { BillListPageComponent } from './bill-list/bill-list-page.component';
import { BankPageComponent } from './bank-pay/bank-page.component';
import { CreditCardPayPageComponent } from './creditcard-pay/creditcard-pay-page.component';
import { OneProvisionComponentModule } from '@shared/template/provision/one-provision/one-provision-component.module'; // 同意條款


// ---------------- API Start ---------------- //
import { FH000201ApiService } from '@api/fh/fh000201/fh000201-api.service';
import { F4000103ApiService } from '@api/f4/f4000103/f4000103-api.service';
import { FH000203ApiService } from '@api/fh/fh000203/fh000203-api.service';
import { FH000202ApiService } from '@api/fh/fh000202/fh000202-api.service';
import { FH000208ApiService } from '@api/fh/fh000208/fh000208-api.service';
import { CaptchaModule } from '@shared/captcha/captcha.moudle';

// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    BillRoutingModule,
    AccountMaskModule,
    UserMaskModule,
    CaptchaModule
    , OneProvisionComponentModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FH000201ApiService,
    F4000103ApiService,
    FH000203ApiService,
    FH000202ApiService,
    FH000208ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    BillMenuPageComponent,
    BillListPageComponent,
    BankPageComponent,
    CreditCardPayPageComponent,
  ]
})
export class BillModule { }
