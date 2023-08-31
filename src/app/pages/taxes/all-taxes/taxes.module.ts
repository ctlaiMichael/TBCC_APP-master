/**
 * 各類稅款
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TaxesRoutingModule } from './taxes-routing.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { AccountMaskModule } from '@shared/formate/mask/account/account-mask.module';

// ---------------- Pages Start ---------------- //
import { TaxesPageComponent } from './taxes-page.component';
import { TaxesDetailPageComponent } from './taxes-detail-page.component';
import { TaxesDetailConfirmPageComponent } from './taxes-detail-confirm-page.component';
import { TaxesDetailResultPageComponent } from './taxes-detail-result-page.component';

// ---------------- API Start ---------------- //
import { F7000101ApiService } from '@api/f7/f7000101/f7000101-api.service';
import { F7000102ApiService } from '@api/f7/f7000102/f7000102-api.service';
import { F7000103ApiService } from '@api/f7/f7000103/f7000103-api.service';
import { F7001101ApiService } from '@api/f7/f7001101/f7001101-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
	imports: [
		SharedModule,
		TaxesRoutingModule,
		SelectSecurityModule,
		CheckSecurityModule,
		AccountMaskModule
	],
	providers: [
		// ---------------- Service Start ---------------- //
		F7000101ApiService,
		F7000102ApiService,
		F7000103ApiService,
		F7001101ApiService
	],
	declarations: [
		// ---------------- Pages Start ---------------- //
		TaxesPageComponent,
		TaxesDetailPageComponent,
		TaxesDetailConfirmPageComponent,
		TaxesDetailResultPageComponent
	]
})
export class TaxesModule { }
