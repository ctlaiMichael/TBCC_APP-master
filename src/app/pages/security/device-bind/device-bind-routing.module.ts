import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceBindPageComponent } from './device-bind-page.component';


const routes: Routes = [
  {
    // == 裝置綁定檢核 == //
    path: '', redirectTo: 'main', pathMatch: 'full'
  }
  // 裝置綁定檢核
  , {
    path: 'main',
    component: DeviceBindPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceBindRoutingModule { }
