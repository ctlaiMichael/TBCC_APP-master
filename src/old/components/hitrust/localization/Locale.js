define(['framework'], function(framework){

    function Locale() {
        this.setLocale(this.get_browser_language());
    }

    Locale.prototype.setLocale = function(lang) {
        //var xml = framework.loadXMLDocFromFile('com/hitrust/localization/locale_' + lang + '.xml');
        //var json = framework.convertXml2JSon(xml);

        this.locale = "";
    };

    Locale.prototype.getLocale = function() {
        return this.locale;
    };

    Locale.prototype.get_browser_language = function() {
        var locale = navigator.userAgent.match(/[a-z]{2}-[a-z]{2}/); //because Android navigator.language always returns 'en'
        if (locale) {locale = locale[0]}
        locale = locale || navigator.language;
        //alert(locale);
        var chinese = locale.split("-")[1];

        if (chinese === 'tw')
            return 'tw';
        if (chinese === 'TW')
            return 'tw';
        if (chinese === 'cn')
            return 'cn';
        if (chinese === 'CN')
            return 'cn';
        return locale.split("-")[0];
    };

    return new Locale();
} );
