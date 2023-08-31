import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DownloadMainPageComponent } from './download-main/download-main-page.component';
import { DownloadSearchPageComponent } from './search/download-search-page.component';

// ---------------- Pages Start ---------------- //

const routes: Routes = [
  { path: '', redirectTo: 'download-main', pathMatch: 'full' }
    , {
    // == 約據下載-主控頁 == //
    path: 'download-main', component: DownloadMainPageComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 約據下載-查詢頁 == //
    path: 'download-search', component: DownloadSearchPageComponent
    // ,canActivate: [LogoutRequired]
  }
  // , {
  //   // == 約據下載-編輯頁1 == //
  //   path: 'download-edit1', component: DownloadSearchPageComponent
  //   // ,canActivate: [LogoutRequired]
  // }
  // , {
  //   // == 約據下載-編輯頁2 == //
  //   path: 'download-edit2', component: DownloadDetailPageComponent
  //   // ,canActivate: [LogoutRequired]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractDownloadRoutingModule { }