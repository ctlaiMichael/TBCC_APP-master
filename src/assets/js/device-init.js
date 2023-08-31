/**
 * 處理各版本支援js
 */
(function () {
    /**
    * 加入String支援padStart方法
    */
    if (typeof String.prototype.padStart != 'function') {
        String.prototype.padStart = function (len, append) {
            var str = new String(this);
            if (!str) {
                str = '';
            }
            if (!append) {
                append = ' ';
            }
            var i = str.length;
            for (i; i < len; i++) {
                str = append + str;
            }
            return str;
        }
    }
    /**
    * 加入String支援padEnd方法
    */
    if (typeof String.prototype.padEnd != 'function') {
        String.prototype.padEnd = function (len, append) {
            var str = new String(this);
            if (!str) {
                str = '';
            }
            if (!append) {
                append = ' ';
            }
            var i = str.length;
            for (i; i < len; i++) {
                str = str + append;
            }
            return str;
        }
    }

})();