/**
 * [模擬]信託業務推介確認
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000608_res_01 } from './fi000608-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000608SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return fi000608_res_01;
  }

}
