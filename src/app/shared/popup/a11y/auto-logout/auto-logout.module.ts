import { NgModule } from '@angular/core';
import { AutoLogoutComponent } from './auto-logout.component';
import { A11yAutoLogoutService } from './auto-logout.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    OverlayModule,
    TranslateModule,
    CommonModule
  ],
  declarations: [
    AutoLogoutComponent
  ],
  providers: [
    A11yAutoLogoutService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    AutoLogoutComponent
  ]
})
export class A11yAutoLogoutModule { }
