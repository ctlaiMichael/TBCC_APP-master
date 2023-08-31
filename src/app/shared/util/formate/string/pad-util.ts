/**
 * Util Pad
 * 補字串
 */
export const PadUtil = {

    /**
     * 補0
     * @param str 補的字串
     * @param len 回傳資料長度
     * @param type 類別 left|right 預設為left
     */
    pad(str: string | number, len: number, type?: string, append?: string): string {
        if (typeof append === 'undefined') {
            append = '0';
        }
        if (type !== 'right') {
            return this.padLeft(str, len, append);
        } else {
            return this.padRight(str, len, append);
        }
    },

    /**
     * 補左
     * @param str 欲改變的資料 (可為string或number)
     * @param len 回傳資料長度
     * @param append 欲改變的值(預設補0)
     *  PadUtil.padLeft('abcde', 10); // 00000abcde
     *  PadUtil.padLeft('abcde', 10, 'ab'); // ababaabcde
     */
    padLeft(str: string | number, len: number, append?: string): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        if (typeof append === 'undefined') {
            append = '0';
        }

        return str.padStart(len, append);
    },

    /**
     * 補右
     * @param str 欲改變的資料 (可為string或number)
     * @param len 回傳資料長度
     * @param append 欲改變的值(預設補0)
     *  PadUtil.padRight('abcde', 10); // abcde00000
     *  PadUtil.padRight('abcde', 10, 'ab'); // abcdeababa
     */
    padRight(str: string | number, len: number, append?: string): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        if (typeof append === 'undefined') {
            append = '0';
        }

        return str.padEnd(len, append);
    }

};
