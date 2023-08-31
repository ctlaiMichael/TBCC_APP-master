import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoldSellAgreementPageComponent } from './gold-sell-agreement-page/gold-sell-agreement-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'gold-sell-agreement', pathMatch: 'full' },
  { path: '', component: GoldSellAgreementPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoldSellRoutingModule { }
