var KnownLabel = require("./known-label");

// Could not find respective constants for these???
var HOME_FAX = "_$!<HomeFAX>!$_";
var WORK_FAX = "_$!<WorkFAX>!$_";
var MAIN = "_$!<Main>!$_";

exports.getiOSValue = function(key, contactData){
    return contactData.isKeyAvailable(key) ? contactData[key] : "";
};

exports.getGenericLabel = function (nativeLabel) {
    var genericLabel = nativeLabel;
  
    switch (nativeLabel) {
        case CNLabelHome:
            genericLabel = KnownLabel.HOME;
            break;
        case CNLabelWork:
            genericLabel = KnownLabel.WORK;
            break;
        case CNLabelOther:
            genericLabel = KnownLabel.OTHER;
            break;
    };
  
    return genericLabel;  
};

exports.getNativeGenericLabel = function (label) {
    var nativeGenericLabel = label;
    
    switch (label) {
        case KnownLabel.HOME:
            nativeGenericLabel = CNLabelHome;
            break;
        case KnownLabel.WORK:
            nativeGenericLabel = CNLabelWork;
            break;
        case KnownLabel.OTHER:
            nativeGenericLabel = CNLabelOther;
            break;
    };
    
    return nativeGenericLabel;
};

exports.getPhoneLabel = function (nativeLabel) {
    var phoneLabel = exports.getGenericLabel(nativeLabel);
  
    switch (nativeLabel) {
        case kABPersonPhoneMobileLabel:
            phoneLabel = KnownLabel.MOBILE;
            break;
        case HOME_FAX:
            phoneLabel = KnownLabel.FAX_HOME;
            break;
        case WORK_FAX:
            phoneLabel = KnownLabel.FAX_WORK;
            break;
        case kABPersonPhonePagerLabel:
            phoneLabel = KnownLabel.PAGER;
            break;
        case MAIN:
            phoneLabel = KnownLabel.MAIN;
            break;
    };
  
    return phoneLabel;  
};

exports.getNativePhoneLabel = function (label) {
    var nativePhoneLabel = exports.getNativeGenericLabel(label);
    
    switch (label) {
        case KnownLabel.MOBILE:
            nativePhoneLabel = kABPersonPhoneMobileLabel;
            break;
        case KnownLabel.FAX_HOME:
            nativePhoneLabel = HOME_FAX;
            break;
        case KnownLabel.FAX_WORK:
            nativePhoneLabel = WORK_FAX;
            break;
        case KnownLabel.PAGER:
            nativePhoneLabel = kABPersonPhonePagerLabel;
            break;
        case KnownLabel.MAIN:
            nativePhoneLabel = MAIN;
            break;
    };
    
    return nativePhoneLabel;
};

exports.getWebsiteLabel = function (nativeLabel) {
    var phoneLabel = exports.getGenericLabel(nativeLabel);
  
    switch (nativeLabel) {
        case CNLabelURLAddressHomePage:
            phoneLabel = KnownLabel.HOMEPAGE;
            break;
    };
  
    return phoneLabel;  
};

exports.getNativeWebsiteLabel = function (label) {
    var nativeWebsiteLabel = exports.getNativeGenericLabel(label);
    
    switch (label) {
        case KnownLabel.HOMEPAGE:
            nativeWebsiteLabel = CNLabelURLAddressHomePage;
            break;
    };
    
    return nativeWebsiteLabel;
};