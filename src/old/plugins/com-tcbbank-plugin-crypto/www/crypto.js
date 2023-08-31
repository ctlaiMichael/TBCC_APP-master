cordova.define("com-tcbbank-plugin-crypto.crypto", function(require, exports, module) {
/*!
 * Module dependencies.
 */

var exec = cordova.require('cordova/exec');

var CryptoAPIs = function() {};

CryptoAPIs.prototype.InitPhoneData = function(deviceInfo, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "InitPhoneData", [deviceInfo]);
};

CryptoAPIs.prototype.GetServerToken = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "GetServerToken", []);
};

CryptoAPIs.prototype.GenerateSessionID = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "GenerateSessionID", []);
};

CryptoAPIs.prototype.Handshake = function(obj, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "Handshake", [obj]);
};


CryptoAPIs.prototype.ExchangeKey = function(PublicKey, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "ExchangeKey", [PublicKey]);
};

CryptoAPIs.prototype.ExchangeKeyEx = function(successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "ExchangeKeyEx", []);
};


CryptoAPIs.prototype.RSA_Encrypt = function(pubkey, text, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "RSA_Encrypt", [pubkey, text]);
};

CryptoAPIs.prototype.RSA_EncryptEx = function(text, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "RSA_EncryptEx", [text]);
};

CryptoAPIs.prototype.MD5 = function(text, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "MD5", [text]);
};

CryptoAPIs.prototype.SHA1 = function(text, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "SHA1", [text]);
};

CryptoAPIs.prototype.SHA256 = function(text, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "SHA256", [text]);
};

CryptoAPIs.prototype.AES_Encrypt = function(keyLabel, text, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "AES_Encrypt", [keyLabel, text]);
};

CryptoAPIs.prototype.AES_Decrypt = function(keyLabel, text, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "AES_Decrypt", [keyLabel, text]);
};

CryptoAPIs.prototype.SaveDecryptedFile = function(version, src, dist, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "SaveDecryptedFile", [version, src, dist]);
};

//new for postoffice
CryptoAPIs.prototype.Base64Encode = function(text, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "Base64Encode", [text]);
};

//new for postoffice
CryptoAPIs.prototype.Base64Decode = function(base64Text, successCallback, errorCallback){
    exec(successCallback, errorCallback, "Crypto", "Base64Decode", [base64Text]);
};

module.exports = new CryptoAPIs();


});
