import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TaipeiWaterRoutingModule } from './taipei-water-routing.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { AccountMaskModule } from '@shared/formate/mask/account/account-mask.module';

// ---------------- Pages Start ---------------- //
import { TaipeiWaterPageComponent } from './taipei-water-page.component';
import { TaipeiWaterConfirmPageComponent } from './taipei-water-confirm-page.component';
import { TaipeiWaterResultPageComponent } from './taipei-water-result-page.component';

// ---------------- API Start ---------------- //
import { F7000104ApiService } from '@api/f7/f7000104/f7000104-api.service';
import { F7001001ApiService } from '@api/f7/f7001001/f7001001-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
	imports: [
		SharedModule,
		TaipeiWaterRoutingModule,
		SelectSecurityModule,
		CheckSecurityModule,
		AccountMaskModule
	],
	providers: [
		// ---------------- Service Start ---------------- //
		F7000104ApiService,
		F7001001ApiService
	],
	declarations: [
		// ---------------- Pages Start ---------------- //
		TaipeiWaterPageComponent,
		TaipeiWaterConfirmPageComponent,
		TaipeiWaterResultPageComponent
	]
})
export class TaipeiWaterModule { }
