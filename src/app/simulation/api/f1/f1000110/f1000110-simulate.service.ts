/**
 * 9700 法遵
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { f1000110_res_01 } from './f1000110-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class F1000110SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return f1000110_res_01;
  }

}
