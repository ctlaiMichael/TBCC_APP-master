import { NgModule } from '@angular/core';
import { AutoLogoutComponent } from './auto-logout.component';
import { AutoLogoutService } from './auto-logout.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    OverlayModule,
    TranslateModule
  ],
  declarations: [
    AutoLogoutComponent
  ],
  providers: [
    AutoLogoutService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    AutoLogoutComponent
  ]
})
export class AutoLogoutModule { }
