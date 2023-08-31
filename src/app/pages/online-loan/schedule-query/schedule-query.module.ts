/**
 * 文件上傳
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { ScheduleQueryRoutingModule } from './schedule-query-routing.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';

// ---------------- Pages Start ---------------- //
import { QueryEditPageComponent } from './query-edit/query-edit-page.component';
import { QueryMainPageComponent } from './query-main/query-main-page.component';
// ---------------- API Start ---------------- //
import { F9000501ApiService } from '@api/f9/f9000501/f9000501-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    MenuTempModule,
    ScheduleQueryRoutingModule,
    PaginatorCtrlModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    F9000501ApiService
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    QueryEditPageComponent,
    QueryMainPageComponent
  ]
})
export class ScheduleQueryModule { }
