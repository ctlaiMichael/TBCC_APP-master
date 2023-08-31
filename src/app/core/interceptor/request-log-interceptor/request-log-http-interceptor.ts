import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { logger } from '@shared/util/log-util';

export class RequestTimeLogHttpInterceptor implements HttpInterceptor {

  constructor() { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    return next
      .handle(req)
      .do(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          logger.debug('req:', req);
          logger.debug('res:', event);
          logger.debug(`存取網址： ${req.urlWithParams}`);
          logger.debug(`花費時間： ${elapsed} ms`);
        }
      });
  }
}
