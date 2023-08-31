import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { TelegramOption } from '@core/telegram/telegram-option';
import { HandshakeTelegramService } from '@core/telegram/handshake-telegram.service';


/**
 * Form上行Send格式
 * Response下行Response格式
 */
export class HandshakeApiBase<Request, Response> {

    /**
     * 建構
     * @param telegram 電文Service
     * @param apiUrl api位置
     */
    constructor(protected telegram: HandshakeTelegramService<Response>, protected apiUrl?: string) {
        // apiUrl 若為共用則不用帶入在此直接設定
        if (!apiUrl) {
            // this.apiUrl = environment.API_URL;
            apiUrl = environment.API_URL;
        }
    }

    // send(data: Request, option?: TelegramOption): Observable<Response> {
    //     return this.telegram.send(this.apiUrl, data, option);
    // }
    send(apiUrl:string, data: Request, option?: TelegramOption): Promise<Response> {
        return this.telegram.send(apiUrl, data, option);
    }
}
