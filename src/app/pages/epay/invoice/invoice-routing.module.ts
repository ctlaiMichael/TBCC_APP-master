import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicePageComponent } from './invoice-page/invoice-page.component';
import { EditBarcodePageComponent } from './edit-barcode-page/edit-barcode-page.component';
import { QueryMobileBcPageComponent } from './query-mobile-bc-page/query-mobile-bc-page.component';
import { QueryMobileBcResultPageComponent } from './query-mobile-bc-result-page/query-mobile-bc-result-page.component';
import { BcRegEditPageComponent } from './bc-reg-edit-page/bc-reg-edit-page.component';
import { BcRegResultPageComponent } from './bc-reg-result-page/bc-reg-result-page.component';
import { LovecodeEditPageComponent } from './lovecode-edit-page/lovecode-edit-page.component';
import { ForgetVerEditPageComponent } from './forget-ver-edit-page/forget-ver-edit-page.component';
import { ForgetVerResultPageComponent } from './forget-ver-result-page/forget-ver-result-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  // 發票載具號碼
  , {
    path: 'main', component: InvoicePageComponent, data: {
    }
  }
  ,
  { path: 'querymobilebc', component: QueryMobileBcPageComponent }, // 查詢手機條碼
  { path: 'querymobilebcresult', component: QueryMobileBcResultPageComponent }, // 查詢手機條碼結果
  { path: 'editbarcode', component: EditBarcodePageComponent }, // 設定手機條碼
  { path: 'bcregedit', component: BcRegEditPageComponent }, // 註冊手機條碼-編輯
  { path: 'bcregresult', component: BcRegResultPageComponent }, // 註冊手機條碼-結果
  { path: 'lovecodeedit', component: LovecodeEditPageComponent }, // 編輯捐贈碼
  { path: 'forgetveredit', component: ForgetVerEditPageComponent }, // 查詢驗證碼 - 編輯
  { path: 'forgetverresult', component: ForgetVerResultPageComponent }, // 查詢驗證碼 - 結果
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
