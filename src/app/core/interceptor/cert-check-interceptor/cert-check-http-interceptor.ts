import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { environment } from 'environments/environment';
import { ServerVerifierService } from '@lib/plugins/server-verifier/server-verifier.service';
import { f100_0_res_03 } from 'app/simulation/api/f1/f1000101/f1000101-res-03';

import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class CertCheckHttpInterceptor implements HttpInterceptor {
  constructor(
    private verifier: ServerVerifierService
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // return Observable.fromPromise(this.handleAccess(req, next));
    if ((req.url.indexOf(environment.SERVER_URL) === 0 && environment.ONLINE && req.url.indexOf('https') === 0)) { // 只過濾api路徑的連線
      return Observable.fromPromise(this.certCheck(req, next));
    } else {
      // 離線模式
      return next.handle(req);
    }
  }

  private async certCheck(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    try {
      const success = await this.verifier.verify();
      return next.handle(request).toPromise();
    } catch (error) {
      const newResponse = new HttpResponse({ body: ObjectUtil.clone(f100_0_res_03) });
      // let changedResponse = request;
      // changedResponse = request.clone({
      //   body: newResponse
      // });
      return of(newResponse).toPromise();
    }
  }

  // certCheck(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return new Observable(observer => {
  //     this.verifier.verify()
  //       .then(() => {
  //         return next.handle(req);
  //       })
  //       .catch(() => {
  //         logger.debug('certCheck');
  //         return observer.next(new HttpResponse({ body: ObjectUtil.clone(f100_0_res_02) }));
  //       });
  //   });
  // }
}
