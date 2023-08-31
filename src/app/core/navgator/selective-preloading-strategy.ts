import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preloadedModules: string[] = [];
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // logger.debug('==SelectivePreloadingStrategy=='+route.path);
    // logger.debug('==route data==');
    // logger.debug(route.data);
    if (route.data && route.data['preload']) {
        // == 預先載入route ==//
        // logger.debug('route is preload:' + route.path);
        return load();
    } else {
      //  logger.debug('route is not preload:'+route.path);
      return Observable.of(null);
    }
  }
}
