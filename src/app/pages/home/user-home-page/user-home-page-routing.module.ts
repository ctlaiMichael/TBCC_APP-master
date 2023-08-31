import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserHomePageComponent } from './user-home-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  // 登入後首頁
  {
    path: 'main', component: UserHomePageComponent
    , data: {}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserHomePageRoutingModule { }
