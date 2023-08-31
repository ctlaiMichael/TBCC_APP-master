import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
import { MainUploadMainPageComponent } from './main-upload-main/main-upload-main-page.component';
import { MainUploadSearchPageComponent } from './search/main-upload-search.component';
import { MainUploadEditPageComponent } from './edit/main-upload-edit.component';
import { MainUploadResultPageComponent } from './result/main-upload-result-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  , {
    // == 主控 == //
    path: 'main', component: MainUploadMainPageComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 查詢頁 == //
    path: 'query', component: MainUploadSearchPageComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 編輯頁 == //
    path: 'edit1', component: MainUploadEditPageComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 結果頁 == //
    path: 'result', component: MainUploadResultPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainUploadRoutingModule { }