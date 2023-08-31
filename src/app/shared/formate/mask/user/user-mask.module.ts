/**
 * formate mask Module: User
 * 常用的formate方法與pipe
 */
import { NgModule } from '@angular/core';
import {
    IdentityMaskPipe
    , EmailMaskPipe
    , TelMaskPipe
    , PhoneMaskPipe,
    AcntNameMaskPipe
} from './user-mask.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    IdentityMaskPipe
    , EmailMaskPipe
    , TelMaskPipe
    , PhoneMaskPipe
    , AcntNameMaskPipe
];


@NgModule({
    exports: [
        ...PipeList
    ],
    declarations: [
        ...PipeList
    ],
    providers: []
})
export class UserMaskModule { }
