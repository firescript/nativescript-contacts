var helper = require("./contact-helper");
var ContactCommon = require("./contact-model-common");

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
        
        if(contactData.phoneNumbers.count > 0){
            for(var i = 0; i < contactData.phoneNumbers.count; i++){
                var pdata = contactData.phoneNumbers[i];
                this.phoneNumbers.push(
                    {
                        id: pdata.identifier,
                        label: pdata.label.replace("_$!<","").replace(">!$_",""),
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
                        label: edata.label.replace("_$!<","").replace(">!$_",""),
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
                        label: postaldata.label.replace("_$!<","").replace(">!$_",""),
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
                        label: urldata.label.replace("_$!<","").replace(">!$_",""),
                        value: urldata.value
                    });
            }
        }
    }

    return Contact;
})(ContactCommon)

module.exports = Contact;