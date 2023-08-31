import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRequired } from '@core/auth/login-required.service';
import { HomePageComponent } from './home-page/home-page.component';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { LogoutRequired } from '@core/auth/logout-required.service';

const routes: Routes = [
  {
    path: '', component: HomePageComponent
    , canActivate: [LogoutRequired]
  }
  // 登入後首頁
  , {
    path: 'user-home', loadChildren: './user-home-page/user-home-page.module#UserHomePageModule'
    , canActivate: [LoginRequired]
    , data: {
      preload: true
    }
  }
  , {
    path: '**', // any other
    redirectTo: '1'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
