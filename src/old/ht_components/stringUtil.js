/**
 * 字串處理用
 * 1. padLeft : 左補0
 * 2. formatDate : 日期格式化
 * 3. formatTime : 時間格式化
 * 4. getDateRange : 取得區間日期
 * 5. getPreWeek : 取得n週前日期
 * 6. getPreMonth : 取得n個月前日期
 * 7. compareDate : 比較兩個日期
 * 8. compareMonthRange : 比較兩個日期是否超過區間
 * 9. formatNum : 數字格式化
 * 10. formatAcct : 帳號格式化(4-3-n)
 */

angular.module('stringUtil', [])
.service('stringUtil', function() {
    var self = this;

    this.padLeft = function(str,lenght){
        str = str.toString();
        if(str.length >= lenght){
            return str;
        }else{
            return padLeft("0" +str,lenght);
        }
    };

    /**
     * 字串右邊補字元
     * @param {*} str 原始字串
     * @param {*} lenght 結束長度
     * @param {*} word 補上字元
     */
    this.paddingRight = function(str, lenght, word){
        if(word==null||word==''){
            word=' ';
        }
        str = str.toString();
        if(str.length >= lenght){
            return str;
        }else{
            return self.paddingRight(str+word,lenght, word);
        }
    };

    /*驗證是否為有效的身分證字號*/
        //**************************************
        // 台灣身份證檢查簡短版 for Javascript
        //**************************************
        this.isTwID = function checkTwID(id) {
            //建立字母分數陣列(A~Z)
            var city = new Array(
                1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11,
                20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30
            )
            id = id.toUpperCase();

            //送審用測試帳號
            if (id == 'F345678901') {
                return true;
            } else if (id.search(/^[A-Z](1|2)\d{8}$/i) == 0) {
                // 使用「正規表達式」檢驗格式:本國人
                //將字串分割為陣列(IE必需這麼做才不會出錯)
                id = id.split('');
                //計算總分
                var total = city[id[0].charCodeAt(0) - 65];
                for (var i = 1; i <= 8; i++) {
                    total += eval(id[i]) * (9 - i);
                }
                //補上檢查碼(最後一碼)
                total += eval(id[9]);
                //檢查比對碼(餘數應為0);
                return ((total % 10 == 0));
            } else if (id.search(/^[a-zA-Z]{1}[a-dA-D1-2]{1}[0-9]{8}$/) == 0) {
                // 使用「正規表達式」檢驗格式:外國人
                var id_ = id;
                var sum = 0;
                var str1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                var str2 = "1011121314151617341819202122352324252627282932303133";
                var t1 = str2.substr(str1.indexOf(id_.substr(0, 1)) * 2, 2);
                var t2 = str2.substr(str1.indexOf(id_.substr(1, 1)) * 2, 2);

                sum = t1.substr(0, 1) * 1 + t1.substr(1, 1) * 9;
                sum += (t2 % 10) * 8;

                var t10 = id_.substr(9, 1);

                for (t_i = 3; t_i <= 9; t_i++) {
                    sum += id_.substr(t_i - 1, 1) * (10 - t_i);
                }

                (sum % 10 == 0) ? t10_ = 0: t10_ = 10 - (sum % 10);

                return (t10_ == t10) ? true : false;
            } else {
                return false;
            }
        }

    /*驗證是否為中文字或英數字*/
    this.checkChineseNumEng=function (nickname) {
        if(!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(nickname)){
            return false;
        }
        return true;
    }

    /*驗證密碼是否為連續數字(全部連續)或重複數字(全部重複)且須為數字且在6~12位數*/
    this.checkPwdIsSeriesNumber=function (pwd) {
        if(isNaN(pwd)){
            return true;
        }
        if(pwd.length<6||pwd.length>12){
            return true;
        }
        if (/^(\d)\1+$/.test(pwd)) return true;

        var str = pwd.replace(/\d/g, function($0, pos) {
            return parseInt($0)-pos;
        });
        if (/^(\d)\1+$/.test(str)) return true;
        str = pwd.replace(/\d/g, function($0, pos) {
            return parseInt($0)+pos;
        });
        if (/^(\d)\1+$/.test(str)) return true;


        return false;

    }
    /**
     * 將來源字串轉為yyyy/MM/dd型態
     * srcDate: 來源字串
     * type: 字串類型
     *
     */
    this.formatDate = function (srcDate){
        var rtnDate = '';
        if (srcDate == null || srcDate === '') {
            return rtnDate;
        }

        if (srcDate instanceof Date) {
            rtnDate = srcDate.getFullYear()+"/"
                +this.padLeft(srcDate.getMonth()+1,2)
                +"/"+this.padLeft(srcDate.getDate(),2);
            return rtnDate;
        }


        //yyyMMdd -> yyy/MM/dd
        if (srcDate.length == 7) {
            var pattern1 = /(\d{3})(\d{2})(\d{2})/;
            rtnDate = srcDate.replace(pattern1, '$1/$2/$3');
        //yyyyMMdd-> yyy/MM/dd
        } else if (srcDate.length == 8) {
            var pattern2 = /(\d{4})(\d{2})(\d{2})/;
            rtnDate = srcDate.replace(pattern2, '$1/$2/$3');
        //yyyMMddHHmmss -> yyy/MM/dd HH:mm:ss
        }else if(srcDate.length == 13){
            var pattern3 = /(\d{3})(\d{2})(\d{2})/;
            var pattern4 = /(\d{2})(\d{2})(\d{2})/;
            rtnDate = srcDate.substring(0, 7).replace(pattern3, '$1/$2/$3')
                + srcDate.substring(7).replace(pattern4, ' $1:$2:$3');
        //yyyyMMddHHmmss -> yyyy/MM/dd HH:mm:ss
        }else if(srcDate.length == 14){
            var pattern3 = /(\d{4})(\d{2})(\d{2})/;
            var pattern4 = /(\d{2})(\d{2})(\d{2})/;
            rtnDate = srcDate.substring(0, 8).replace(pattern3, '$1/$2/$3')
                + srcDate.substring(8).replace(pattern4, ' $1:$2:$3');
        // yyyyMMddHHmmSSsss(header用)
        } else if (srcDate.length === 17) {
            var pattern5 = /(\d{4})(\d{2})(\d{2})/;
            var pattern6 = /(\d{2})(\d{2})(\d{2})/;
            rtnDate = srcDate.substring(0, 8).replace(pattern5, '$1/$2/$3')
                + srcDate.substring(8, 14).replace(pattern6, ' $1:$2:$3');
        }
        return rtnDate;
    };

    /**
     * 將來源字串轉為hh:MM:ss型態
     * srcDate: 來源字串
     * type: 字串類型
     *
     */
    this.formatTime = function(srcTime){
        var rtnTime = '';
        if(srcTime.length === 6){
            rtnTime = srcTime.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
        }else if(srcTime.length === 9){
            rtnTime = srcTime.replace(/(\d{2})(\d{2})(\d{2})(\d{3})/, '$1:$2:$3.$4');
        }
        return rtnTime;
    };

	/**
     * getDateRange(取得區間日期)
     * srcDate: new Date();
     * dateCount: ex. 3:三日後, -7:7日前
     *
     * return yyyyMMdd
     * **/
	this.getDateRange = function (srcDate, dateCount){
		var fromDay = Date.parse(srcDate);
        var count = (60*60*24*1000)*parseInt(dateCount);
        return this.format2yyyyMMdd(this.formatDate(new Date((fromDay + count))));
	};

    this.getYesterday = function(){
        var today = new Date();
        return new Date(today.getFullYear(),today.getMonth(),today.getDate()-1,0,0,0);
    };

    /**
     * 取得n週前日期(yyyy/MM/dd)
     * srcDate : Date型態，基準日
     * weekCount : n週前
     */
    this.getPreWeek = function(srcDate, weekCount){
        var rtnDate = '';
        if(srcDate instanceof Date){
            // var srcTime = Date.parse(srcDate);
            // var sDate = new Date(srcTime);
            var sDate = angular.copy(srcDate);
            // rtnDate = this.formatDate(this.getDateRange(sDate, -7*parseInt(weekCount)));
            rtnDate = this.getDateRange(sDate, -7*parseInt(weekCount));
        }
        return rtnDate;
    };

    /**
     * 取得n個月前日期
     * srcDate : Date型態，基準日
     * monthCount : n個月前
     */
    this.getPreMonth = function(srcDate, monthCount){
        var rtnDate = '';
        if(srcDate instanceof Date){
            //var srcTime = Date.parse(srcDate);
            // var sDate = new Date(srcTime);
            var sDate = angular.copy(srcDate);
            var dateCount = 0;
            for(var i=0; i<parseInt(monthCount); i++){
                var newDate = new Date(sDate.setDate(0));
                dateCount += newDate.getDate();
            }
            rtnDate = this.getDateRange(srcDate, 0-dateCount);
        }
        return rtnDate;
    };


    /**
     * 比較兩個日期
     * startDate : yyyy/MM/dd字串
     * endDate : yyyy/MM/dd字串
     *
     * return 1 : endDate晚於startDate
     *        0 : endDate等於startDate
     *       -1 : endDate早於startDate
     */
    this.compareDate = function(startDate, endDate){
        var fd = Date.parse(new Date(startDate));
        var ed = Date.parse(new Date(endDate));

        if(isNaN(fd)||isNaN(ed)){
            return null;
        }

        if(ed > fd){
            return 1;
        }else if(ed == fd){
            return 0;
        }else{
            return -1;
        }
    };

    this.compareDateRange = function(startDate, endDate, dateCount){
        var fd = Date.parse(new Date(startDate));
        var edDate = new Date(endDate);
        if(isNaN(fd)||isNaN(Date.parse(edDate))){
            return null;
        }
        // var edDateType = this.getDateRange(edDate,-180);
        var edDateType = this.getDateRange(edDate,dateCount);
        var beforeTime = Date.parse(edDateType);
        return (fd<beforeTime);

    };
    /**
     * 比較兩個日期是否超過輸入區間(n個月)
     * startDate : yyyy/MM/dd字串
     * endDate : yyyy/MM/dd字串
     * range : n個月
     * return true 超過區間
     *        false 沒超過
     */
    this.compareMonthRange = function(startDate, endDate, monthCount){

        var fd = Date.parse(new Date(startDate));
        var edDate = new Date(endDate);

        if(isNaN(fd)||isNaN(Date.parse(edDate))){
            return null;
        }

        var before = this.getPreMonth(edDate, monthCount);
        var beforeTime = Date.parse(before);

        return (fd < beforeTime);
    };

    /**
     * 取得n年前時間
     * @param srcDate
     * @param yearCount
     * @returns
     */
    this.getPreYear = function(srcDate, yearCount){
        var rtnDate = '';
        if(srcDate instanceof Date){
            // var srcTime = Date.parse(srcDate);
            // var sDate = new Date(srcTime);
            var sDate = angular.copy(srcDate);
            var year = sDate.getFullYear();

            sDate.setFullYear(year - parseInt(yearCount));
            rtnDate = this.formatDate(sDate);
        }
        return rtnDate;
    };

    /**
     * yyyy/MM/dd -> yyyyMMdd
     */
    this.format2yyyyMMdd = function(srcDate){
        var rtnDate = '';

        if (srcDate instanceof Date) {
            var year = srcDate.getFullYear().toString();
            var month = this.padLeft(srcDate.getMonth()+1, 2);
            var date = this.padLeft(srcDate.getDate(),2);

            rtnDate = year + month + date;
            return rtnDate;
        }

        if(srcDate != null && srcDate !==''){
            rtnDate = srcDate.replace(/\//g,'');
            return rtnDate;
        }
        return rtnDate;
    };

    /**
     * 數字格式化 ex: 123456 -> 123,456
     */
    this.formatNum = function( n ){
        return String(n).replace(/(.)(?=(\d{3})+$)/g,'$1,');
    };

    /**
     * 去掉前面的零，數字格式化 ex: 123456 -> 123,456
     */
    this.formatNum11 = function( n ){
        return String(n).replace(/\b(0+)/gi,"").replace(/(.)(?=(\d{3})+$)/g,'$1,');
    };

    /**
     * 銀行帳號格式化 ex:11112223333 -> 1111-222-3333
     */
    this.formatAcct = function( acct ){
        acct = acct.toString();
        if(acct!=null && typeof(acct)=='string' && acct.length >7){
            return acct.substring(0,4)+'-'+acct.substring(4,7)+'-'+acct.substring(7);
        }else if(acct!=null && typeof(acct)=='string' && acct.length >4){
            return acct.substring(0,4)+'-'+acct.substring(4,7);
        }else{
            return acct;
        }
    };

    this.formatAcct11 = function( acct ){
        acct = acct.toString();
        if(acct!=null && typeof(acct)=='string' && acct.length >7){
            return acct.substring(0,4)+'-'+acct.substring(4,8)+'-'+acct.substring(8,12)+'-'+acct.substring(12);
        }else{
            return acct;
        }
    };

    // 帳號模糊化 ex:"0560-***-***456"
    this.hideAcctInfo = function( acct ){
        acct = acct.toString();
        if(acct!=null && typeof(acct)=='string'){
            return acct.substr(0,5) + '***-***' + acct.substr(12);
        }else{
            return acct;
        }
    };

    
});
