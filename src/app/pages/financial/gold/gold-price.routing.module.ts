import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoldPageComponent } from './gold-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'gold', pathMatch: 'full' },

  {
    path: 'gold', component: GoldPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoldPriceRoutingModule { }
