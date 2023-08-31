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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReserFormRoutingModule { }
