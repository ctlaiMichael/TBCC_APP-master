/**
 * Logger處理
 * LOG level: OFF > ERROR > WARN > INFO > DEBUG > LOG
 */
import { Injectable } from '@angular/core';
import { logger } from '@shared/util/log-util';
@Injectable()
export class Logger {
    private static instance: Logger; // 允許止可載入一個

    constructor() {
        return Logger.instance = Logger.instance || this;
    }

    /**
     * LOG
     * @param message 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.log('TEST', obj1, obj2);
     */
    log(message?: any, ...optionalParams: any[]) {
        logger.log(message, ...optionalParams);
    }

    /**
     * DEBUG
     * @param message 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.debug('TEST', obj1, obj2);
     */
    debug(message?: any, ...optionalParams: any[]) {
        logger.debug(message, ...optionalParams);
    }

    /**
     * INFO
     * @param message 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.info('TEST', obj1, obj2);
     */
    info(message?: any, ...optionalParams: any[]) {
        logger.info(message, ...optionalParams);
    }

    /**
     * WARN
     * @param message 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.warn('TEST', obj1, obj2);
     */
    warn(message?: any, ...optionalParams: any[]) {
        logger.warn(message, ...optionalParams);
    }

    /**
     * ERROR
     * @param message 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.error('TEST', obj1, obj2);
     */
    error(message?: any, ...optionalParams: any[]) {
        logger.error(message, ...optionalParams);
    }

    /**
     * step 檢查階層(特殊模式)
     * @param chek_step 訊息
     * @param optionalParams 更多訊息
     *  範例:
     *  this.logger.log('TEST', obj1, obj2);
     */
    step(chek_step?: any, ...optionalParams: any[]) {
        logger.step(chek_step, ...optionalParams);
    }
}
