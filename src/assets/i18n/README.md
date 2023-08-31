#語系檔建立
    - 各語系應同時建立對應語系統
    - 新增語系統後需在conf\i18n-path.ts中加入對映語系檔名稱 ex {prefix: i18nFolder, suffix: '/popup.json'},

#View上使用方法
    {{ ‘BTN.CHECK’ | translate}}

#Component或service使用方法

    private translate: TranslateService
    let get_i18n_str: string;
    this.translate.get(‘BTN.CHECK’).subscribe((val) => get_i18n_str = val);


