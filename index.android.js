var appModule = require("application");
var Contact = require("./contact-model");
var KnownLabel = require("./known-label");
var Group = require("./group-model");

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
                                mainCursor.close();
                                reject();
                                return;
                            }

                            //Convert the native contact object
                            var contactModel = new Contact();
                            contactModel.initializeFromNative(mainCursor);
                            mainCursor.close();
                            
                            return resolve({
                                data: contactModel,
                                response: "selected"
                            });
                        } else {
                            return resolve({
                                data: null,
                                response: "cancelled"
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
            c.close();
            resolve({
                data: cts,
                response: "fetch"
            });
        }
        else{
            c.close();
            resolve({
                data: null,
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
            c.close();
            resolve({
                data: cts,
                response: "fetch"
            });
        }
        else{
            c.close();
            resolve({
                data: null,
                response: "fetch"
            });
        }
    });
};
exports.getGroups = function(name){
    return new Promise(function (resolve, reject){
        var aGroups = android.provider.ContactsContract.Groups,
        aGroupColumns = android.provider.ContactsContract.GroupsColumns,
        groupCursor;
        
        if(name){
            groupCursor = appModule.android.context.getContentResolver().query(aGroups.CONTENT_URI, null, aGroupColumns.TITLE + "=?", [name], null);
        }
        else{
            groupCursor = appModule.android.context.getContentResolver().query(aGroups.CONTENT_URI, null, null, null, null);
        }
        
        if(groupCursor.getCount() > 0){
            var groups = [],groupModel=null;
            
            while(groupCursor.moveToNext()){
                groupModel = new Group();
                groupModel.initializeFromNative(groupCursor);
                groups.push(groupModel);
            }
            
            groupCursor.close();
            
            resolve({
                data: groups,
                response: "fetch"
            });
        }
        else{
            groupCursor.close();
            resolve({
                data: null,
                response: "fetch"
            });
        }
    });
}
exports.getContactsInGroup=function(g){
    return new Promise(function (resolve, reject){
        var where =  android.provider.ContactsContract.CommonDataKinds.GroupMembership.GROUP_ROW_ID +"=?" + " AND " + android.provider.ContactsContract.DataColumns.MIMETYPE + "=?",
        whereArgs = [g.id.toString(), android.provider.ContactsContract.CommonDataKinds.GroupMembership.CONTENT_ITEM_TYPE],
        groupCursor = appModule.android.context.getContentResolver().query(android.provider.ContactsContract.Data.CONTENT_URI, null, where, whereArgs, null);

        if(groupCursor.getCount() > 0){
            var cts = [];
                
            while(groupCursor.moveToNext()){
                var Contacts = android.provider.ContactsContract.Contacts,
                SELECTION = "_id",
                rawId = groupCursor.getString(groupCursor.getColumnIndex("raw_contact_id")),
                c = appModule.android.context.getContentResolver().query(Contacts.CONTENT_URI, null, SELECTION + " = ?", [rawId], null);

                while(c.moveToNext()){
                    var contactModel = new Contact();
                    contactModel.initializeFromNative(c);
                    cts.push(contactModel);
                }
                
                c.close();
            }
            groupCursor.close();
            resolve({
                data: cts,
                response: "fetch"
            });
        }
        else{
            groupCursor.close();
            resolve({
                data: null,
                response: "fetch"
            });
        }
    });
};

exports.Contact = Contact;
exports.KnownLabel = KnownLabel;
exports.Group = Group;
