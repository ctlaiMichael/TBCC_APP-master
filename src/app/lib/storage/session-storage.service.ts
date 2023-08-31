import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorageService {

    /**
    * 參數設定
    */
    private isHaveSessionStorage = false;
    constructor() {
        if (typeof window.sessionStorage !== 'undefined') {
            this.isHaveSessionStorage = true;
        }
    }

    /**
       * 取得自儲存於app的cache (刪掉重置)
       * @param key 查詢變數
       */
    public get(key: string) {
        let data;
        if (this.isHaveSessionStorage) {
            data = window.sessionStorage.getItem(key);
            if (!data && typeof data === 'undefined') {
                // console.error('[ERROR] Miss local Storage:', key, data);
                data = false;
            }
        }
        return data;
    }

    /**
     * 儲存於app的cache(刪掉重置)
     * @param key 儲存變數
     * @param value 儲存值
     */
    public set(key: string, value: string) {
        if (this.isHaveSessionStorage) {
            window.sessionStorage.setItem(key, value);
        }
    }

    /**
     * 刪除於app的cache(刪掉重置)
     * @param key 刪除變數
     */
    public remove(key: string) {
        let success = false;
        if (!this.get(key)) {
            success = false;
        } else {
            if (this.isHaveSessionStorage) {
                // logger.debug('[INFO] remove App storage:', key);
                // window.sessionStorage.removeItem(key);
                // 改用delete比較即時
                delete sessionStorage[key];
                success = true;
            }
        }
        return success;
    }

    /**
     * 儲存物件
     * @param key 儲存變數
     * @param value 儲存值
     */
    public setObj(key: string, value: any) {
        const str = JSON.stringify(value);
        this.set(key, str);
    }

    /**
     * 取得物件
     * @param key 儲存變數
     */
    public getObj(key) {
        const data = this.get(key);
        if (data) {
            return JSON.parse(data);
        } else {
            return null;
        }
    }

}
