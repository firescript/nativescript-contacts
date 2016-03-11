var helper = require("./contact-helper");
var ContactCommon = require("./contact-model-common");
var imageSource = require("image-source");

var Contact = (function (_super) {
    global.__extends(Contact, _super);

    function Contact(){
        _super.apply(this, arguments);
    }

    Contact.prototype.initializeFromNative = function(contactData) {
        this.id = helper.getiOSValue("identifier", contactData);
        
        //NAME
        this.name.given = helper.getiOSValue("givenName", contactData);    
        this.name.family = helper.getiOSValue("familyName", contactData);
        this.name.middle = helper.getiOSValue("middleName", contactData);
        this.name.prefix = helper.getiOSValue("namePrefix", contactData);
        this.name.suffix = helper.getiOSValue("nameSuffix", contactData);
        this.name.phonetic.given = helper.getiOSValue("phoneticGivenName", contactData);
        this.name.phonetic.middle = helper.getiOSValue("phoneticMiddleName", contactData);
        this.name.phonetic.family = helper.getiOSValue("phoneticFamilyName", contactData);

        //ORG
        this.organization.jobTitle = helper.getiOSValue("jobTitle", contactData);    
        this.organization.department = helper.getiOSValue("departmentName", contactData);
        this.organization.name = helper.getiOSValue("organizationName", contactData);
        
        this.nickname = helper.getiOSValue("nickname", contactData);
        
        this.notes = helper.getiOSValue("notes", contactData);
        
        if (contactData.imageDataAvailable) {
            this.photo = imageSource.fromData(contactData.imageData);
        }
        
        if(contactData.phoneNumbers.count > 0){
            for(var i = 0; i < contactData.phoneNumbers.count; i++){
                var pdata = contactData.phoneNumbers[i];
                this.phoneNumbers.push(
                    {
                        id: pdata.identifier,
                        label: helper.getPhoneLabel(pdata.label),
                        value: pdata.value.stringValue
                    });
            }
        }
        
        if(contactData.emailAddresses.count > 0){
            for(var i = 0; i < contactData.emailAddresses.count; i++){
                var edata = contactData.emailAddresses[i];
                this.emailAddresses.push(
                    {
                        id: edata.identifier,
                        label: helper.getGenericLabel(edata.label),
                        value: edata.value
                    });
            }
        }
        
        if(contactData.postalAddresses.count > 0){
            for(var i = 0; i < contactData.postalAddresses.count; i++){
                var postaldata = contactData.postalAddresses[i];
                this.postalAddresses.push(
                    {
                        id: postaldata.identifier,
                        label: helper.getGenericLabel(postaldata.label),
                        location: {
                            street: postaldata.value.street,
                            city: postaldata.value.city,
                            state: postaldata.value.state,
                            postalCode: postaldata.value.postalCode,
                            country: postaldata.value.country,
                            countryCode: postaldata.value.ISOCountryCode,
                            formatted: ""
                        }
                    });
            }
        }
        
        if(contactData.urlAddresses.count > 0){
            for(var i = 0; i < contactData.urlAddresses.count; i++){
                var urldata = contactData.urlAddresses[i];
                this.urls.push(
                    {
                        label: helper.getWebsiteLabel(urldata.label),
                        value: urldata.value
                    });
            }
        }
    };
    
    Contact.prototype.save = function () {
        var isUpdate = false;
        var store = new CNContactStore();
        var contactRecord;
        
        if (this.id && this.id !== "") {
            var searchPredicate = CNContact.predicateForContactsWithIdentifiers([this.id]);
            var keysToFetch = [
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
                "imageData"
            ]; // All Properties that we are changing
            var foundContacts = store.unifiedContactsMatchingPredicateKeysToFetchError(searchPredicate, keysToFetch, null);
            if (foundContacts.count > 0) {
                contactRecord = foundContacts[0].mutableCopy();
                isUpdate = true;
            }
        }
        
        if (!contactRecord) {
            contactRecord = new CNMutableContact();
        }
        
        // Set Names
        contactRecord.givenName = this.name.given;
        contactRecord.familyName = this.name.family;
        contactRecord.middleName = this.name.middle;
        contactRecord.namePrefix = this.name.prefix;
        contactRecord.nameSuffix = this.name.suffix;
        contactRecord.phoneticGivenName = this.name.phonetic.given;
        contactRecord.phoneticMiddleName = this.name.phonetic.middle;
        contactRecord.phoneticFamilyName = this.name.phonetic.family;
        
        // Set nickname
        contactRecord.nickname = this.nickname;
        
        // Set Phones
        contactRecord.phoneNumbers = this.phoneNumbers.map(function (item) {
            return CNLabeledValue.labeledValueWithLabelValue(helper.getNativePhoneLabel(item.label), CNPhoneNumber.phoneNumberWithStringValue(item.value))    
        });
        
        // Set Emails
        contactRecord.emailAddresses = this.emailAddresses.map(function (item) {
            return CNLabeledValue.labeledValueWithLabelValue(helper.getNativeGenericLabel(item.label), item.value)
        });
        
        // Set Addresses
        contactRecord.postalAddresses = this.postalAddresses.map(function (item) {
            var mutableAddress = new CNMutablePostalAddress();
            mutableAddress.street = item.location.street;
            mutableAddress.city = item.location.city;
            mutableAddress.state = item.location.state;
            mutableAddress.postalCode = item.location.postalCode;
            mutableAddress.country = item.location.country;
            mutableAddress.ISOCountryCode = item.location.countryCode;
            
            return CNLabeledValue.labeledValueWithLabelValue(helper.getNativeGenericLabel(item.label), mutableAddress)
        });
        
        // Set Notes
        contactRecord.notes = this.notes;
                
        // Set Websites
        contactRecord.urlAddresses = this.urls.map(function (item) {
            return CNLabeledValue.labeledValueWithLabelValue(helper.getNativeWebsiteLabel(item.label), item.value)
        });
        
        // Set Organization
        contactRecord.jobTitle = this.organization.jobTitle;
        contactRecord.departmentName = this.organization.department;
        contactRecord.organizationName = this.organization.name;
        
        // Set photo
        if (!this.photo || !this.photo.ios) {
            // Delete the image
            contactRecord.imageData = null;
        }
        else {
            contactRecord.imageData = UIImageJPEGRepresentation(this.photo.ios, 1.0);
        }
        
        var saveRequest = new CNSaveRequest();
        if (isUpdate) {
            saveRequest.updateContact(contactRecord)
        }
        else {
            saveRequest.addContactToContainerWithIdentifier(contactRecord, null);
        }
        
        var error;
        store.executeSaveRequestError(saveRequest, error);
        
        if (error) {
            throw new Error(error.localizedDescription);
        }
        
        //Update our id for new contacts so that we can do something else with them if we choose.
        if(contactRecord["identifier"] !== this.id){
            this.id = contactRecord["identifier"];
        }
    };

    Contact.prototype.delete = function(){
        var store = new CNContactStore();
        var contactRecord;
        
        if (this.id && this.id !== "") {
            var searchPredicate = CNContact.predicateForContactsWithIdentifiers([this.id]);
            var keysToFetch = [
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
                "imageData"
            ]; // All Properties that we are changing
            var foundContacts = store.unifiedContactsMatchingPredicateKeysToFetchError(searchPredicate, keysToFetch, null);
            if (foundContacts.count > 0) {
                contactRecord = foundContacts[0].mutableCopy();
            }
        }
        
        if(contactRecord){
            var saveRequest = new CNSaveRequest();
            saveRequest.deleteContact(contactRecord)
            
            var error;
            store.executeSaveRequestError(saveRequest, error);
            
            if (error) {
                throw new Error(error.localizedDescription);
            }
        }
    };
    
    return Contact;
})(ContactCommon)

module.exports = Contact;
