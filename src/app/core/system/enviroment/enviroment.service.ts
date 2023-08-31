/**
 * 取得APP環境設定
 */

import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class EnviromentService {

  constructor() { }

  get(key: string) {
    return environment[key];
  }
}
