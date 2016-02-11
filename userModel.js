var appModule = require("application");
var androidHelper = require("./androidHelpers");

function User(){
    this.id = "";
    this.name = {
        given: "",
        middle: "",
        family: "",
        prefix: "",
        suffix: ""
    }
    
    this.jobTitle = "";
    this.nickname = "";
    this.department = "";
    this.organization = "";
    this.notes = "";
    
    this.phonetic = {
       first: "",
       middle: "",
       last: ""   
    }
    
    this.phoneNumbers = [];
    this.emailAddresses = [];
    this.postalAddresses = [];
    
    this.initalizeiOS = function(contactData){
        // IOS
        this.id = getiOSValue("identifier", contactData);
        
        this.name.given = getiOSValue("givenName", contactData);    
        this.name.family = getiOSValue("familyName", contactData);
        this.name.middle = getiOSValue("middleName", contactData);
        this.name.prefix = getiOSValue("namePrefix", contactData);
        this.name.suffix = getiOSValue("nameSuffix", contactData);

        this.jobTitle = getiOSValue("jobTitle", contactData);    
        this.department = getiOSValue("departmentName", contactData);
        this.organization = getiOSValue("organizationName", contactData);
        this.nickname = getiOSValue("nickname", contactData);
        this.notes = getiOSValue("notes", contactData);
        
        this.phonetic.first = getiOSValue("phoneticGivenName", contactData);
        this.phonetic.middle = getiOSValue("phoneticMiddleName", contactData);
        this.phonetic.last = getiOSValue("phoneticFamilyName", contactData);
        
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
                            countryCode: postaldata.value.ISOCountryCode
                        }
                    });
            }
        }
    }
    
    this.initalizeAndroid = function(cursor){
        var mainCursorJson = androidHelper.convertNativeCursorToJson(cursor);
        this.id = mainCursorJson["_id"];
        
        //Get phone
        var hasPhone = mainCursorJson["has_phone_number"];
        if(hasPhone === 1){
            var phoneCursor= androidHelper.getCursor(android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_URI, this.id);
            while(phoneCursor.moveToNext()){
                var phoneCursorJson = androidHelper.convertNativeCursorToJson(phoneCursor);
                this.phoneNumbers.push(
                    {
                        id: "",
                        label: androidHelper.getPhoneType(phoneCursorJson["data2"], phoneCursorJson["data3"]),
                        value: phoneCursorJson["data1"]
                    });
            };
        }
 
        //Get email
        var emailCursor = androidHelper.getCursor(android.provider.ContactsContract.CommonDataKinds.Email.CONTENT_URI, this.id);
        while(emailCursor.moveToNext()){
            var emailCursorJson = androidHelper.convertNativeCursorToJson(emailCursor);
            this.emailAddresses.push(
            {
                id: emailCursorJson["_id"],
                label: androidHelper.getEmailType(emailCursorJson["data2"], emailCursorJson["data3"]),
                value: emailCursorJson["data1"]
            });
        };
    }
    
    /// TODO:
    this.getAvatar = function(){
        if(appModule.ios){
            return "iOS IMAGE";    
        }
        else{
            return androidHelper.getAvatar();
        }
    }
} 

function getiOSValue(key, contactData){
    return contactData.isKeyAvailable(key) ? contactData[key] : "";
}




module.exports = User;