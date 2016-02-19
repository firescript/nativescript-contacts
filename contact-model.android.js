var helper = require("./contact-helper");
var ContactCommon = require("./contact-model-common");

var Contact = (function (_super) {
    global.__extends(Contact, _super);

    function Contact() {
        _super.call(this);

        // android specific
        this.organization.symbol = "";
        this.organization.phonetic = "";
        this.organization.location = "";
        this.organization.type = "";
    }

    Contact.prototype.initializeFromNative = function(cursor) {
        var mainCursorJson = helper.convertNativeCursorToJson(cursor);
        this.id = mainCursorJson["_id"];
               
        //Get Basic User Details
        var userNameParameters = [
            this.id.toString(),
            "vnd.android.cursor.item/name" //ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE
        ];
        var usernameCursor = helper.getComplexCursor(this.id,
                                                    android.provider.ContactsContract.Data.CONTENT_URI,
                                                    null,
                                                    userNameParameters);
        usernameCursor.moveToFirst();                                                     
        var usernameCursorJson = helper.convertNativeCursorToJson(usernameCursor);
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

        var nicknameCursor = helper.getComplexCursor(this.id,
                                                    android.provider.ContactsContract.Data.CONTENT_URI,
                                                    ["data1"],
                                                    nickNameParameters);
        if(nicknameCursor.getCount() > 0){
            nicknameCursor.moveToFirst();   
            var nicknameCursorJson = helper.convertNativeCursorToJson(nicknameCursor);
            this.nickname = nicknameCursorJson["data1"];
        }
        nicknameCursor.close();

        //Get phone
        var hasPhone = mainCursorJson["has_phone_number"];
        if(hasPhone === 1){
            var phoneCursor= helper.getBasicCursor(android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_URI, this.id);
            while(phoneCursor.moveToNext()){
                var phoneCursorJson = helper.convertNativeCursorToJson(phoneCursor);
                this.phoneNumbers.push(
                    {
                        id: "",
                        label: helper.getPhoneType(phoneCursorJson["data2"], phoneCursorJson["data3"]),
                        value: phoneCursorJson["data1"]
                    });
            };
            phoneCursor.close();
        }

        //Get email
        var emailCursor = helper.getBasicCursor(android.provider.ContactsContract.CommonDataKinds.Email.CONTENT_URI, this.id);
        while(emailCursor.moveToNext()){
            var emailCursorJson = helper.convertNativeCursorToJson(emailCursor);
            this.emailAddresses.push(
            {
                id: emailCursorJson["_id"],
                label: helper.getEmailType(emailCursorJson["data2"], emailCursorJson["data3"]),
                value: emailCursorJson["data1"]
            });
        };
        emailCursor.close();
   
        //Get addresses
        var postalCursor = helper.getBasicCursor(android.provider.ContactsContract.CommonDataKinds.StructuredPostal.CONTENT_URI, this.id);
        while(postalCursor.moveToNext()){
            var postalCursorJson = helper.convertNativeCursorToJson(postalCursor);
   
            this.postalAddresses.push(
            {
                id: postalCursorJson["_id"],
                label: helper.getAddressType(postalCursorJson["data2"], postalCursorJson["data3"]),
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
        var notesCursor = helper.getComplexCursor(this.id,
                                                            android.provider.ContactsContract.Data.CONTENT_URI,
                                                            ["data1"],
                                                            notesParameters);
        if(notesCursor.getCount() > 0){
            notesCursor.moveToFirst();
            var notesCursorJson = helper.convertNativeCursorToJson(notesCursor);
            this.notes = notesCursorJson["data1"];
        }
        notesCursor.close();
        
        //Get Websites
        var websitesParameters = [
            this.id.toString(),
            "vnd.android.cursor.item/website" //ContactsContract.CommonDataKinds.Website.CONTENT_ITEM_TYPE
        ];
        var websitesCursor = helper.getComplexCursor(this.id,
                                                            android.provider.ContactsContract.Data.CONTENT_URI,
                                                            null,
                                                            websitesParameters);
        while(websitesCursor.moveToNext()){
            var websitesCursorJson = helper.convertNativeCursorToJson(websitesCursor);
   
            this.urls.push(
            {
                label: helper.getWebsiteType(websitesCursorJson["data2"], websitesCursorJson["data3"]),
                value: websitesCursorJson["data1"]
            });
        };
        websitesCursor.close();
        
        //Get Organization
        var orgParameters = [
            this.id.toString(),
            "vnd.android.cursor.item/organization" //ContactsContract.CommonDataKinds.Organization.CONTENT_ITEM_TYPE
        ];
        var orgCursor = helper.getComplexCursor(this.id,
                                                android.provider.ContactsContract.Data.CONTENT_URI,
                                                null,
                                                orgParameters);
        if(orgCursor.getCount() > 0){
            orgCursor.moveToFirst();
            var orgCursorJson = helper.convertNativeCursorToJson(orgCursor);
            this.organization.jobTitle = orgCursorJson["data4"];
            this.organization.name = orgCursorJson["data1"];
            this.organization.department = orgCursorJson["data5"];
            this.organization.symbol = orgCursorJson["data7"];
            this.organization.phonetic = orgCursorJson["data8"];
            this.organization.location = orgCursorJson["data9"];
            this.organization.type = helper.getOrgType(orgCursorJson["data2"], orgCursorJson["data3"]);
        }
        orgCursor.close();
    }

    return Contact;
})(ContactCommon);

module.exports = Contact;