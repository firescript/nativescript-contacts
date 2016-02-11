var appModule = require("application");
var androidHelper = require("./androidHelpers");

function User(){
    this.id = "";
    this.name = {
        given: "",
        middle: "",
        family: "",
        prefix: "",
        suffix: "",
        displayname: ""
    }
    
    this.jobTitle = "";
    this.nickname = "";
    this.department = "";
    this.organization = "";
    this.notes = "";
    
    this.phonetic = {
       given: "",
       middle: "",
       family: ""   
    }
    
    this.phoneNumbers = [];
    this.emailAddresses = [];
    this.postalAddresses = [];
    
    //##########################
    // INITALIZE iOS
    //##########################
    this.initalizeiOS = function(contactData){
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
        
        this.phonetic.given = getiOSValue("phoneticGivenName", contactData);
        this.phonetic.middle = getiOSValue("phoneticMiddleName", contactData);
        this.phonetic.family = getiOSValue("phoneticFamilyName", contactData);
        
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
    }
    
    //##########################
    // INITALIZE ANDROID
    //##########################
    this.initalizeAndroid = function(cursor){
        var mainCursorJson = androidHelper.convertNativeCursorToJson(cursor);
        this.id = mainCursorJson["_id"];
                
        //Get Basic User Details
        var userNameParameters = [
            this.id.toString(),
            "vnd.android.cursor.item/name" //ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE
        ];
        
        var usernameCursor = androidHelper.getComplexCursor(this.id,
                                                            android.provider.ContactsContract.Data.CONTENT_URI,
                                                            null,
                                                            userNameParameters);
                                                            
        var usernameCursorJson = androidHelper.convertNativeCursorToJson(usernameCursor);
        this.name.given = usernameCursorJson["data2"];
        this.name.middle = usernameCursorJson["data5"];
        this.name.family = usernameCursorJson["data3"];
        this.name.prefix = usernameCursorJson["data4"];
        this.name.suffix = usernameCursorJson["data6"];
        this.name.displayname = usernameCursorJson["data1"];
        
        this.phonetic.given = usernameCursorJson["data7"];
        this.phonetic.middle = usernameCursorJson["data8"];
        this.phonetic.family = usernameCursorJson["data9"];
        usernameCursor.close();
        
        //Get Nickname
        var nickNameParameters = [
            this.id.toString(),
            "vnd.android.cursor.item/nickname" //ContactsContract.CommonDataKinds.Nickname.CONTENT_ITEM_TYPE
        ];

        var nicknameCursor = androidHelper.getComplexCursor(this.id,
                                                            android.provider.ContactsContract.Data.CONTENT_URI,
                                                            ["data1"],
                                                            nickNameParameters);
        var nicknameCursorJson = androidHelper.convertNativeCursorToJson(nicknameCursor);
        this.nickname = nicknameCursorJson["data1"];
        nicknameCursor.close();
        
        //Get phone
        var hasPhone = mainCursorJson["has_phone_number"];
        if(hasPhone === 1){
            var phoneCursor= androidHelper.getBasicCursor(android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_URI, this.id);
            while(phoneCursor.moveToNext()){
                var phoneCursorJson = androidHelper.convertNativeCursorToJson(phoneCursor);
                this.phoneNumbers.push(
                    {
                        id: "",
                        label: androidHelper.getPhoneType(phoneCursorJson["data2"], phoneCursorJson["data3"]),
                        value: phoneCursorJson["data1"]
                    });
            };
            phoneCursor.close();
        }

        //Get email
        var emailCursor = androidHelper.getBasicCursor(android.provider.ContactsContract.CommonDataKinds.Email.CONTENT_URI, this.id);
        while(emailCursor.moveToNext()){
            var emailCursorJson = androidHelper.convertNativeCursorToJson(emailCursor);
            this.emailAddresses.push(
            {
                id: emailCursorJson["_id"],
                label: androidHelper.getEmailType(emailCursorJson["data2"], emailCursorJson["data3"]),
                value: emailCursorJson["data1"]
            });
        };
        emailCursor.close();
   
        //Get addresses
        var postalCursor = androidHelper.getBasicCursor(android.provider.ContactsContract.CommonDataKinds.StructuredPostal.CONTENT_URI, this.id);
        while(postalCursor.moveToNext()){
            var postalCursorJson = androidHelper.convertNativeCursorToJson(postalCursor);
   
            this.postalAddresses.push(
            {
                id: postalCursorJson["_id"],
                label: androidHelper.getAddressType(postalCursorJson["data2"], postalCursorJson["data3"]),
                location: {
                            street: postalCursorJson["data4"],
                            city: postalCursorJson["data7"],
                            state: postalCursorJson[""],
                            postalCode: postalCursorJson["data9"],
                            country: postalCursorJson["data10"],
                            countryCode: postalCursorJson[""],
                            formatted: postalCursorJson["data1"]
                        }
            });
        };
        postalCursor.close();
    }
    
    /// TODO: NOT FUNCTIONAL ATM
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