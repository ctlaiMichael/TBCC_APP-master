import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuPageComponent } from './menu-page/menu-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'menu', pathMatch: 'full'
  }, {
    // 設定根目錄為這一層
    path: 'menu', component: MenuPageComponent, data: {}
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  }
  , {
    path: 'launder-prevention', loadChildren: './launder-prevention/launder-prevention.module#LaunderPreventionModule'
  }
   , {
    path: 'acnt-bla-cert', loadChildren: './acnt-bla-cert/acnt-bla-cert.module#AcntBlaCertModule'
  }, {
    path: 'reser-form', loadChildren: './reser-form/reser-form.module#ReserFormModule'
  }
  , {
    path: 'online-loan-desk', loadChildren: './online-loan-desk/online-loan-desk.module#OnlineLoanDeskModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontDeskRoutingModule { }
