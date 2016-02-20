
var appModule = require("application");

/* missing constants from the {N} */
var TYPE_CUSTOM = 0;

var KnownLabel = {
    HOME: "Home",
    MOBILE: "Mobile",
    WORK: "Work",
    FAX_WORK: "Fax Work",
    FAX_HOME: "Fax Home", 
    PAGER: "Pager",
    CALLBACK: "Callback", 
    CAR: "Car",
    COMPANY_NAME: "Company Main",
    ISDN: "ISDN",
    MAIN: "Main",
    OTHER_FAX: "Other Fax",
    RADIO: "Radio",
    TELEX: "Telex",
    TTY_TDD: "TTY TDD",
    WORK_MOBILE: "Work Mobile",
    WORK_PAGER: "Work Pager",
    ASSISTANT: "Assistant",
    MMS: "MMS",
    OTHER: "Other", 
    FTP: "FTP",
    PROFILE: "Profile",
    BLOG: "Blog",
    HOMEPAGE: "Homepage"
};


//Query Sample: 
//query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder)
exports.getBasicCursor = function(uri, id){
    var contentResolver = appModule.android.context.getContentResolver(); 
    var cursor = contentResolver.query(uri, 
                                        null, 
                                        "name_raw_contact_id=" + id,
                                        null, 
                                        null);
    //cursor.moveToFirst();
    
    return cursor;
};

//projection: String[]
//parameters: String[]
exports.getComplexCursor = function(id, uri, projection, parameters){
    var contentResolver = appModule.android.context.getContentResolver(); 
    var cursor = contentResolver.query(uri, 
                                    projection, 
                                    "name_raw_contact_id=? AND mimetype=?",
                                    parameters, 
                                    null);
                         
    return cursor;
};

//http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Email.html
exports.getEmailType = function(data2, data3) {
    var typeInt = data2;
    var typeConverted = "";
    
    switch(typeInt) {
        case TYPE_CUSTOM:
            typeConverted = data3; //LABEL
            break;
        case android.provider.ContactsContract.CommonDataKinds.Email.TYPE_HOME:
            typeConverted = KnownLabel.HOME;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Email.TYPE_WORK:
            typeConverted = KnownLabel.WORK;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Email.TYPE_OTHER:
            typeConverted = KnownLabel.OTHER;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Email.TYPE_MOBILE:
            typeConverted = KnownLabel.MOBILE;
            break;
    }
    
    return typeConverted;
};

exports.getNativeEmailType = function (label) {
    var nativeType = TYPE_CUSTOM;

    switch (label) {
        case KnownLabel.HOME:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Email.TYPE_HOME;
            break;
        case KnownLabel.WORK:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Email.TYPE_WORK;
            break;
        case KnownLabel.OTHER:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Email.TYPE_OTHER;
            break;
        case KnownLabel.MOBILE:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Email.TYPE_MOBILE;
            break;
    }

    return nativeType;
};

//http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Organization.html
exports.getOrgType = function(data2, data3){
    var typeInt = data2;
    var typeConverted = "";
    switch(typeInt){
        case TYPE_CUSTOM:
            typeConverted = data3; //LABEL
            break;
        case android.provider.ContactsContract.CommonDataKinds.Organization.TYPE_WORK:
            typeConverted = KnownLabel.WORK;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Organization.TYPE_OTHER:
            typeConverted = KnownLabel.OTHER;
            break;
    }
    
    return typeConverted;
};

exports.getNativeOrgType = function (label) {
    var nativeType = TYPE_CUSTOM;

    switch (label) {
        case KnownLabel.WORK:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Organization.TYPE_WORK;
            break;
        case KnownLabel.OTHER:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Organization.TYPE_OTHER;
            break;
    };

    return nativeType;
};

//http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Website.html
exports.getWebsiteType = function(data2, data3){
    var typeInt = data2;
    var typeConverted = "";
    
    switch(typeInt){
        case TYPE_CUSTOM:
            typeConverted = data3; //LABEL
            break;
        case android.provider.ContactsContract.CommonDataKinds.Website.TYPE_HOMEPAGE:
            typeConverted = KnownLabel.HOMEPAGE;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Website.TYPE_BLOG:
            typeConverted = KnownLabel.BLOG;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Website.TYPE_PROFILE:
            typeConverted = KnownLabel.PROFILE;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Website.TYPE_HOME:
            typeConverted = KnownLabel.HOME;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Website.TYPE_WORK:
            typeConverted = KnownLabel.WORK;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Website.TYPE_FTP:
            typeConverted = KnownLabel.FTP;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Website.TYPE_OTHER:
            typeConverted = KnownLabel.OTHER;
            break;
    }
    
    return typeConverted;
};

exports.getNativeWebsiteType = function (label) {
    var nativeType = TYPE_CUSTOM;

    switch (label) {
        case KnownLabel.HOMEPAGE:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Website.TYPE_HOMEPAGE;
            break;
        case KnownLabel.BLOG:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Website.TYPE_BLOG;
            break;
        case KnownLabel.PROFILE:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Website.TYPE_PROFILE;
            break;
        case KnownLabel.HOME:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Website.TYPE_HOME;
            break;
        case KnownLabel.WORK:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Website.TYPE_WORK;
            break;
        case KnownLabel.FTP:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Website.TYPE_FTP;
            break;
        case KnownLabel.OTHER:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Website.TYPE_OTHER;
            break;
    }

    return nativeType;
};

