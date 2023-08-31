/**
 * 線上簽約對保
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { SignProtectionRoutingModule } from './sign-protection-routing.module';
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
import { UserMaskModule } from '@shared/formate/mask/user/user-mask.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';

// ---------------- Pages Start ---------------- //
import { SignProtectMainPageComponent } from './sign-main/sign-protect-main-page.component';
import { SignProtectSearchPageComponent } from './search/sign-protect-search-page.component';
import { SignProtectContractPageComponent } from './contract/sign-protect-contract-page.component';
import { SignProtectEditPageComponent } from './edit/sign-protect-edit-page.component';
import { SignProtectDatePageComponent } from './data-select/sign-protect-date-page.component';
import { SignProtectSecurityPageComponent } from './security/sign-protect-security-page.component';
import { SignProtectResultPageComponent } from './result/sign-protect-result-page.component';

// ---------------- API Start ---------------- //
import { F9000501ApiService } from '@api/f9/f9000501/f9000501-api.service';
import { F9000502ApiService } from '@api/f9/f9000502/f9000502-api.service';
import { F9000504ApiService } from '@api/f9/f9000504/f9000504-api.service';
import { F9000401ApiService } from '@api/f9/f9000401/f9000401-api.service';
import { F9000403ApiService } from '@api/f9/f9000403/f9000403-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
	imports: [
		SharedModule,
		MenuTempModule,
		SignProtectionRoutingModule,
		PaginatorCtrlModule,
		SelectSecurityModule,
		CheckSecurityModule,
		UserMaskModule
	],
	providers: [
		// ---------------- Service Start ---------------- //
		F9000401ApiService,
		F9000501ApiService,
		F9000502ApiService,
		F9000403ApiService,
		F9000504ApiService,
	],
	declarations: [
		// ---------------- Pages Start ---------------- //
		SignProtectMainPageComponent,
		SignProtectSearchPageComponent,
		SignProtectEditPageComponent,
		SignProtectContractPageComponent,
		SignProtectDatePageComponent,
		SignProtectSecurityPageComponent,
		SignProtectResultPageComponent
	]
})
export class SignProtectionModule { }
