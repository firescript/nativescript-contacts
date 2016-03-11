var frameModule = require("ui/frame");
var Contact = require("./contact-model");
var KnownLabel = require("./known-label");
var Group = require("./group-model");

var CustomCNContactPickerViewControllerDelegate = NSObject.extend({    
    initWithResolveReject: function(resolve, reject) {
        var self = this.super.init();
        if(self) {
            this.resolve = resolve;
            this.reject = reject;
        }
        return self;
    },
    contactPickerDidCancel: function(controller){
        this.resolve({
           data: null,
           response: "cancelled"
        });
    },
    contactPickerDidSelectContact: function(controller, contact) {        
        controller.dismissModalViewControllerAnimated(true);
        
        //Convert the native contact object
        var contactModel = new Contact();
        contactModel.initializeFromNative(contact);
        
        this.resolve({
            data: contactModel,
            response: "selected"
        });        
        CFRelease(controller.delegate);
    }
}, {
    protocols: [CNContactPickerDelegate]
});

exports.getContact = function (){
    return new Promise(function (resolve, reject) {  
        var controller = CNContactPickerViewController.alloc().init();
        var delegate = CustomCNContactPickerViewControllerDelegate.alloc().initWithResolveReject(resolve, reject);
        
        CFRetain(delegate);
        controller.delegate = delegate;
        
        var page = frameModule.topmost().ios.controller;
        page.presentModalViewControllerAnimated(controller, true);
    });
};
exports.getContactsByName = function(searchPredicate){
    return new Promise(function (resolve, reject){
        var store = new CNContactStore(),
        error,
        keysToFetch = [
                "givenName", 
                "familyName", 
                "middleName", 
                "namePrefix", 
                "nameSuffix", 
                "phoneticGivenName", 
                "phoneticMiddleName", 
                "phoneticFamilyName", 
                "nickname", 
                "jobTitle", 
                "departmentName", 
                "organizationName", 
                "notes", 
                "phoneNumbers", 
                "emailAddresses", 
                "postalAddresses", 
                "urlAddresses", 
                "imageData",
                "imageDataAvailable"
        ], // All Properties that we are using in the Model
        foundContacts = store.unifiedContactsMatchingPredicateKeysToFetchError(CNContact.predicateForContactsMatchingName(searchPredicate), keysToFetch, error);
        
        if(error){
            reject(error.localizedDescription);
        }
        
        if (foundContacts.count > 0) {
            var cts = [];
            for(var i=0; i<foundContacts.count; i++){
                var contactModel = new Contact();
                contactModel.initializeFromNative(foundContacts[i]);
                cts.push(contactModel);
            }
            resolve({
                data: cts,
                response: "fetch"
            });
        }
        else{
            resolve({
                data: null,
                response: "fetch"
            });
        }
    });
};
exports.getAllContacts = function(){
    return new Promise(function (resolve, reject){
        var store = new CNContactStore(),
        error,
        keysToFetch = [
                "givenName", 
                "familyName", 
                "middleName", 
                "namePrefix", 
                "nameSuffix", 
                "phoneticGivenName", 
                "phoneticMiddleName", 
                "phoneticFamilyName", 
                "nickname", 
                "jobTitle", 
                "departmentName", 
                "organizationName", 
                "notes", 
                "phoneNumbers", 
                "emailAddresses", 
                "postalAddresses", 
                "urlAddresses", 
                "imageData",
                "imageDataAvailable"
        ], // All Properties that we are using in the Model
        fetch = CNContactFetchRequest.alloc().initWithKeysToFetch(keysToFetch),
        cts = [],
        nativeMutableArray = new NSMutableArray();
        
        fetch.unifyResults = true;
        fetch.predicate = null;
        
        store.enumerateContactsWithFetchRequestErrorUsingBlock(fetch, error, function(c,s){
            nativeMutableArray.addObject(c);
            var contactModel = new Contact();
            contactModel.initializeFromNative(c);
            cts.push(contactModel);
        });
        
        if(error){
            reject(error.localizedDescription);
        }
        
        if(cts.length > 0){
            resolve({
                data: cts,
                response: "fetch"
            });
        }
        else{
            resolve({
                data: null,
                response: "fetch"
            });
        }
    });
};
exports.getGroups = function(name){
    return new Promise(function (resolve, reject){
        var store = new CNContactStore(),
        error;
        
        var foundGroups = store.groupsMatchingPredicateError(null, error);
        
        if(error){
            reject(error.localizedDescription);
        }
        
        if (foundGroups.count > 0) {
            var groups = [],i=0,groupModel=null;
            
            if(name){
                var foundGroupsMutable = foundGroups.mutableCopy();
                for(i=0; i<foundGroupsMutable.count; i++){
                    if(foundGroupsMutable[i]["name"] === name){
                        groupModel = new Group();
                        groupModel.initializeFromNative(foundGroups[i]);
                        groups.push(groupModel);
                    }
                    else{
                        foundGroupsMutable.removeObjectAtIndex(i);
                    }
                }
                if(foundGroupsMutable.count > 0){
                    foundGroups = foundGroupsMutable.copy();
                }
                else{
                    foundGroups = null;
                    groups = null;
                }
            }else{
                for(i=0; i<foundGroups.count; i++){
                    groupModel = new Group();
                    groupModel.initializeFromNative(foundGroups[i]);
                    groups.push(groupModel);
                }
            }
            resolve({
                data: groups,
                response: "fetch"
            });
        }
        else{
            resolve({
                data: null,
                response: "fetch"
            });
        }
    });
}
exports.getContactsInGroup=function(g){
    return new Promise(function (resolve, reject){
        var store = new CNContactStore(),
        error,
        keysToFetch = [
                "givenName", 
                "familyName", 
                "middleName", 
                "namePrefix", 
                "nameSuffix", 
                "phoneticGivenName", 
                "phoneticMiddleName", 
                "phoneticFamilyName", 
                "nickname", 
                "jobTitle", 
                "departmentName", 
                "organizationName", 
                "notes", 
                "phoneNumbers", 
                "emailAddresses", 
                "postalAddresses", 
                "urlAddresses", 
                "imageData",
                "imageDataAvailable"
        ], // All Properties that we are using in the Model
        foundContacts = store.unifiedContactsMatchingPredicateKeysToFetchError(CNContact.predicateForContactsInGroupWithIdentifier(g.id), keysToFetch, error);
        
        if(error){
            reject(error.localizedDescription);
        }
        
        if (foundContacts.count > 0) {
            var cts = [];
            for(var i=0; i<foundContacts.count; i++){
                var contactModel = new Contact();
                contactModel.initializeFromNative(foundContacts[i]);
                cts.push(contactModel);
            }
            resolve({
                data: cts,
                response: "fetch"
            });
        }
        else{
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
