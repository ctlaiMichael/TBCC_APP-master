import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatementMenuPageComponent } from './statement-menu-page.component';
import { StatementEditPageComponent } from './statement-edit-page.component';
import { ConfirmStatementPageComponent } from './confirm/confirm-statement-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'statementMenu', pathMatch: 'full' }
  , { path: 'statementMenu', component: StatementMenuPageComponent }
  , { path: 'statementEdit', component: StatementEditPageComponent }
  , { path: 'confirmStatement', component: ConfirmStatementPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatementRoutingModule { }
