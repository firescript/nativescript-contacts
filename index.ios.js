const Frame = require("@nativescript/core/ui/frame").Frame;
var Contact = require("./contact-model");
var KnownLabel = require("./known-label");
var Group = require("./group-model");

var CustomCNContactPickerViewControllerDelegate = NSObject.extend(
  {
    initWithResolveReject: function(resolve, reject) {
      var self = this.super.init();
      if (self) {
        this.resolve = resolve;
        this.reject = reject;
      }
      return self;
    },
    contactPickerDidCancel: function(controller) {
      this.resolve({
        data: null,
        response: "cancelled"
      });
    },
    contactPickerDidSelectContact: function (controller, contact) {

      var self = this;

      // Complete processing after view controller dismissed 
      var completionHandler = function () {

        //Convert the native contact object
        var contactModel = new Contact();
        contactModel.initializeFromNative(contact);

        self.resolve({
          data: contactModel,
          response: "selected"
        });
        CFRelease(controller.delegate);
      }
 
      var page = Frame.topmost().ios.controller;
      page.dismissViewControllerAnimatedCompletion(true, completionHandler);  
    }
  },
  {
    protocols: [CNContactPickerDelegate]
  }
);

exports.getContact = function() {
  return new Promise(function(resolve, reject) {
    var controller = CNContactPickerViewController.alloc().init();
    var delegate = CustomCNContactPickerViewControllerDelegate.new().initWithResolveReject(
      resolve,
      reject
    );

    CFRetain(delegate);
    controller.delegate = delegate;

    var page = Frame.topmost().ios.controller;
    page.presentViewControllerAnimatedCompletion(controller, true, null);
  });
};

exports.getContactById = function (id, contactFields) {
  return new Promise(function (resolve, reject) {
    if (!id) {
      reject('Missing Contact Identifier');
    }
    contactFields = contactFields || [
      'name',
      'organization',
      'nickname',
      'photo',
      'urls',
      'phoneNumbers',
      'emailAddresses',
      'postalAddresses',
    ]
    const store = new CNContactStore();
    const searchPredicate = CNContact.predicateForContactsWithIdentifiers([id]);
    const keysToFetch = [];
    if (contactFields.indexOf('name') > -1) {
      keysToFetch.push(
          "givenName", "familyName", "middleName", "namePrefix", "nameSuffix",
          "phoneticGivenName", "phoneticMiddleName", "phoneticFamilyName"
      );
    }

    if (contactFields.indexOf('organization') > -1) { keysToFetch.push("jobTitle", "departmentName", "organizationName"); }
    if (contactFields.indexOf('nickname') > -1) { keysToFetch.push("nickname"); }
    if (contactFields.indexOf('notes') > -1) { keysToFetch.push("note"); }
    if (contactFields.indexOf('photo') > -1) { keysToFetch.push("imageData", "imageDataAvailable"); }
    if (contactFields.indexOf('phoneNumbers') > -1) { keysToFetch.push("phoneNumbers"); }
    if (contactFields.indexOf('emailAddresses') > -1) { keysToFetch.push("emailAddresses"); }
    if (contactFields.indexOf('postalAddresses') > -1) { keysToFetch.push("postalAddresses"); }
    if (contactFields.indexOf('urlAddresses') > -1) { keysToFetch.push("urlAddresses"); }

    let error;
    const foundContacts = store.unifiedContactsMatchingPredicateKeysToFetchError(searchPredicate, keysToFetch, error);

    if (error) {
      reject(error.localizedDescription);
    }

    if (foundContacts && foundContacts.count > 0) {
      let contactModel = new Contact();
      contactModel.initializeFromNative(foundContacts[0]);

      resolve({
        data: [contactModel],
        response: "fetch"
      });
    } else {
      resolve({
        data: null,
        response: "fetch"
      });
    }
  });
}

