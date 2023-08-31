/**
 * [模擬]基金庫存查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000501_res_01, fi000501_res_02, fi000501_res_03, fi000501_res_04, fi000501_res_05, fi000501_res_error, fi000501_res_06, fi000501_res_07, fi000501_res_08 } from './fi000501-res-01';
import { logger } from '@shared/util/log-util';

export class FI000501SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    logger.error("into SimulateService 501");

    let simu_list: any;
    if (reqObj.trnsType == '1') {
      return fi000501_res_01; //模擬即時贖回
      // simu_list = fi000501_res_03; //模擬過營業時間狀況
      //  return fi000501_res_04; //模擬尚未申請基金下單
      // return fi000501_res_05; //測試
    } else if (reqObj.trnsType == '2') {
      // simu_list = fi000501_res_02; //預約贖回 trnsType：2
      return fi000501_res_02;
    } else if (reqObj.trnsType == '3') { //轉換 一轉一
      return fi000501_res_06;
    } else if (reqObj.trnsType == '4') { //轉換 一轉三
      return fi000501_res_07;
    } else if (reqObj.trnsType == '5') { //轉換 一轉一(預約)
      return fi000501_res_08;
    } else if (reqObj.trnsType == '100') { // 測錯誤情境
      return fi000501_res_03;
    } else {
      return fi000501_res_error; //trnsType 不是 1 2 3 4 5
    }
    
    // const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    // let output_data = PaginatorSimlationUtil.getResponse(f2000101_res_real, paginatedInfo, 'details.detail'); // 實際api測試
    // let output_data = PaginatorSimlationUtil.getResponse(simu_list, paginatedInfo, 'details.detail');
    // logger.error("output_data:",output_data);
    // return output_data;
  }
}
