import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardHomeComponent } from './card-home/card-home.component';
import { LoginRequired } from '@core/auth/login-required.service';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }
  , {
    path: 'home', component: CardHomeComponent
    , data: {}
  },
  {
    path: 'card-pay', loadChildren: './card-pay/card-pay.module#CardPayModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  {
    path: 'card-quota', loadChildren: './card-quota/card-quota.module#CardQuotaModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  },
  {
    path: 'card-main-upload', loadChildren: './card-main-upload/card-main-upload.module#CardMainUploadModule'
    , data: {
      preload: false
    }
    , canActivate: [LoginRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardRoutingModule { }
