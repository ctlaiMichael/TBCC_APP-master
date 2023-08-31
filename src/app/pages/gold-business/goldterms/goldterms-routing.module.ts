import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoldtermsStatementComponent } from '@pages/gold-business/goldterms/statement/goldterms-statement.component';
import { GoldtermsSelectacctPageComponent } from '@pages/gold-business/goldterms/selectacct/goldterms-selectacct-page.component';
import { GoldtermsEditPageComponent } from '@pages/gold-business/goldterms/edit/goldterms-edit-page.component';
import { GoldtermsConfirmPageComponent } from '@pages/gold-business/goldterms/confirm/goldterms-confirm-page.component';
import { GoldtermsResultPageComponent } from '@pages/gold-business/goldterms/result/goldterms-result-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'statement', pathMatch: 'full' }
  , { path: 'statement', component: GoldtermsStatementComponent }
  , { path: 'selectacct', component: GoldtermsSelectacctPageComponent }
  , { path: 'edit', component: GoldtermsEditPageComponent }
  , { path: 'confirm', component: GoldtermsConfirmPageComponent }
  , { path: 'result', component: GoldtermsResultPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoldtermsRoutingModule { }
