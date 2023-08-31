/**
 * Sqlite DB 設定介面
 */
export class DatebaseOption {
    name: string;
    location: string;
    androidDatabaseProvider: string;

    constructor() {
        this.location = 'default';
        this.androidDatabaseProvider = 'system';
    }
}


