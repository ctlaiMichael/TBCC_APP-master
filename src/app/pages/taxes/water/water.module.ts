import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { WaterRoutingModule } from './water-routing.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { AccountMaskModule } from '@shared/formate/mask/account/account-mask.module';

// ---------------- Pages Start ---------------- //
import { WaterPageComponent } from './water-page.component';
import { WaterConfirmPageComponent } from './water-confirm-page.component';
import { WaterResultPageComponent } from './water-result-page.component';

// ---------------- API Start ---------------- //
import { F7000104ApiService } from '@api/f7/f7000104/f7000104-api.service';
import { F7000201ApiService } from '@api/f7/f7000201/f7000201-api.service';
// ---------------- Service Start ---------------- //


@NgModule({
	imports: [
		SharedModule,
		WaterRoutingModule,
		SelectSecurityModule,
		CheckSecurityModule,
		AccountMaskModule
	],
	providers: [
		// ---------------- Service Start ---------------- //
		F7000104ApiService,
		F7000201ApiService
	],
	declarations: [
		// ---------------- Pages Start ---------------- //
		WaterPageComponent,
		WaterConfirmPageComponent,
		WaterResultPageComponent
	]
})
export class WaterModule { }
