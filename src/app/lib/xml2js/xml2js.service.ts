import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var require: any;

@Injectable()
export class XML2JSService {

    constructor(private http: HttpClient) { }

    /**
     * 轉換xml > json
     * @param filePath 檔案路徑
     */
    getXmlFile(xmlFilePath: string): Promise<any> {
        // if (environment.NATIVE) {
            return new Promise((resolve, reject) => {
                const headers = new HttpHeaders({ 'Content-Type': 'text/xml' }).set('Accept', 'text/xml');
                this.http.get(xmlFilePath, { headers: headers, responseType: 'text' })
                .subscribe((xmlData: any) => {
                    // logger.debug('XML2JSService xml file:' + xmlData);
                    let parseString = require('xml2js').parseString;
                    parseString(xmlData, function (err, resultJson) {
                        // logger.debug('XML2JSService json file:' + JSON.stringify(resultJson));
                        resolve(resultJson);
                    });
                });
            });
        // } else {
        //     return new Promise((resolve, reject) => {
        //         const returnData = { 'xml2js': 'Hi' };
        //         resolve(returnData);
        //     });
        // }
    }

}
