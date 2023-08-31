/**
 * 文件上傳
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { CardUploadModule } from '../card-quota/card-upload/card-upload.module';
// import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { CardMainUploadRoutingModule } from './card-main-upload-routing.module';
import { CardMainUploadServiceModule } from '../shared/service/card-main-upload/card-main-upload-service.module';
// ---------------- Pages Start ---------------- //
import { CardMainUploadControlComponent } from './card-main-upload-control/card-main-upload-control.component';
import { CardMainUploadQueryComponent } from './card-main-upload-query/card-main-upload-query.component';
import { CardMainUploadResultComponent } from './card-main-upload-result/card-main-upload-result.component';
// ---------------- API Start ---------------- //
import { FC001006ApiService } from '@api/fc/fc001006/fc001006-api.service';
import { FC001005ApiService } from '@api/fc/fc001005/fc001005-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    MenuTempModule,
    CardMainUploadRoutingModule,
    CardMainUploadServiceModule,
    CardUploadModule
    // PaginatorCtrlModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    FC001005ApiService,
    FC001006ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    CardMainUploadControlComponent,
    CardMainUploadQueryComponent,
    CardMainUploadResultComponent
  ]
})
export class CardMainUploadModule { }
