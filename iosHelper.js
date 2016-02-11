var appModule = require("application");

exports.getiOSValue = function(key, contactData){
    return contactData.isKeyAvailable(key) ? contactData[key] : "";
}

exports.getAvatar = function(contactData){
    return "IOS IMAGE";
}