import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {


    /**
     * 參數設定
     */
    private isHaveStorage = false;

    constructor() {
        if (typeof window.localStorage !== 'undefined') {
            this.isHaveStorage = true;
        }
    }



    /**
     * 取得自儲存於app的cache (刪掉重置)
     * @param key 查詢變數
     */
    public get(key: string) {
        let data;
        if (this.isHaveStorage) {
            data = window.localStorage.getItem(key);
            if (!data && typeof data === 'undefined') {
                // console.error('[ERROR] Miss local Storage:', key, data);
                data = false;
            }
        } else {
            data = this.getCookie(key);
        }
        return data;
    }

    /**
     * 儲存於app的cache(刪掉重置)
     * @param key 儲存變數
     * @param value 儲存值
     */
    public set(key: string, value: string) {
        // logger.debug('[INFO] Set App storage:', key, value);
        if (this.isHaveStorage) {
            window.localStorage.setItem(key, value);
        } else {
            const expire = 24 * 60 * 60 * 1000 * 31 * 12;
            this.setCookie(key, value, expire);
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
            if (this.isHaveStorage) {
                // logger.debug('[INFO] remove App storage:', key);
                window.localStorage.removeItem(key);
                success = true;
            } else {
                success = this.removeCookie(key);
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

    /**
     * Cookie set
     * @param key
     * @param value
     * @param exdays
     */
    public setCookie(key: string, value: string, exdays: number) {
        // logger.debug('[INFO] Set cookie:', key);
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 1000));
        const expires = 'expires=' + d['toGMTString']() + ';';
        const path = '/';
        const pathSet = 'path=' + path + ';';
        const domain = '/';
        const domainSet = 'domain=' + domain + ';';
        document.cookie = key + '=' + value + '; ' + expires + pathSet + domainSet;
    }


    /**
     * 取得cookie
     * @param key
     */
    public getCookie(key: string) {
        let data = '';
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(key + '=');
            if (document.cookie.indexOf(key + '=') > -1) {
                c_start = c_start + key.length + 1;
                let c_end = document.cookie.indexOf(';', c_start);
                if (c_end < 0) {
                    c_end = document.cookie.length;
                }
                data = document.cookie.slice(c_start, c_end);
            }
        }
        return data;
    }


    public removeCookie(key: string) {
        let success = false;
        if (!this.getCookie(key)) {
            success = false;
        } else {
            // logger.debug('[INFO] remove cookie:', key);
            this.setCookie(key, '', -1);
            success = true;
        }
        return success;
    }



}
