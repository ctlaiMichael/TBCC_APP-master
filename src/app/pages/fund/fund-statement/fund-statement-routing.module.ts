import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundStatementPageComponent } from './fund-statement-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: 'fund-statement', component: FundStatementPageComponent, data: {}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundStatementRoutingModule { }
