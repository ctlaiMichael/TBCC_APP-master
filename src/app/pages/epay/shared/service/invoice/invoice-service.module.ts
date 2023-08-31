/**
 * 雲端發票-Service Module
 */
import { NgModule } from '@angular/core';
// ---------------- Service Start ---------------- //
import { InvoiceService } from './invoice.service';

// ---------------- API Start ---------------- //
import { FQ000101ApiService } from '@api/fq/fq000101/fq000101-api.service';

import { FQ000305ApiService } from '@api/fq/fq000305/fq000305-api.service';
import { FQ000406ApiService } from '@api/fq/fq000406/fq000406-api.service';

import { FQ000301ApiService } from '@api/fq/fq000301/fq000301-api.service';
import { FQ000403ApiService } from '@api/fq/fq000403/fq000403-api.service';
import { FQ000401ApiService } from '@api/fq/fq000401/fq000401-api.service';
import { FQ000405ApiService } from '@api/fq/fq000405/fq000405-api.service';

/**
 * 清單
 */
const ServiceList = [
    InvoiceService
    , FQ000101ApiService // QR Code轉出帳號查詢
    , FQ000305ApiService // 愛心碼登錄
    , FQ000406ApiService // 愛心碼查詢
    , FQ000301ApiService // 手機載具註冊
    , FQ000403ApiService // 手機條碼查詢
    , FQ000401ApiService // 手機條碼註冊
    , FQ000405ApiService // 忘記手機條碼驗證碼
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
export class InvoiceServiceModule { }
