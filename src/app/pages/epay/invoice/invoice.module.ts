/**
 * Route定義
 * epay 雲端發票
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice-routing.module';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@shared/shared.module';
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module';

// ---------------- Pages Start ---------------- //
import { InvoicePageComponent } from './invoice-page/invoice-page.component';
import { EditBarcodePageComponent } from './edit-barcode-page/edit-barcode-page.component';
import { QueryMobileBcPageComponent } from './query-mobile-bc-page/query-mobile-bc-page.component';
import { FormsModule } from '@angular/forms';
import { QueryMobileBcResultPageComponent } from './query-mobile-bc-result-page/query-mobile-bc-result-page.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { BcRegEditPageComponent } from './bc-reg-edit-page/bc-reg-edit-page.component';
import { BcRegResultPageComponent } from './bc-reg-result-page/bc-reg-result-page.component';
import { LovecodeEditPageComponent } from './lovecode-edit-page/lovecode-edit-page.component';
import { ForgetVerEditPageComponent } from './forget-ver-edit-page/forget-ver-edit-page.component';
import { ForgetVerResultPageComponent } from './forget-ver-result-page/forget-ver-result-page.component';

// ---------------- API Start ---------------- //
import { InvoiceServiceModule } from '@pages/epay/shared/service/invoice/invoice-service.module';
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    InvoiceRoutingModule
    , NgxBarcodeModule
    , InvoiceServiceModule
    , BookmarkModule
  ],
  declarations: [
    InvoicePageComponent
    , EditBarcodePageComponent
    , QueryMobileBcPageComponent
    , QueryMobileBcResultPageComponent
    , BcRegEditPageComponent
    , BcRegResultPageComponent
    , LovecodeEditPageComponent
    , ForgetVerEditPageComponent
    , ForgetVerResultPageComponent
  ]
})
export class InvoiceModule { }
