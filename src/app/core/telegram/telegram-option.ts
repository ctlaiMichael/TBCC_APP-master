/**
 * API 發送選項
 * @param header 自定Header
 * @param background 背景執行
 * @param simOpt 模擬選項
 */
import { ReqHeader } from '@base/api/model/req-header';
import { CacheData } from '@core/system/cache/cache-data';

export class TelegramOption {
    header?: ReqHeader;
    background?: boolean;
    simOpt?: string;
    useCache?: boolean;
    cacheOpt?: CacheData;
}
