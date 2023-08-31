import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SelectSecurityModule } from '@shared/transaction-security/select-security/select-security.module';
import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';
import { LaborHealthNationalRoutingModule } from './labor-health-national-routing.module';

// ---------------- Pages Start ---------------- //
import { LaborHealthNationalPageComponent } from './labor-health-national-page.component';
import { LaborHealthNationalConfirmPageComponent } from './labor-health-national-confirm-page.component';
import { LaborHealthNationalResultPageComponent } from './labor-health-national-result-page.component';

// ---------------- API Start ---------------- //
import { F7000104ApiService } from '@api/f7/f7000104/f7000104-api.service';
import { F7000501ApiService } from '@api/f7/f7000501/f7000501-api.service';
import { F7000601ApiService } from '@api/f7/f7000601/f7000601-api.service';
import { F7000701ApiService } from '@api/f7/f7000701/f7000701-api.service';

// ---------------- Service Start ---------------- //


@NgModule({
	imports: [
		SharedModule,
		LaborHealthNationalRoutingModule,
		SelectSecurityModule,
		CheckSecurityModule,
	],
	providers: [
		// ---------------- Service Start ---------------- //
		F7000104ApiService,
		F7000501ApiService,            // 勞保
		F7000601ApiService,            // 國民年金
		F7000701ApiService             // 健保
	],
	declarations: [
		// ---------------- Pages Start ---------------- //
		LaborHealthNationalPageComponent,
		LaborHealthNationalConfirmPageComponent,
		LaborHealthNationalResultPageComponent
	]
})
export class LaborHealthNationalModule { }
