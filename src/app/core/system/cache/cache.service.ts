import { Injectable } from '@angular/core';
import { CacheData } from './cache-data';
import { CacheCheckData } from './cache-check-data';
import { logger } from '@shared/util/log-util';
import { CACHE_SET } from '@conf/cache_set';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
const now = function () {
  return new Date().getTime();
};

@Injectable()
export class CacheService {
  cache = {};
  constructor() {
  }

  /**
   * 檢查資料有效
   * @param key key值
   */
  public checkUpdate(key: string) {
    let data = this.load(key);
    return !!data;
  }

  /**
   * 將資料儲入Cache
   * @param key key值
   * @param value 資料內容
   * @param option 選項
   */
  public save(key: string, value: any, option?: CacheData) {
    const defaultOption = new CacheData();
    const data = { ...defaultOption, ...option };
    data.value = ObjectUtil.clone(value);
    if (!!data.ttl) {
      // 設定有效時間
      data.effectTime = now() + (data.ttl * 60000);
    }
    return this.set(key, data);
  }

  /**
   * 載入Cache中的資料
   * @param key key值
   */
  public load(key: string): any {
    const data = this.get(key, false);
    if (!data) { return data; }
    // 超過有效時間刪除
    if (!!data.effectTime && now() > data.effectTime) {
      this.remove(key);
      return null;
    }
    return ObjectUtil.clone(data.value);
  }

  /**
   * 刪除key值
   * @param key key值
   */
  public remove(key: string) {
    if (this.cache.hasOwnProperty(key)) {
      logger.step('Cache', 'remove', key);
      delete this.cache[key];
    }
  }

  // /**
  //  * 刪除特定serviceId相關資料
  //  * @param serviceId serviceId
  //  */
  // public removeGroup(serviceId: string) {
  //   // tslint:disable-next-line:forin
  //   for (let key in this.cache) {
  //     if (key.indexOf(serviceId + ':') > -1) {
  //       logger.step('Cache', 'remove group', key, key, serviceId + ':');
  //       this.remove(key);
  //     }
  //   }
  // }

  /**
   * 刪除指定group list
   * @param group group list
   */
  public removeGroup(group: string) {
    logger.step('Cache', 'remove group', group);
    // tslint:disable-next-line:forin
    for (let key in this.cache) {
      const data = this.get(key, true);
      if (data && data.groupList.indexOf(group) > -1) {
        this.remove(key);
      }
    }
  }

  /**
   * 清除chche
   * @param type 類型 login(只刪除登入資訊)/ keepAlways(保留always保留) /all(全刪)
   */
  public clear(type = 'login') {
    logger.step('Cache', 'remove clear', type);
    if (type === 'login') {
      // tslint:disable-next-line:forin
      for (let key in this.cache) {
        const data = this.get(key, true);
        if (data && data.keepAlive === 'login') {
          this.remove(key);
        }
      }
    } else if (type === 'keepAlways') {
      // tslint:disable-next-line:forin
      for (let key in this.cache) {
        const data = this.get(key, true);
        logger.log('data:', data);
        if (data && data.keepAlive != 'always') {
          logger.log('remove:' + key);
          this.remove(key);
        }
      }
    } else if (type === 'all') {
      this.cache = {};
    }
  }

  /**
   * 取得cache設定值
   * @param key cache key
   */
  public getCacheSet(key: string): CacheData {
    let output = new CacheData();
    let key_list = key.split('@');
    let set_key = (typeof key_list[0] !== 'undefined') ? key_list[0] : key;

    if (!CACHE_SET.hasOwnProperty(set_key)) {
      return output;
    }
    const key_obj = ObjectUtil.clone(CACHE_SET[set_key]);
    output = { ...output, ...key_obj };

    return output;
  }

  public checkCacheSet(option): CacheCheckData {
    let output = new CacheCheckData();
    output = { ...output, ...option };
    return output;
  }

  /**
   * 檢查是否有cache存在
   */
  checkCacheData(cache_key, option?: Object) {
    let output: any;
    const cache_check = this.checkCacheSet(option);

    if (!cache_check.reget) {
      // 背景取得，首頁請求，取cache
      output = this.load(cache_key);
    } else {
      // 強制清除cache (取得最新的)
      this.remove(cache_key);
    }
    return output;
  }


  /**
   * 分頁常用cache處理
   * @param main_cache_key 主要cache key
   * @param page 頁數
   * @param sort 排序 目前無作用
   * @param option 設定
   * @param pageSize 一頁數量
   * @param other_set 其他參數
   */
  // tslint:disable-next-line:max-line-length
  public checkPaginatorCach(main_cache_key: string, page?: number, sort?: Array<any>, option?: Object, pageSize?: string | number, other_set?: Object) {
    let output = {
      status: false,
      data: null,
      background: false,
      reget: false,
      cache_key: ''
    };

    if (typeof page === 'undefined') {
        page = 1;
    }
    let sug_cache_key = [];
    sug_cache_key.push(page.toString());
    let hasSize = false;
    if (typeof pageSize !== 'undefined' && !!pageSize) {
        hasSize = true;
        sug_cache_key.push(pageSize.toString());
    }
    if (!!other_set) {
      if (other_set.hasOwnProperty('sub_key') && !!other_set['sub_key']) {
        if (typeof other_set['sub_key'] === 'string' || typeof other_set['sub_key'] === 'number') {
          sug_cache_key.push(other_set['sub_key'].toString());
        } else if (other_set['sub_key'] instanceof Array) {
          sug_cache_key.push(other_set['sub_key'].join('_'));
        }
      }
    }
    const cache_key = main_cache_key + '@' + sug_cache_key.join('_');
    const cache_check = this.checkCacheSet(option);
    if (!cache_check.reget) {
        // 背景取得，首頁請求，取cache
        const cache_data = this.load(cache_key);
        if (cache_data) {
            output.data = cache_data;
            output.status = true;
        }
    } else {
        if (hasSize) {
            this.remove(cache_key);
        } else {
            this.removeGroup(main_cache_key);
        }
    }

    output.reget = cache_check.reget;
    output.background = cache_check.background;
    output.cache_key = cache_key;
    return output;
  }


  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------


  /**
   * 儲存
   * @param key key值
   * @param value 資料
   */
  private set(key: string, data: CacheData) {
    logger.step('Cache', 'save', key, data);
    this.cache[key] = data;
  }

  /**
   * 取得資料
   * @param key key值
   * @param isCheck 是否本城市取資料使用(不console)
   */
  private get(key: string, isCheck?: boolean): CacheData {
    if (this.cache.hasOwnProperty(key)) {
      if (!isCheck) {
        logger.step('Cache', 'get', key, this.cache[key]);
      }
      return ObjectUtil.clone(this.cache[key]);
    } else {
      if (!isCheck) {
        logger.step('Cache', 'get', key, 'error(undefined)');
      }
      return undefined;
    }
  }



}
