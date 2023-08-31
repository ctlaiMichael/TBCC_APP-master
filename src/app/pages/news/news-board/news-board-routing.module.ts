/**
 * Route定義
 * 最新消息
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsBoardComponent } from './news-board.component';
import { NewsBoardContentComponent } from './news-board-content/news-board-content.component';
// == Route 設定 == //
const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    // 最新消息列表
    {path: 'list', component: NewsBoardComponent, data: {}},
    // 最新消息內文 (req: { news: '' })
    {path: 'content', component: NewsBoardContentComponent
        , data: {}
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsBoardRoutingModule {
    constructor(
    ) {
    }
}
