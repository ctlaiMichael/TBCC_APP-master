import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAssetOverviewComponent } from './user-asset-overview.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  // 資產總攬
  {
    path: 'main', component: UserAssetOverviewComponent
    , data: {}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAssetOverviewRoutingModule { }
