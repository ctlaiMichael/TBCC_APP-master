/**
 * 分頁設定檔
 */
import { environment } from '@environments/environment';

let setOption = {
  PAGE_SIZE: 20,
  SORT: 'DESC'
};

if (!environment.PRODUCTION) {
  // 測試用分頁為3
  // setOption.PAGE_SIZE = 3;
}

export const PAGE_SETTING = setOption;
