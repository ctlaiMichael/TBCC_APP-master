import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailChgPageComponent } from './email-change-page.component';
import { ConfirmMailPageComponent } from './confirm/confirm-email-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'mailChg', pathMatch: 'full' }
  , { path: 'mailChg', component: EmailChgPageComponent }
  , { path: 'confirmMail', component: ConfirmMailPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailChangeRoutingModule { }
