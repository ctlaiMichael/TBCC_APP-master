/**
 * 安控機制選項
 */
import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { SelectSecurityService } from './select-security.srevice';
// import { AuthService } from '@core/auth/auth.service';
import { SelectSecurityComponent } from './select-security.component';

/**
 * 模組清單
 */
const Modules = [
  CommonModule,
  FormsModule,
  TranslateModule,
  FormateModule,
];
const Provider = [
  SelectSecurityService
  // , AuthService
];
const Component = [
  SelectSecurityComponent
];

@NgModule({
  imports: [
    ...Modules
  ],
  providers: [
    ...Provider
  ],
  declarations: [
    ...Component
  ],
  exports: [
    ...Component
  ]
})
export class SelectSecurityModule { }
