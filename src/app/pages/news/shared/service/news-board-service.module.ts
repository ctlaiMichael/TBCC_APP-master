/**
 * 最新消息-Service Module
 */
import { NgModule } from '@angular/core';
// ---------------- Service Start ---------------- //
import { NewsBoardService } from './news-board.service';

// ---------------- API Start ---------------- //
import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';

/**
 * Pipe清單
 */
const ServiceList = [
    NewsBoardService
    , FB000501ApiService
    , FB000502ApiService
];


@NgModule({
    exports: [
    ],
    declarations: [
    ],
    providers: [
        ...ServiceList
    ]
})
export class NewsBoardServiceModule { }
