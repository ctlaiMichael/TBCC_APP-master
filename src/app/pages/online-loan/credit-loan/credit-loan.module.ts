/**
 * 房貸增貸
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { CreditLoanRoutingModule } from './credit-loan-routing.module';
import { AgreeTermComponentModule } from '../shared/component/agree-term/agree-term.component.module';
import { KycFillPageModule } from '../shared/component/kyc-fill/kyc-fill-page.module';
import { ConsumerApplyModule } from '../shared/component/consumer-apply/consumer-apply.module';
import { RelationFormModule } from '../shared/component/relation-form/relation-form.module';
import { ContactBranchModule } from '../shared/component/contact-branch/contact-branch.module';
import { FileUploadModule } from '../shared/component/file-upload/file-upload.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { BranchCaseModule } from '../shared/component/branch-case/branch-case.module';
// ---------------- Pages Start ---------------- //
import { CreditLoanMainComponent } from './credit-loan-main/credit-loan-main.component';
// ---------------- API Start ---------------- //
import { F9000401ApiService } from '@api/f9/f9000401/f9000401-api.service';
import { F9000402ApiService } from '@api/f9/f9000402/f9000402-api.service';
import { F9000100ApiService } from '@api/f9/f9000100/f9000100-api.service';
import { MortgageIncreaseService } from '../shared/service/mortgage-increase.service';
import { LoanResultPageModule } from '../shared/component/loan-result-page/loan-result-page.module';


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    MenuTempModule,
    CreditLoanRoutingModule,
    BranchCaseModule, //原案件分頁(共用)
    AgreeTermComponentModule, //同意條款(共用)
    KycFillPageModule, //kyc(共用)
    ConsumerApplyModule, //申請書(共用)
    RelationFormModule, //同一關係人(共用)
    ContactBranchModule, //選擇分行(共用)
    FileUploadModule, //證明文件上傳(共用)
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
    CreditLoanMainComponent //主頁
  ]
})
export class CreditLoanModule { }
