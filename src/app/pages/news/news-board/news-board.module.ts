/**
 * Route定義
 * 最新消息
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NewsBoardRoutingModule } from './news-board-routing.module';

// ---------------- Pages Start ---------------- //
import { NewsBoardComponent } from './news-board.component';
import { NewsBoardPageComponent } from './news-board-pages/news-board-page.component'; // 列表分頁
import { NewsBoardContentComponent } from './news-board-content/news-board-content.component'; // 內容頁
// ---------------- Service Start ---------------- //
import { NewsBoardServiceModule } from '@pages/news/shared/service/news-board-service.module';
// ---------------- API Start ---------------- //
// ---------------- Shared Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';

@NgModule({
    imports: [
        SharedModule,
        NewsBoardRoutingModule,
        PaginatorCtrlModule,
        NewsBoardServiceModule
    ],
    providers: [
    ],
    declarations: [
        // == 列表 == //
        NewsBoardComponent,
        // == 列表-分頁 == //
        NewsBoardPageComponent,
        // == 內容頁 == //
        NewsBoardContentComponent
    ],
    // (分頁設定)
    entryComponents: [
        NewsBoardPageComponent
    ],
    exports: [
        NewsBoardPageComponent,
        NewsBoardContentComponent
    ]
})
export class NewsBoardModule {
    constructor(
    ) {
    }
}