exports.getContactsByName = function(searchPredicate, contactFields) {
  return new Promise(function(resolve, reject) {
    var worker;
    // Check if webpack is used, in which case, load using webpack loader, otherwise load using relative path
    // Using webpack assumes that the nativescript worker loader is properly configured. See https://github.com/NativeScript/worker-loader
    if (global["TNS_WEBPACK"]) {
      var myWorker = require("nativescript-worker-loader!./get-contacts-by-name-worker.js");
      worker = new myWorker();
    } else {
      worker = new Worker("./get-contacts-by-name-worker.js"); // relative for caller script path
    }
    worker.postMessage({
      searchPredicate: searchPredicate,
      contactFields: contactFields
    });
    worker.onmessage = function(event) {
      if (event.data.type == "debug") {
        // console.log(event.data.message);
      } else if (event.data.type == "dump") {
        // console.dump(event.data.message);
      } else if (event.data.type == "error") {
        reject(event.data.message);
      } else {
        worker.terminate();
        resolve(event.data.message);
      }
    };
    worker.onerror = function(e) {
      // console.dump(e);
    };
  });
};
exports.getAllContacts = function(contactFields) {
  return new Promise(function(resolve, reject) {
    var worker;
    if (global["TNS_WEBPACK"]) {
      var myWorker = require("nativescript-worker-loader!./get-all-contacts-worker.js");
      worker = new myWorker();
    } else {
      worker = new Worker("./get-all-contacts-worker.js"); // relative for caller script path
    }
    worker.postMessage({ contactFields: contactFields });
    worker.onmessage = function(event) {
      var _contacts = [];
      try {
        (event.data.message.data || []).forEach(function(contact) {
          var contactModel = new Contact();
          contactModel.initializeFromObject(contact, event.data.contactFields);
          _contacts.push(contactModel);
        });
      } catch (e) {
        // console.dump(e)
      }
      event.data.message.data = _contacts;
      if (event.data.type == "debug") {
        // console.log(event.data.message);
      } else if (event.data.type == "dump") {
        // console.dump(event.data.message);
      } else if (event.data.type == "error") {
        reject(event.data.message);
      } else {
        worker.terminate();
        resolve(event.data.message);
      }
    };
    worker.onerror = function(e) {
      // console.dump(e);
    };
  });
};
exports.getGroups = function(name) {
  return new Promise(function(resolve, reject) {
    var store = new CNContactStore(),
      error;

    var foundGroups = store.groupsMatchingPredicateError(null, error);

    if (error) {
      reject(error.localizedDescription);
    }

    if (foundGroups && foundGroups.count > 0) {
      var groups = [],
        i = 0,
        groupModel = null;

      if (name) {
        var foundGroupsMutable = foundGroups.mutableCopy();
        for (i = 0; i < foundGroupsMutable.count; i++) {
          if (foundGroupsMutable[i]["name"] === name) {
            groupModel = new Group();
            groupModel.initializeFromNative(foundGroups[i]);
            groups.push(groupModel);
          } else {
            foundGroupsMutable.removeObjectAtIndex(i);
          }
        }
        if (foundGroupsMutable.count > 0) {
          foundGroups = foundGroupsMutable.copy();
        } else {
          foundGroups = null;
          groups = null;
        }
      } else {
        for (i = 0; i < foundGroups.count; i++) {
          groupModel = new Group();
          groupModel.initializeFromNative(foundGroups[i]);
          groups.push(groupModel);
        }
      }
      resolve({
        data: groups,
        response: "fetch"
      });
    } else {
      resolve({
        data: null,
        response: "fetch"
      });
    }
  });
};
exports.getContactsInGroup = function(g) {
  return new Promise(function(resolve, reject) {
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
        "note",
        "phoneNumbers",
        "emailAddresses",
        "postalAddresses",
        "urlAddresses",
        "imageData",
        "imageDataAvailable"
      ], // All Properties that we are using in the Model
      foundContacts = store.unifiedContactsMatchingPredicateKeysToFetchError(
        CNContact.predicateForContactsInGroupWithIdentifier(g.id),
        keysToFetch,
        error
      );

    if (error) {
      reject(error.localizedDescription);
    }

    if (foundContacts && foundContacts.count > 0) {
      var cts = [];
      for (var i = 0; i < foundContacts.count; i++) {
        var contactModel = new Contact();
        contactModel.initializeFromNative(foundContacts[i]);
        cts.push(contactModel);
      }
      resolve({
        data: cts,
        response: "fetch"
      });
    } else {
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