//http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Email.html
exports.getAddressType = function(data2, data3){
    var typeInt = data2;
    var typeConverted = "";
    
    switch(typeInt){
        case TYPE_CUSTOM:
            typeConverted = data3; //LABEL
            break;
        case android.provider.ContactsContract.CommonDataKinds.StructuredPostal.TYPE_HOME:
            typeConverted = KnownLabel.HOME;
            break;
        case android.provider.ContactsContract.CommonDataKinds.StructuredPostal.TYPE_WORK:
            typeConverted = KnownLabel.WORK;
            break;
        case android.provider.ContactsContract.CommonDataKinds.StructuredPostal.TYPE_OTHER:
            typeConverted = KnownLabel.OTHER;
            break;
    }
    
    return typeConverted;
};

exports.getNativeAddressType = function (label) {
    var nativeType = TYPE_CUSTOM;

    switch (label) {
        case KnownLabel.HOME:
            nativeType = android.provider.ContactsContract.CommonDataKinds.StructuredPostal.TYPE_HOME;
            break;
        case KnownLabel.WORK:
            nativeType = android.provider.ContactsContract.CommonDataKinds.StructuredPostal.TYPE_WORK;
            break;
        case KnownLabel.OTHER:
            nativeType = android.provider.ContactsContract.CommonDataKinds.StructuredPostal.TYPE_OTHER;
            break;
    }

    return nativeType;
};

//http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Phone.html
exports.getPhoneType = function(data2, data3){
    var typeInt = data2;
    var typeConverted = "";
    
    switch(typeInt){
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_HOME:
            typeConverted = KnownLabel.HOME;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_MOBILE:
            typeConverted = KnownLabel.MOBILE;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_WORK:
            typeConverted = KnownLabel.WORK;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_FAX_WORK:
            typeConverted = KnownLabel.FAX_WORK;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_FAX_HOME:
            typeConverted = KnownLabel.FAX_HOME;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_PAGER: 
            typeConverted = KnownLabel.PAGER;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_OTHER:
            typeConverted = KnownLabel.OTHER;
            break;
        case TYPE_CUSTOM:
            typeConverted = data3; //Use LABEL
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_CALLBACK:
            typeConverted = KnownLabel.CALLBACK;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_CAR:
            typeConverted = KnownLabel.CAR;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_COMPANY_MAIN:
            typeConverted = KnownLabel.COMPANY_NAME;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_ISDN:
            typeConverted = KnownLabel.ISDN;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_MAIN:
            typeConverted = KnownLabel.MAIN;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_OTHER_FAX:
            typeConverted = KnownLabel.OTHER_FAX;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_RADIO:
            typeConverted = KnownLabel.RADIO;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_TELEX:
            typeConverted = KnownLabel.TELEX;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_TTY_TDD:
            typeConverted = KnownLabel.TTY_TDD;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_WORK_MOBILE:
            typeConverted = KnownLabel.WORK_MOBILE;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_WORK_PAGER:
            typeConverted = KnownLabel.WORK_PAGER;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_ASSISTANT:
            typeConverted = KnownLabel.ASSISTANT;
            break;
        case android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_MMS:
            typeConverted = KnownLabel.MMS;
            break;
    }
    
    return typeConverted;
};

exports.getNativePhoneType = function (label) {
    var nativeType = TYPE_CUSTOM;

    switch (label) {
        case KnownLabel.HOME:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_HOME;
            break;
        case KnownLabel.MOBILE:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_MOBILE;
            break;
        case KnownLabel.WORK:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_WORK;
            break;
        case KnownLabel.FAX_WORK:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_FAX_WORK;
            break;
        case KnownLabel.FAX_HOME:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_FAX_HOME;
            break;
        case KnownLabel.PAGER:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_PAGER;
            break;
        case KnownLabel.OTHER:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_OTHER;
            break;
        case KnownLabel.CALLBACK:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_CALLBACK;
            break;
        case KnownLabel.CAR:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_CAR;
            break;
        case KnownLabel.COMPANY_NAME:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_COMPANY_MAIN;
            break;
        case KnownLabel.ISDN:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_ISDN;
            break;
        case KnownLabel.MAIN:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_MAIN;
            break;
        case KnownLabel.OTHER_FAX:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_OTHER_FAX;
            break;
        case KnownLabel.RADIO:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_RADIO;
            break;
        case KnownLabel.TELEX:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_TELEX;
            break;
        case KnownLabel.TTY_TDD:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_TTY_TDD;
            break;
        case KnownLabel.WORK_MOBILE:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_WORK_MOBILE;
            break;
        case KnownLabel.WORK_PAGER:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_WORK_PAGER;
            break;
        case KnownLabel.ASSISTANT:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_ASSISTANT;
            break;
        case KnownLabel.MMS:
            nativeType = android.provider.ContactsContract.CommonDataKinds.Phone.TYPE_MMS;
            break;
    }
    
    return nativeType;
};

exports.getAvatar = function(){
    return "android Image";
};

exports.convertNativeCursorToJson = function(cursor) {
    //noinspection JSUnresolvedFunction
    var count = cursor.getColumnCount();
    var results = {};

    for (var i=0; i < count; i++) {
        var type = cursor.getType(i);
        //noinspection JSUnresolvedFunction
        var name = cursor.getColumnName(i);

        switch (type) {
            case 0: // NULL
                results[name] = null;
                break;
            case 1: // Integer
                //noinspection JSUnresolvedFunction
                results[name] = cursor.getInt(i);
                break;
            case 2: // Float
                //noinspection JSUnresolvedFunction
                results[name] = cursor.getFloat(i);
                break;
            case 3: // String
                results[name] = cursor.getString(i);
                break;
            case 4: // Blob
                results[name] = cursor.getBlob(i);
                break;
            default:
                throw new Error('Contacts - Unknown Field Type '+ type);
        }
    }

    return results;
};
