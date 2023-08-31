/**
 * formate Module: View (html,css..)
 * 幣別與國旗
 */
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// == 幣別與國旗常用pipe == //
import {
    IconFlagPipe,
    CurrencyNamePipe
} from './flag-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    IconFlagPipe,
    CurrencyNamePipe
];


@NgModule({
    imports: [
      TranslateModule
    ],
    exports: [
        ...PipeList
    ],
    declarations: [
        ...PipeList
    ],
    providers: []
})
export class FlagFormateModule { }
