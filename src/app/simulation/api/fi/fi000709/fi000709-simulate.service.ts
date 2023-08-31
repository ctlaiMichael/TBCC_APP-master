/**
 * [模擬]基金小額申購-新基金主機板本
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000709_res_01 } from './fi000709-res-01';

export class FI000709SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return fi000709_res_01;
  }

}
