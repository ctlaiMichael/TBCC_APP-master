import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonMarketPageComponent } from './common-market-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'statementMenu', pathMatch: 'full' } 
   , { path: 'commonMarket', component: CommonMarketPageComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonMarketRoutingModule { }
