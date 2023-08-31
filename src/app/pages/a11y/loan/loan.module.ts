import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InquiryModule } from '@pages/credit/inquiry/inquiry.module';
import { FormateModule } from '@shared/formate/formate.module';
import { LoanPageboxA11yPageComponent } from './loan-pagebox-a11y-page/loan-pagebox-a11y-page.component';
import { LoanResultA11yPageComponent } from './loan-result-a11y-page/loan-result-a11y-page.component';
import { LoanRoutingModule } from './loan-routing.module';
import { LoanSearchA11yPageComponent } from './loan-search-a11y-page/loan-search-a11y-page.component';
import { LoanService } from './shared/loan.service';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { LoanResultPageboxA11yPageComponent } from './loan-result-pagebox-a11y-page/loan-result-pagebox-a11y-page.component';



@NgModule({
  imports: [
    CommonModule,
    LoanRoutingModule,
    FormsModule,
    InquiryModule,
    FormateModule,
    PaginatorCtrlModule
  ],
  declarations: [
    LoanSearchA11yPageComponent,
    LoanResultA11yPageComponent,
    LoanPageboxA11yPageComponent,
    LoanResultPageboxA11yPageComponent,
  ],
  entryComponents: [
    LoanPageboxA11yPageComponent,
    LoanResultPageboxA11yPageComponent
  ],
  providers: [
    LoanService
  ],
  exports: [
    PaginatorCtrlModule,
    LoanPageboxA11yPageComponent
  ]
})
export class LoanModule { }
