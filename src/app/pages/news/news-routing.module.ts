import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsMenuComponent } from '@pages/news/news-menu/news-menu.component';

// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  // 最新消息選單
  { path: 'menu', component: NewsMenuComponent
    , data: {}
  },
  // 最新消息
  { path: 'news-board', loadChildren: './news-board/news-board.module#NewsBoardModule'
    , data: {
      preload: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
