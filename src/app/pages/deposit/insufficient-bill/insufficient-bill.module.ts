import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { InsufficientBillRoutingModule } from './insufficient-bill-routing.module';

// ---------------- Pages Start ---------------- //
import { InsufficientBill } from './insufficient-bill-page.component';
import { InsufficientBillPaginator } from './insufficient-bill-paginator/insufficient-bill-paginator.component';


// ---------------- API Start ---------------- //
import { F2000301ApiService } from '@api/f2/f2000301/f2000301-api.service';


// ---------------- Service Start ---------------- //
import { DepositInquiryService } from '../shared/service/deposit-inquiry.service';


// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';


@NgModule({
  imports: [
    SharedModule
    , InsufficientBillRoutingModule
    , PaginatorCtrlModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    DepositInquiryService
    , F2000301ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    InsufficientBill,
    InsufficientBillPaginator
  ],
  entryComponents: [
    InsufficientBillPaginator
  ]
})
export class InsufficientBillModule { }
