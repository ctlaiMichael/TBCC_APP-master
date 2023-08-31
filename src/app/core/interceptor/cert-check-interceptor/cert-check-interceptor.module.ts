import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CertCheckHttpInterceptor } from './cert-check-http-interceptor';
import { ServerVerifierService } from '@lib/plugins/server-verifier/server-verifier.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ServerVerifierService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CertCheckHttpInterceptor,
      multi: true
    }
  ]
})
export class CertCheckInterceptorModule { }
