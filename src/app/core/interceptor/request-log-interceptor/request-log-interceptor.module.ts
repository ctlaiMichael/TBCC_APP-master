import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { RequestTimeLogHttpInterceptor } from './request-log-http-interceptor';

@NgModule({
  imports: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestTimeLogHttpInterceptor,
      multi: true
    }
  ]
})
export class RequestLogHttpInterceptorModule { }
