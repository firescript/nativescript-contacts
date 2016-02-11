
var appModule = require("application");

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
}


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
}



//http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Email.html
exports.getEmailType = function(data2, data3){
    var typeInt = data2;
    var typeConverted = "";
    
    switch(typeInt){
        case "0": //TYPE_CUSTOM
            typeConverted = data3; //LABEL
            break;
        case "1":
            typeConverted = "Home"; //TYPE_HOME
            break;
        case "2":
            typeConverted = "Work"; //TYPE_WORK
            break;
        case "3":
            typeConverted = "Other"; //TYPE_OTHER
            break;
        case "4":
            typeConverted = "Mobile"; //TYPE_MOBILE
            break;
    }
    
    return typeConverted;
}

//http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Website.html
exports.getWebsiteType = function(data2, data3){
    var typeInt = data2;
    var typeConverted = "";
    
    switch(typeInt){
        case "0": //TYPE_CUSTOM
            typeConverted = data3; //LABEL
            break;
        case "1":
            typeConverted = "Homepage"; //TYPE_HOMEPAGE
            break;
        case "2":
            typeConverted = "Blog"; //TYPE_BLOG
            break;
        case "3":
            typeConverted = "Profile"; //TYPE_PROFILE
            break;
        case "4":
            typeConverted = "Home"; //TYPE_HOME
            break;
        case "5":
            typeConverted = "Work"; //TYPE_WORK
            break;
        case "6":
            typeConverted = "FTP"; //TYPE_FTP
            break;
        case "7":
            typeConverted = "Other"; //TYPE_OTHER
            break;
    }
    
    return typeConverted;
}

//http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Email.html
exports.getAddressType = function(data2, data3){
    var typeInt = data2;
    var typeConverted = "";
    
    switch(typeInt){
        case "0": //TYPE_CUSTOM
            typeConverted = data3; //LABEL
            break;
        case "1":
            typeConverted = "Home"; //TYPE_HOME
            break;
        case "2":
            typeConverted = "Work"; //TYPE_WORK
            break;
        case "3":
            typeConverted = "Other"; //TYPE_OTHER
            break;
    }
    
    return typeConverted;
}

//http://developer.android.com/reference/android/provider/ContactsContract.CommonDataKinds.Phone.html
exports.getPhoneType = function(data2, data3){
    var typeInt = data2;
    var typeConverted = "";
    
    switch(typeInt){
        case "1":
            typeConverted = "Home"; //TYPE_HOME
            break;
        case "2":
            typeConverted = "Mobile"; //TYPE_MOBILE
            break;
        case "3":
            typeConverted = "Work"; //TYPE_WORK
            break;
        case "4":
            typeConverted = "Fax Work"; //TYPE_FAX_WORK
            break;
        case "5":
            typeConverted = "Fax Home"; //TYPE_FAX_HOME
            break;
        case "6": 
            typeConverted = "Pager"; //TYPE_PAGER
            break;
        case "7": 
            typeConverted = data3; //TYPE_OTHER, Use LABEL
            break;
        case "8":
            typeConverted = "Callback"; //TYPE_CALLBACK
            break;
        case "9":
            typeConverted = "Car"; //TYPE_CAR
            break;
        case "10":
            typeConverted = "Company Main"; //TYPE_COMPANY_MAIN
            break;
        case "11":
            typeConverted = "ISDN"; //TYPE_ISDN
            break;
        case "12":
            typeConverted = "Main"; //TYPE_MAIN
            break;
        case "13":
            typeConverted = "Other Fax"; //TYPE_OTHER_FAX
            break;
        case "14":
            typeConverted = "Radio"; //TYPE_RADIO
            break;
        case "15":
            typeConverted = "Telex"; //TYPE_TELEX
            break;
        case "16":
            typeConverted = "TTY TDD"; //TYPE_TTY_TDD
            break;
        case "17":
            typeConverted = "Work Mobile"; //TYPE_WORK_MOBILE
            break;
        case "18":
            typeConverted = "Work Pager"; //TYPE_WORK_PAGER
            break;
        case "19":
            typeConverted = "Assistant"; //TYPE_ASSISTANT
            break;
        case "20":
            typeConverted = "MMS"; //TYPE_MMS
            break;
    }
    
    return typeConverted;
}

exports.getAvatar = function(){
    return "android Image";
}

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
}
