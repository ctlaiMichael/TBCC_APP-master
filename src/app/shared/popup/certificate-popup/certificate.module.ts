import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateComponent } from './certificate.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { CertificateService } from './certificate.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    OverlayModule,
    TranslateModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    CertificateComponent
  ],
  providers: [
    CertificateService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    CertificateComponent
  ]
})
export class CertificateModule { }
