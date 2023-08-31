import { environment } from 'environments/environment';
const loggerLevel = {
    'OFF': 0,
    'ERROR': 1,
    'WARN': 2,
    'INFO': 3,
    'DEBUG': 4,
    'LOG': 5
};
let loggerLevelList: any = [];
let showLoggerLevel: any = 'OFF';
if (Object.prototype.toString.call( environment.LOG_LEVEL ) === '[object Array]') {
    // 多種情況console
    loggerLevelList = environment.LOG_LEVEL;
    let tmp_logger_level = 0;
    loggerLevelList.forEach((tmp_key) => {
        if (loggerLevel.hasOwnProperty(tmp_key) && tmp_logger_level < loggerLevel[tmp_key]) {
            tmp_logger_level = loggerLevel[tmp_key];
            showLoggerLevel = tmp_key;
        }
    });
} else {
    // 依照環境變數設定決定logger啟用狀態
    showLoggerLevel = environment.LOG_LEVEL;
    loggerLevelList = [showLoggerLevel];
}
const loggerStatus = loggerLevel[showLoggerLevel];
const checkIsEnabled = (type: string) => {
    const log_status = loggerLevel[type]; // 預設OFF
    return (loggerStatus >= log_status) ? true : false;
};

export const logger = {
    /**
     * LOG
     * @param message 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.log('TEST', obj1, obj2);
     */
    log(message?: any, ...optionalParams: any[]) {
        if (checkIsEnabled('LOG')) {
            console.log.apply(console, arguments);
        }
    },

    /**
     * DEBUG
     * @param message 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.debug('TEST', obj1, obj2);
     */
    debug(message?: any, ...optionalParams: any[]) {
        if (checkIsEnabled('DEBUG')) {
            console.log.apply(console, arguments);
        }
    },

    /**
     * INFO
     * @param message 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.info('TEST', obj1, obj2);
     */
    info(message?: any, ...optionalParams: any[]) {
        if (checkIsEnabled('INFO')) {
            console.info.apply(console, arguments);
        }
    },

    /**
     * WARN
     * @param message 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.warn('TEST', obj1, obj2);
     */
    warn(message?: any, ...optionalParams: any[]) {
        if (checkIsEnabled('WARN')) {
            console.warn.apply(console, arguments);
        }
    },


    /**
     * ERROR
     * @param message 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.error('TEST', obj1, obj2);
     */
    error(message?: any, ...optionalParams: any[]) {
        if (checkIsEnabled('ERROR')) {
            console.error.apply(console, arguments);
        }
    },


    /**
     * step 檢查階層(特殊模式)
     * @param chek_step 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.log('TEST', obj1, obj2);
     */
    step(chek_step?: any, ...optionalParams: any[]) {
        if (showLoggerLevel === chek_step || loggerLevelList.indexOf(chek_step) > -1) {
            console.log.apply(console, arguments);
        }
    }
};
