/**
 * formate Module: Date
 * 常用的formate方法與pipe
 */
import { NgModule } from '@angular/core';
import {
  LastTranTypePipe
    , BranchNamePipe
  , AcctTypeNamePipe
  , AcctTypeNickNamePipe
  , RateTypeNamePipe
} from './deposit.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    LastTranTypePipe
    , BranchNamePipe
    , AcctTypeNamePipe
    , AcctTypeNickNamePipe
    , RateTypeNamePipe
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
export class DepositMaskModule { }
