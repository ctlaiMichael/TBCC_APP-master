/**
 * 轉換程式
 */
function transStr(set_data: Array<any>, type?: string): Array<any> {
    let output = [];
    let do_lower = false;
    let do_upper = false;
    if (type == 'lower') {
        do_lower = true;
    } else if (type == 'upper') {
        do_upper = true;
    }
    set_data.forEach(item => {
        let set_str = item;
        if (typeof item != 'object') {
            if (do_lower) {
                set_str = set_str.toString().toLocaleLowerCase();
            } else if (do_upper) {
                set_str = set_str.toString().toLocaleUpperCase();
            }
        }
        output.push(set_str);
    });
    return output;
}

/**
 * 生物辨識不允許清單設定
 */
export const BioDisAllowUserAgent: Array<any> = transStr([
    // 'SM-S10',
    // 'SM-Note10',
    // 'SM-G97', // (S10e)
    // 'SM-N97',
    // // Japanese models:
    // 'SCV41', // (au, S10)
    // 'SC-03L', // (NTT Docomo, S10)
    // 'SCV42', // (au, S10+)
    // 'SC-04L', // (NTT Docomo, S10+)
    // 'SC-05L' // (NTT Docomo, S10+ Olympic Games Edition)
], 'lower');
