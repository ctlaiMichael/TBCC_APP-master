import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaipeiWaterPageComponent } from './taipei-water-page.component';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: TaipeiWaterPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaipeiWaterRoutingModule { }