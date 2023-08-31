import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NocardAgreementPageComponent } from "./nocard-agreement-page/nocard-agreement-page.component";
import { NocardAddAccountPageComponent } from "./nocard-add-account-page/nocard-add-account-page.component";
import { NocardConfirmPageComponent } from "./nocard-confirm-page/nocard-confirm-page.component";

const routes: Routes = [
  { path: "", redirectTo: "menu", pathMatch: "full" },
  { path: "nocard-setting", component: NocardAgreementPageComponent },
  // 新增/刪除帳號
  {
    path: "nocardaddaccountkey",
    component: NocardAddAccountPageComponent
  },
  // 帳號確認
  {
    path: "nocardconfirmaccountkey",
    component: NocardConfirmPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NocardSettingRoutingModule {}
