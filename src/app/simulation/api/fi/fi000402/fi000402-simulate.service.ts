/**
 * [模擬]基金投資標的查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000402_res_01, fi000402_res_02, fi000402_res_03, fi000402_res_04, fi000402_res_05, fi000402_res_06, fi000402_res_07, fi000402_res_08, fi000402_res_09, fi000402_res_10, fi000402_res_11,
   fi000402_res_12, fi000402_res_13, fi000402_res_14, fi000402_res_15, fi000402_res_16, fi000402_res_17, fi000402_res_18, fi000402_res_19, fi000402_res_20 } from './fi000402-res-01';

export class FI000402SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    //compCode 是否空，判斷是否「基金公司代碼搜尋」
    if (reqObj['compCode'] == '') {
      // 取得公司列表(13)
      // const check_key = reqObj['investType'] + reqObj['fundType'] + reqObj['selectfund'];
      // switch (check_key) {
      //   case 'ACY':
      //   case 'BCY':
      //   case 'DCY':
      //     // 國內精選
      //     return fi000402_res_02;
      //   case 'AFY':
      //   case 'BFY':
      //   case 'DFY':
      //     // 國外精選
      //     return fi000402_res_01;

      //   default:
      //     return fi000402_res_02;
      // }

      //單筆，國內精選(ACY)
      if (reqObj['investType'] == 'A' && reqObj['fundType'] == 'C' && reqObj['selectfund'] == 'Y') {
        return fi000402_res_01;
        //單筆，國外精選(AFY)
      } else if (reqObj['investType'] == 'A' && reqObj['fundType'] == 'F' && reqObj['selectfund'] == 'Y') {
        return fi000402_res_02;
        //定期定額，國內精選(BCY)
      } else if (reqObj['investType'] == 'B' && reqObj['fundType'] == 'C' && reqObj['selectfund'] == 'Y') {
        return fi000402_res_03;
        //定期定額，國外精選(BFY)
      } else if (reqObj['investType'] == 'B' && reqObj['fundType'] == 'F' && reqObj['selectfund'] == 'Y') {
        return fi000402_res_04;
        //定期不定額，國內精選(DCY)
      } else if (reqObj['investType'] == 'D' && reqObj['fundType'] == 'C' && reqObj['selectfund'] == 'Y') {
        return fi000402_res_05;
        //定期不定額，國外精選(DFY)
      } else if (reqObj['investType'] == 'D' && reqObj['fundType'] == 'F' && reqObj['selectfund'] == 'Y') {
        return fi000402_res_06;
        //單筆，國內自選(ACN)
      } else if (reqObj['investType'] == 'A' && reqObj['fundType'] == 'C' && reqObj['selectfund'] == 'N') {
        return fi000402_res_07;
        //單筆，國外自選(AFN)
      } else if (reqObj['investType'] == 'A' && reqObj['fundType'] == 'F' && reqObj['selectfund'] == 'N') {
        return fi000402_res_08;
        //定期定額，國內自選(BCN)
      } else if (reqObj['investType'] == 'B' && reqObj['fundType'] == 'C' && reqObj['selectfund'] == 'N') {
        return fi000402_res_09;
        //定期定額，國外自選(BFN)
      } else if (reqObj['investType'] == 'B' && reqObj['fundType'] == 'F' && reqObj['selectfund'] == 'N') {
        return fi000402_res_10;
        //定期不定額，國內自選(DCN)
      } else if (reqObj['investType'] == 'D' && reqObj['fundType'] == 'C' && reqObj['selectfund'] == 'N') {
        return fi000402_res_11;
        //定期不定額，國外自選(DFN)
      } else if (reqObj['investType'] == 'D' && reqObj['fundType'] == 'F' && reqObj['selectfund'] == 'N') {
        return fi000402_res_12;
      }
      //基金代碼搜尋
    } else {
      //代碼查ACN
      if (reqObj['investType'] == 'A' && reqObj['fundType'] == 'C' && reqObj['selectfund'] == 'N') {
        return fi000402_res_13;
        //代碼查AFN
      } else if (reqObj['investType'] == 'A' && reqObj['fundType'] == 'F' && reqObj['selectfund'] == 'N') {
        return fi000402_res_14;
        //代碼查BCN
      } else if (reqObj['investType'] == 'B' && reqObj['fundType'] == 'C' && reqObj['selectfund'] == 'N') {
        return fi000402_res_15;
        //代碼查BFN
      } else if (reqObj['investType'] == 'B' && reqObj['fundType'] == 'F' && reqObj['selectfund'] == 'N') {
        return fi000402_res_16;
        //代碼查DCN
      } else if (reqObj['investType'] == 'D' && reqObj['fundType'] == 'C' && reqObj['selectfund'] == 'N') {
        return fi000402_res_17;
        //代碼查DFN
      } else if (reqObj['investType'] == 'D' && reqObj['fundType'] == 'F' && reqObj['selectfund'] == 'N') {
        return fi000402_res_18;
      } 
    }

    //轉換查公司
    if (reqObj['investType'] == 'C' && reqObj['fundCode'] !== '' && reqObj['compCode'] == '') {
      return fi000402_res_19;
    //轉換查基金
    } else if(reqObj['investType'] == 'C' && reqObj['compCode'] !== '' && reqObj['fundCode'] == '') {
      return fi000402_res_20;
    }

  }
}
