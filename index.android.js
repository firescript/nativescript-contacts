var appModule = require("application");
var Contact = require("./contact-model");
var KnownLabel = require("./known-label");

exports.getContact = function() {
    return new Promise(function(resolve, reject) {
        try {
            var PICK_CONTACT = 1001;
            var openContactsIntent = new android.content.Intent(android.content.Intent.ACTION_PICK);
            
            openContactsIntent.setType(android.provider.ContactsContract.Contacts.CONTENT_TYPE);
            
            var previousResult = appModule.android.onActivityResult;
            
            appModule.android.onActivityResult = function(requestCode, resultCode, data) {
                switch (requestCode) {
                    case PICK_CONTACT:
                        appModule.android.onActivityResult = previousResult;
                        
                        if (resultCode === android.app.Activity.RESULT_OK && data != null) {
                            var contentResolver = appModule.android.context.getContentResolver(); 
                            var pickedContactData = data.getData();
                            var mainCursor = contentResolver.query(pickedContactData, null, null, null, null);
                            mainCursor.moveToFirst();
                            if (!mainCursor) {
                                reject();
                                return;
                            }

                            //Convert the native contact object
                            var contactModel = new Contact();
                            contactModel.initializeFromNative(mainCursor);
        
                            return resolve({
                                data: contactModel,
                                response: "selected",
                                ios: null,
                                android: mainCursor
                            });
                        } else {
                            return resolve({
                                data: null,
                                response: "cancelled",
                                ios: null,
                                android: null 
                            });
                        }
                        break;
                    default:
                        if (typeof previousResult === 'function') {
                            previousResult(requestCode, resultCode, data);
                        }
                        break;
                }
            };
            
            appModule.android.foregroundActivity.startActivityForResult(openContactsIntent, PICK_CONTACT);
        } catch (e) {
            if (reject) {
                reject(e);
            }
        }
    });
};
exports.getContactsByName = function(searchPredicate){
    return new Promise(function (resolve, reject){
        var Contacts = android.provider.ContactsContract.Contacts,
        SELECTION = android.provider.ContactsContract.ContactNameColumns.DISPLAY_NAME_PRIMARY,
        c = appModule.android.context.getContentResolver().query(Contacts.CONTENT_URI, null, SELECTION + " like ?", ["%" + searchPredicate + "%"], null);
        
        if(c.getCount() > 0){
            var cts = [];
            while(c.moveToNext()){
                var contactModel = new Contact();
                contactModel.initializeFromNative(c);
                cts.push(contactModel);
            }
            resolve({
                data: cts,
                ios:null,
                android:c,
                response: "fetch"
            });
        }
        else{
            resolve({
                data: null,
                ios:null,
                android:null,
                response: "fetch"
            });
        }
    });
};
exports.getAllContacts = function(){
    return new Promise(function (resolve, reject){
        var c = appModule.android.context.getContentResolver().query(android.provider.ContactsContract.Contacts.CONTENT_URI, null, null, null, null);
        
        if(c.getCount() > 0){
            var cts = [];
            while(c.moveToNext()){
                var contactModel = new Contact();
                contactModel.initializeFromNative(c);
                cts.push(contactModel);
            }
            resolve({
                data: cts,
                ios:null,
                android:c,
                response: "fetch"
            });
        }
        else{
            resolve({
                data: null,
                ios:null,
                android:null,
                response: "fetch"
            });
        }
    });
};

exports.Contact = Contact;
exports.KnownLabel = KnownLabel;
