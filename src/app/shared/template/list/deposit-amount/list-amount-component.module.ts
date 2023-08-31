/**
 * 存款帳戶資訊顯示
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@shared/formate/formate.module';
import { ListAmountDirective } from './list-amount.directive';
// == 其他template清單 == //
const TemplateList = [
    ListAmountDirective
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        FormateModule
    ],
    exports: [
        ...TemplateList
    ],
    declarations: [
        ...TemplateList
    ],
    providers: [
    ]
})
export class ListAmountComponentModule { }
