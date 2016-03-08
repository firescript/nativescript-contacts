var frameModule = require("ui/frame");
var Contact = require("./contact-model");
var KnownLabel = require("./known-label");

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
           response: "cancelled",
           ios: null,
           android: null 
        });
    },
    contactPickerDidSelectContact: function(controller, contact) {        
        controller.dismissModalViewControllerAnimated(true);
        
        //Convert the native contact object
        var contactModel = new Contact();
        contactModel.initializeFromNative(contact);
        
        this.resolve({
            data: contactModel,
            response: "selected",
            ios: contact,
            android: null
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
exports.fetchAllContacts = function(){
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
        cts = [];
        
        fetch.unifyResults = true;
        fetch.predicate = null;
        
        store.enumerateContactsWithFetchRequestErrorUsingBlock(fetch, error, function(c,s){
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

exports.Contact = Contact;
exports.KnownLabel = KnownLabel;
