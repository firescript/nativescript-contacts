var appModule = require("application");
var Contact = require("./contact-model");
var KnownLabel = require("./known-label");
var Group = require("./group-model");
var helper = require("./contact-helper");

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
                            var contentResolver = helper.getContext().getContentResolver(); 
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
exports.getContactsByName = (searchPredicate,contactFields) => {
    return new Promise((resolve, reject) => {
        let worker = new Worker('./get-contacts-by-name-worker.js'); // relative for caller script path
        worker.postMessage({ "searchPredicate": searchPredicate, "contactFields" : contactFields });
        worker.onmessage = ((event) => {
            if (event.data.type == 'debug') { console.log(event.data.message); }
            else if (event.data.type == 'dump') { console.dump(event.data.message); }
            else if (event.data.type == 'result') {
                worker.terminate();
                // add nativescript image-source object to photo property since it does not work inside web worker
                if (contactFields.indexOf('photo') > -1) { resolve(helper.addImageSources(event.data.message)); }
                else { resolve(event.data.message); }
            }
        });
        worker.onerror = ((e) => {
            console.dump(e);
        });
    });
};
exports.getAllContacts = (contactFields) => {
    return new Promise((resolve, reject) => {
        let worker = new Worker('./get-all-contacts-worker.js'); // relative for caller script path
        worker.postMessage({ "contactFields" : contactFields });
        worker.onmessage = ((event) => {
            if (event.data.type == 'debug') { console.log(event.data.message); }
            else if (event.data.type == 'dump') { console.dump(event.data.message); }
            else if (event.data.type == 'result') {
                worker.terminate();
                // add nativescript image-source object to photo property since it does not work inside web worker
                if (contactFields.indexOf('photo') > -1) { resolve(helper.addImageSources(event.data.message)); }
                else { resolve(event.data.message); }
            }
        });
        worker.onerror = ((e) => {
            console.dump(e);
        });
    });
};
exports.getGroups = function(name){
    return new Promise(function (resolve, reject){
        var aGroups = android.provider.ContactsContract.Groups,
        aGroupColumns = android.provider.ContactsContract.GroupsColumns,
        groupCursor;
        
        if(name){
            groupCursor = helper.getContext().getContentResolver().query(aGroups.CONTENT_URI, null, aGroupColumns.TITLE + "=?", [name], null);
        }
        else{
            groupCursor = helper.getContext().getContentResolver().query(aGroups.CONTENT_URI, null, null, null, null);
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
        groupCursor = helper.getContext().getContentResolver().query(android.provider.ContactsContract.Data.CONTENT_URI, null, where, whereArgs, null);

        if(groupCursor.getCount() > 0){
            var cts = [];
                
            while(groupCursor.moveToNext()){
                var Contacts = android.provider.ContactsContract.Contacts,
                SELECTION = "_id",
                rawId = groupCursor.getString(groupCursor.getColumnIndex("raw_contact_id")),
                c = helper.getContext().getContentResolver().query(Contacts.CONTENT_URI, null, SELECTION + " = ?", [rawId], null);

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