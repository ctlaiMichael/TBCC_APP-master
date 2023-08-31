/**
 * formate Module: String
 * Fund使用的pipe
 */
import { NgModule } from '@angular/core';
import { FundFormateService } from './fund-formate.service';
// == fund常用pipe == //
import {
    FundAmtClassPipe
} from './fund-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    FundAmtClassPipe
];


@NgModule({
    exports: [
        ...PipeList
    ],
    declarations: [
        ...PipeList
    ],
    providers: [
        FundFormateService
    ]
})
export class FundFormateModule { }
