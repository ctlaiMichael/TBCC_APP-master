import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
// import { MainUploadMainPageComponent } from './main-upload-main/main-upload-main-page.component';
// import { MainUploadSearchPageComponent } from './search/main-upload-search.component';
// import { MainUploadEditPageComponent } from './edit/main-upload-edit.component';
// import { MainUploadResultPageComponent } from './result/main-upload-result-page.component';

import { CardMainUploadControlComponent } from './card-main-upload-control/card-main-upload-control.component';
import { CardMainUploadQueryComponent } from './card-main-upload-query/card-main-upload-query.component';
import { CardMainUploadResultComponent } from './card-main-upload-result/card-main-upload-result.component';

const routes: Routes = [
  { path: '', redirectTo: 'card-main-upload', pathMatch: 'full' }
  , {
    // == 主控 == //
    path: 'card-main-upload', component: CardMainUploadControlComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 查詢頁 == //
    path: 'query', component: CardMainUploadQueryComponent
    // ,canActivate: [LogoutRequired]
  }
  // , {
  //   // == 編輯頁 == //
  //   path: 'edit1', component: MainUploadEditPageComponent
  //   // ,canActivate: [LogoutRequired]
  // }
  , {
    // == 結果頁 == //
    path: 'result', component: CardMainUploadResultComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardMainUploadRoutingModule { }