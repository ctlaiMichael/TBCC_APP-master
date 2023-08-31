/**
 * Util 空白轉換
 */
export const EmptyUtil = {
    /**
     * 整合trim
     * @param value 原字串
     * @param type 去除空白方式 left/right/all/spe/default 去除前後空白
     */
    done(value: string|number, type?: string): any {
        let output = value.toString();
        switch (type) {
            case 'left': // 去左
                output = this.trimLeft(output);
                break;
            case 'right': // 去右
                output = this.trimRight(output);
                break;
            case 'all': // 去全
                output = this.trimAll(output);
                break;
            case 'spe': // 去多餘空白
                output = this.trimMoreSpe(output);
                break;
            default:
                output = this.trim(output);
                break;
        }
        return output;
    },
    /**
     * 去除前後空白
     * @param value 字串
     * @param trans 取代的值
     * EmptyUtil.trim(' 　  Hellow Word! 　  '); // "Hellow Word!"
     * EmptyUtil.trim(' 　  Hellow Word! 　  ', 's'); // "sssHellow Word!sss"
     */
    trim(value: string, trans?: string): string {
        if (typeof trans === 'undefined') {
            trans = ''; // 預設為空
        }
        let output_data = value;
        if (trans === '') {
            output_data = value.trim();
        }
        output_data = output_data.replace(/^(\r|\n|\r\n|\s|\t|[　])+|(\r|\n|\r\n|\s|\t|[　])+$/gm, trans);
        return output_data;
    },
    /**
     * 去除左空白
     * @param value 字串
     * @param trans 取代的值
     * EmptyUtil.trimLeft(' 　  Hellow Word! 　  '); // "Hellow Word! 　  "
     * EmptyUtil.trimLeft(' 　  Hellow Word! 　  ', 's'); // "sssHellow Word! 　  "
     */
    trimLeft(value: string, trans?: string): string {
        if (typeof trans === 'undefined') {
            trans = ''; // 預設為空
        }
        return value.replace(/^(\r|\n|\r\n|\s|\t|[　])+/gm, trans);
    },
    /**
     * 去除右空白
     * @param value 字串
     * @param trans 取代的值
     * EmptyUtil.trimRight(' 　  Hellow Word! 　  '); // " 　  Hellow Word!"
     * EmptyUtil.trimRight(' 　  Hellow Word! 　  ', 's'); // " 　  Hellow Word!sss"
     */
    trimRight(value: string, trans?: string): string {
        if (typeof trans === 'undefined') {
            trans = ''; // 預設為空
        }
        return value.replace(/(\r|\n|\r\n|\s|\t|[　])+$/gm, trans);
    },
    /**
     * 去所有空白
     * @param value 字串
     * @param trans 取代的值
     * EmptyUtil.trimAll(' 　  Hellow  Word! 　  '); // "HellowWord!"
     * EmptyUtil.trimAll(' 　  Hellow  Word! 　  ', 's'); // "sssHellowssWord!sss"
     */
    trimAll(value: string, trans?: string): string {
        if (typeof trans === 'undefined') {
            trans = ''; // 預設為空
        }
        return value.replace(/(\r|\n|\r\n|\s|\t|[　])/g, trans);
    },
    /**
     * 去除多餘空白(保留單一個空白)
     * @param value 字串
     * @param trans 取代的值
     * EmptyUtil.trimMoreSpe(' 　  Hellow  Word! 　  '); // "HellowWord!"
     * EmptyUtil.trimMoreSpe(' 　  Hellow  Word! 　  ', 's'); // "sssHellowsWord!sss"
     */
    trimMoreSpe(value: string, trans?: string): string {
        if (typeof trans === 'undefined') {
            trans = ''; // 預設為空
        }
        let output = this.trim(value, trans);
        output = output.replace(/(\r|\n|\r\n|\s\s|\t|[　])/g, trans);
        return output;
    },
    /**
     * 去除段行變空白
     * @param value 字串
     * @param trans 取代的值
     */
    trimEnter(value: string, trans?: string): string {
        if (typeof trans === 'undefined') {
            trans = ' '; // 預設為空白
        }
        let output = this.trim(value, trans);
        output = output.replace(/(\r|\n|\r\n|<+(B|b)+(r|R)+(|\/)+>)/g, trans);
        return output;
    }

};
