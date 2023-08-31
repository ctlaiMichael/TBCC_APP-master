# MobileStartup

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.10.

## 檔案結構

- app
    - base          基礎共用元件(提供繼承)
        - controllers
        - models
        - services
    - conf          [選單/條款/回應訊息]設定
        - mneu
        - response
        - terms
    - core          啟動時載入全域共用模組(只在app.module載入)
        - service   共用Service
    - lib           其他[修改過第三方套件/plugin]共用模組(需要時import)
        - plugin    Cordova Plugin介接
    - pages         各功能畫面
    - shared        共用模組(非啟動必須，需要時import)
        - component
        - directive
        - service
    - simulation    模擬電文模組
    - telegram      電文模組
- assets
    - lib   外部引用js
    - ui    UI圖檔/css目關內容
    - i18n  多語系設定
        - zh-tw.json
        - en.json
- enviroments
    - environment.prod.ts
    - environment.dev.ts

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

