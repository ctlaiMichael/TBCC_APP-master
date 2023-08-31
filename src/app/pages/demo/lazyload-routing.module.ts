import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LazyloadPageComponent } from './lazyload-page/lazyload-page.component';
import { Lazyload2PageComponent } from './lazyload2-page/lazyload2-page.component';

const routes: Routes = [
  { path: '', redirectTo: '1', pathMatch: 'full' },
  {
    path: '1', // 設定根目錄為這一層
    component: LazyloadPageComponent,
    // Product 包含的小組件們
    // children: [
    //   { path: '', component: LazyloadPageComponent },
    // ]
  },
  {
    path: '2', // 設定根目錄為這一層
    component: Lazyload2PageComponent,
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
export class LazyloadRoutingModule { }
