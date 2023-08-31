import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoldbuyStatementComponent } from '@pages/gold-business/gold-buy/statement/goldbuy-statement.component';
import { GoldbuyEditPageComponent } from '@pages/gold-business/gold-buy/edit/goldbuy-edit-page.component';
import { GoldbuyConfirmPageComponent } from '@pages/gold-business/gold-buy/confirm/goldbuy-confirm-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'statement', pathMatch: 'full' }
  , { path: 'statement', component: GoldbuyStatementComponent }
  , { path: 'edit', component: GoldbuyEditPageComponent }
  , { path: 'confirm', component: GoldbuyConfirmPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoldbuyRoutingModule { }
