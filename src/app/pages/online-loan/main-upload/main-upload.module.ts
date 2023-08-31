/**
 * 文件上傳
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { MainUploadRoutingModule } from './main-upload-routing.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';

// ---------------- Pages Start ---------------- //
import { MainUploadEditPageComponent } from './edit/main-upload-edit.component';
import { MainUploadResultPageComponent } from './result/main-upload-result-page.component';
import { MainUploadSearchPageComponent } from './search/main-upload-search.component';
import { MainUploadMainPageComponent } from './main-upload-main/main-upload-main-page.component';
import { F9000501ApiService } from '@api/f9/f9000501/f9000501-api.service';
import { F9000408ApiService } from '@api/f9/f9000408/f9000408-api.service';
import { F9000409ApiService } from '@api/f9/f9000409/f9000409-api.service';
// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    MenuTempModule,
    MainUploadRoutingModule,
    PaginatorCtrlModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    F9000501ApiService,
    F9000408ApiService,
    F9000409ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    MainUploadEditPageComponent,
    MainUploadSearchPageComponent,
    MainUploadResultPageComponent,
    MainUploadMainPageComponent
  ]
})
export class MainUploadModule { }
