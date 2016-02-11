var appModule = require("application");
var androidHelper = require("./androidHelper");
var iosHelper = require("./iosHelper");

function User(){
    this.id = "";
    this.name = {
        given: "",
        middle: "",
        family: "",
        prefix: "",
        suffix: "",
        displayname: "",
        phonetic : {
            given: "",
            middle: "",
            family: ""   
        }
    }
    
    this.organization = {
        name: "",
        jobTitle: "",
        department: "",
        
        //android only
        symbol: "",
        phonetic: "",
        location: "",
        type: ""
    }
    
    this.nickname = "";
    this.notes = "";

    this.urls = [];
    this.phoneNumbers = [];
    this.emailAddresses = [];
    this.postalAddresses = [];
    
    //##########################
    // INITALIZE iOS
    //##########################
    this.initalizeiOS = function(contactData){
        this.id = iosHelper.getiOSValue("identifier", contactData);
        
        //NAME
        this.name.given = iosHelper.getiOSValue("givenName", contactData);    
        this.name.family = iosHelper.getiOSValue("familyName", contactData);
        this.name.middle = iosHelper.getiOSValue("middleName", contactData);
        this.name.prefix = iosHelper.getiOSValue("namePrefix", contactData);
        this.name.suffix = iosHelper.getiOSValue("nameSuffix", contactData);
        this.name.phonetic.given = iosHelper.getiOSValue("phoneticGivenName", contactData);
        this.name.phonetic.middle = iosHelper.getiOSValue("phoneticMiddleName", contactData);
        this.name.phonetic.family = iosHelper.getiOSValue("phoneticFamilyName", contactData);

        //ORG
        this.organization.jobTitle = iosHelper.getiOSValue("jobTitle", contactData);    
        this.organization.department = iosHelper.getiOSValue("departmentName", contactData);
        this.organization.name = iosHelper.getiOSValue("organizationName", contactData);
        
        this.nickname = iosHelper.getiOSValue("nickname", contactData);
        
        this.notes = iosHelper.getiOSValue("notes", contactData);
        
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
                debugger;
                this.urls.push(
                    {
                        label: urldata.label.replace("_$!<","").replace(">!$_",""),
                        value: urldata.value
                    });
            }
        }
        
        debugger;
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
        usernameCursor.moveToFirst();                                                     
        var usernameCursorJson = androidHelper.convertNativeCursorToJson(usernameCursor);
        this.name.given = usernameCursorJson["data2"];
        this.name.middle = usernameCursorJson["data5"];
        this.name.family = usernameCursorJson["data3"];
        this.name.prefix = usernameCursorJson["data4"];
        this.name.suffix = usernameCursorJson["data6"];
        this.name.displayname = usernameCursorJson["data1"];
        
        this.name.phonetic.given = usernameCursorJson["data7"];
        this.name.phonetic.middle = usernameCursorJson["data8"];
        this.name.phonetic.family = usernameCursorJson["data9"];
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
        nicknameCursor.moveToFirst();   
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
        
        //Get Notes
        var notesParameters = [
            this.id.toString(),
            "vnd.android.cursor.item/note" //ContactsContract.CommonDataKinds.Note.CONTENT_ITEM_TYPE
        ];
        var notesCursor = androidHelper.getComplexCursor(this.id,
                                                            android.provider.ContactsContract.Data.CONTENT_URI,
                                                            ["data1"],
                                                            notesParameters);
        
        notesCursor.moveToFirst();
        var notesCursorJson = androidHelper.convertNativeCursorToJson(notesCursor);
        this.notes = notesCursorJson["data1"];
        notesCursor.close();
        
        //Get Websites
        var websitesParameters = [
            this.id.toString(),
            "vnd.android.cursor.item/website" //ContactsContract.CommonDataKinds.Website.CONTENT_ITEM_TYPE
        ];
        var websitesCursor = androidHelper.getComplexCursor(this.id,
                                                            android.provider.ContactsContract.Data.CONTENT_URI,
                                                            null,
                                                            websitesParameters);
        while(websitesCursor.moveToNext()){
            var websitesCursorJson = androidHelper.convertNativeCursorToJson(websitesCursor);
   
            this.urls.push(
            {
                label: androidHelper.getWebsiteType(websitesCursorJson["data2"], websitesCursorJson["data3"]),
                value: websitesCursorJson["data1"]
            });
        };
        websitesCursor.close();
        
        //Get Organization
        var orgParameters = [
            this.id.toString(),
            "vnd.android.cursor.item/organization" //ContactsContract.CommonDataKinds.Organization.CONTENT_ITEM_TYPE
        ];
        var orgCursor = androidHelper.getComplexCursor(this.id,
                                                            android.provider.ContactsContract.Data.CONTENT_URI,
                                                            null,
                                                            orgParameters);
        
        orgCursor.moveToFirst();
        var orgCursorJson = androidHelper.convertNativeCursorToJson(orgCursor);
        this.organization.jobTitle = orgCursorJson["data4"];
        this.organization.name = orgCursorJson["data1"];
        this.organization.department = orgCursorJson["data5"];
        this.organization.symbol = orgCursorJson["data7"];
        this.organization.phonetic = orgCursorJson["data8"];
        this.organization.location = orgCursorJson["data9"];
        this.organization.type = androidHelper.getOrgType(orgCursorJson["data2"], orgCursorJson["data3"]);
        orgCursor.close();
        
    }
    
    /// TODO: NOT FUNCTIONAL ATM
    this.getAvatar = function(){
        if(appModule.ios){
            return iosHelper.getAvatar();
        }
        else{
            return androidHelper.getAvatar();
        }
    }
} 




module.exports = User;