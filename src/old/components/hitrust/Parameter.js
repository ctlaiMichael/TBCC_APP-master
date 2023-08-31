define(['x2js'], function(x2js) {
    function Parameter() {

        var xml = x2js.loadXMLDocFromFile('config');
        var json = x2js.convertXml2JSon(xml);
        this.parm = json;
        xml = x2js.loadXMLDocFromFile('about');
        this.about = x2js.convertXml2JSon(xml);

    }

    Parameter.prototype.setParameter = function(key, value) {
        this.parm.CONFIG[key] = value;
    };


    Parameter.prototype.getParameter = function(key, type) {
        if(type==='B'){
            return this.parm.CONFIG[key]==='true';
        }else if(type === 'I'){
            return parseInt(this.parm.CONFIG[key]);
        }
        return this.parm.CONFIG[key];
    };

    Parameter.prototype.getAbout = function(key, type) {
        if(type==='B'){
            return this.about.About[key]==='true';
        }else if(type === 'I'){
            return parseInt(this.about.About[key]);
        }
        return this.about.About[key];
    };

    Parameter.prototype.getXML = function(file,key, type) {
        var xml = x2js.loadXMLDocFromFile(file);
        var xmlObj = x2js.convertXml2JSon(xml);
        if(typeof xmlObj[key] === 'undefined'){
            return false;
        }
        if(type==='B'){
            return xmlObj[key]==='true';
        }else if(type === 'I'){
            return parseInt(xmlObj[key]);
        }
        return xmlObj[key];
    };

    return new Parameter();
});
