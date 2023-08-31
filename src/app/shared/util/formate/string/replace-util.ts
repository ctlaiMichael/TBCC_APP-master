/**
 * Util Replace
 * 取代與清除特殊字元
 */
import { EmptyUtil } from '../string/empty-util';
export const ReplaceUtil = {

    /**
     * 清除基本符號:
     * @param str 處理字串
     * @param append 取代字串，預設空字串
     */
    baseSymbol(str: string, append?: string): string {
        if (typeof append === 'undefined') {
            append = '';
        }
        str = EmptyUtil.trimAll(str);
        const reg = /[\/|\-|\.|\:|\s]/g;
        return str.replace(reg, append);
    },

    /**
     * 取代字串
     * @param str 處理字串
     * @param search 搜尋資料
     * @param append 取代資料
     */
    replaceLeftStr(str: string, search?: string, append?: string): string {
        if (typeof search !== 'string') {
            search = '0';
        }
        if (typeof append !== 'string') {
            append = '';
        }
        const reg_str = '^(' + search + ')+';
        const reg = new RegExp(reg_str, 'g');
        return str.replace(reg, append);
    }

};
