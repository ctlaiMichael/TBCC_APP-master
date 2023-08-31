import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TuitionRoutingModule } from './tuition-routing.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { AccountMaskModule } from '@shared/formate/mask/account/account-mask.module';

// ---------------- Pages Start ---------------- //
import { TuitionPageComponent } from './tuition-page.component';
import { TuitionConfirmPageComponent } from './tuition-confirm-page.component';
import { TuitionResultPageComponent } from './tuition-result-page.component';

// ---------------- API Start ---------------- //
import { F7000104ApiService } from '@api/f7/f7000104/f7000104-api.service';
import { F7000801ApiService } from '@api/f7/f7000801/f7000801-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
	imports: [
		SharedModule,
		TuitionRoutingModule,
		SelectSecurityModule,
		CheckSecurityModule,
		AccountMaskModule
	],
	providers: [
		// ---------------- Service Start ---------------- //
		F7000104ApiService,
		F7000801ApiService
	],
	declarations: [
		// ---------------- Pages Start ---------------- //
		TuitionPageComponent,
		TuitionConfirmPageComponent,
		TuitionResultPageComponent
	]
})
export class TuitionModule { }
