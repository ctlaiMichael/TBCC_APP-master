/**
 * 勞工紓困貸款
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
// import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { BailOutLoanRoutingModule } from './bail-out-loan-routing.module';
import { KycFillPageModule } from './kyc-fill/kyc-fill-page.module';
import { ConsumerApplyModule } from './consumer-apply/consumer-apply.module';
// import { RelationFormModule } from './relation-form/relation-form.module';
import { ContactBranchModule } from './contact-branch/contact-branch.module';
// import { FileUploadModule } from './file-upload/file-upload.module';
import { BranchCaseModule } from '../shared/component/branch-case/branch-case.module';
// ---------------- Pages Start ---------------- //
import { BailOutLoanMainComponent } from './bail-out-loan-main/bail-out-loan-main.component';
// ---------------- API Start ---------------- //
import { F9000401ApiService } from '@api/f9/f9000401/f9000401-api.service';
import { F9000402ApiService } from '@api/f9/f9000402/f9000402-api.service';
import { F9000100ApiService } from '@api/f9/f9000100/f9000100-api.service';
import { MortgageIncreaseService } from '../shared/service/mortgage-increase.service';
import { LoanResultPageModule } from './loan-result-page/loan-result-page.module';


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    // MenuTempModule,
    BailOutLoanRoutingModule,
    BranchCaseModule, //原案件分頁(共用)
    KycFillPageModule, //kyc(共用)
    ConsumerApplyModule, //申請書(共用)
    // RelationFormModule, //同一關係人(共用)
    ContactBranchModule, //選擇分行(共用)
    // FileUploadModule, //證明文件上傳(共用)
    LoanResultPageModule, //結果頁(共用)
    PaginatorCtrlModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    F9000401ApiService,
    F9000402ApiService,
    F9000100ApiService,
    MortgageIncreaseService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    BailOutLoanMainComponent //主頁
  ]
})
export class BailOutLoanModule { }
