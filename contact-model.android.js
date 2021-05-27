var helper = require("./contact-helper");
var appModule = require("@nativescript/core/application");
var ContactCommon = require("./contact-model-common");
var imageSource = require('@nativescript/core/image-source');

/* missing constants from the {N} */
var ACCOUNT_TYPE = "account_type"; // android.provider.ContactsContract.RawContacts.ACCOUNT_TYPE
var ACCOUNT_NAME = "account_name"; // android.provider.ContactsContract.RawContacts.ACCOUNT_NAME
var TYPE = "data2"; // android.provider.ContactsContract.CommonDataKinds.Phone.TYPE / android.provider.ContactsContract.CommonDataKinds.Email.TYPE / android.provider.ContactsContract.CommonDataKinds.StructuredPostal.TYPE
var LABEL = "data3";
var PHOTO_URI = "photo_uri"; // android.provider.ContactsContract.CommonDataKinds.Phone.PHOTO_URI
var IS_SUPER_PRIMARY = "is_super_primary"; // android.provider.ContactsContract.Data.IS_SUPER_PRIMARY

var getAndroidContext = () => {
    if (
      typeof appModule != 'undefined' &&
      appModule.hasOwnProperty('android') &&
      appModule.android.hasOwnProperty('context')
    ) {
      return appModule.android.context;
    }
  
    var ctx = java.lang.Class.forName('android.app.AppGlobals')
      .getMethod('getInitialApplication', null)
      .invoke(null, null);
    if (ctx) {
      return ctx;
    }
  
    ctx = java.lang.Class.forName('android.app.ActivityThread')
      .getMethod('currentApplication', null)
      .invoke(null, null);
    return ctx;
  };

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

    Contact.prototype.initializeFromNative = function (
        cursor,
        contactFields
    ) {
        contactFields = contactFields || ['name', 'organization', 'nickname', 'notes', 'photo', 'urls', 'phoneNumbers', 'emailAddresses', 'postalAddresses'];
        
        var mainCursorJson = helper.convertNativeCursorToJson(cursor);
        this.id = mainCursorJson["_id"];

        if (contactFields.indexOf('photo') > -1 && mainCursorJson[PHOTO_URI]) {
            var bitmap = android.provider.MediaStore.Images.Media.getBitmap(
                getAndroidContext().getContentResolver(),
                android.net.Uri.parse(mainCursorJson[PHOTO_URI])
              );
              // this.photo = imageSource.fromNativeSource(bitmap);
              this.photo = 'data:image/png;base64,' + imageSource.fromNativeSource(bitmap).toBase64String('png');
        } else {
            delete this.photo;
        }

        if (contactFields.indexOf('name') > -1) {

            //Get Basic User Details
            var userNameParameters = [
                this.id.toString(),
                "vnd.android.cursor.item/name" //ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE
            ];
            var usernameCursor = helper.getComplexCursor(this.id,
                android.provider.ContactsContract.Data.CONTENT_URI,
                null,
                userNameParameters);
            if(usernameCursor && usernameCursor.getCount() > 0 && usernameCursor.moveToFirst()){
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
            }
        } else {
            delete this.name;
        }

        if (contactFields.indexOf('nickname') > -1) {
            //Get Nickname
            var nickNameParameters = [
                this.id.toString(),
                "vnd.android.cursor.item/nickname" //ContactsContract.CommonDataKinds.Nickname.CONTENT_ITEM_TYPE
            ];

            var nicknameCursor = helper.getComplexCursor(this.id,
                android.provider.ContactsContract.Data.CONTENT_URI, ["data1"],
                nickNameParameters);
            if (nicknameCursor && nicknameCursor.getCount() > 0) {
                nicknameCursor.moveToFirst();
                var nicknameCursorJson = helper.convertNativeCursorToJson(nicknameCursor);
                this.nickname = nicknameCursorJson["data1"];
            }
            if(nicknameCursor){
                nicknameCursor.close();
            }
        } else {
            delete this.nickname;
        }

        if (contactFields.indexOf('phoneNumbers') > -1) {
            //Get phone
            var hasPhone = mainCursorJson["has_phone_number"];
            if (hasPhone === 1) {
                var phoneCursor = helper.getBasicCursor(android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_URI, this.id);
                while (phoneCursor.moveToNext()) {
                    var phoneCursorJson = helper.convertNativeCursorToJson(phoneCursor);
                    this.phoneNumbers.push({
                        id: "",
                        label: helper.getPhoneType(phoneCursorJson["data2"], phoneCursorJson["data3"]),
                        value: phoneCursorJson["data1"]
                    });
                };
                phoneCursor.close();
            }
        } else {
            delete this.phoneNumbers;
        }

        if (contactFields.indexOf('emailAddresses') > -1) {
            //Get email
            var emailCursor = helper.getBasicCursor(android.provider.ContactsContract.CommonDataKinds.Email.CONTENT_URI, this.id);
            while (emailCursor.moveToNext()) {
                var emailCursorJson = helper.convertNativeCursorToJson(emailCursor);
                this.emailAddresses.push({
                    id: emailCursorJson["_id"],
                    label: helper.getEmailType(emailCursorJson["data2"], emailCursorJson["data3"]),
                    value: emailCursorJson["data1"]
                });
            };
            emailCursor.close();
        } else {
            delete this.emailAddresses;
        }

        if (contactFields.indexOf('emailAddresses') > -1) {

            //Get addresses
            var postalCursor = helper.getBasicCursor(android.provider.ContactsContract.CommonDataKinds.StructuredPostal.CONTENT_URI, this.id);
            while (postalCursor.moveToNext()) {
                var postalCursorJson = helper.convertNativeCursorToJson(postalCursor);

                this.postalAddresses.push({
                    id: postalCursorJson["_id"],
                    label: helper.getAddressType(postalCursorJson["data2"], postalCursorJson["data3"]),
                    location: {
                        street: postalCursorJson["data4"],
                        city: postalCursorJson["data7"],
                        state: postalCursorJson["data8"],
                        postalCode: postalCursorJson["data9"],
                        country: postalCursorJson["data10"],
                        countryCode: postalCursorJson[""],
                        formatted: postalCursorJson["data1"]
                    }
                });
            };
            postalCursor.close();
        } else {
            delete this.postalAddresses;
        }

        if (contactFields.indexOf('notes') > -1) {
            //Get Notes
            var notesParameters = [
                this.id.toString(),
                "vnd.android.cursor.item/note" //ContactsContract.CommonDataKinds.Note.CONTENT_ITEM_TYPE
            ];
            var notesCursor = helper.getComplexCursor(this.id,
                android.provider.ContactsContract.Data.CONTENT_URI, ["data1"],
                notesParameters);
            if (notesCursor.getCount() > 0) {
                notesCursor.moveToFirst();
                var notesCursorJson = helper.convertNativeCursorToJson(notesCursor);
                this.notes = notesCursorJson["data1"];
            }
            notesCursor.close();
        } else {
            delete this.notes;
        }

        if (contactFields.indexOf('urls') > -1) {
            //Get Websites
            var websitesParameters = [
                this.id.toString(),
                "vnd.android.cursor.item/website" //ContactsContract.CommonDataKinds.Website.CONTENT_ITEM_TYPE
            ];
            var websitesCursor = helper.getComplexCursor(this.id,
                android.provider.ContactsContract.Data.CONTENT_URI,
                null,
                websitesParameters);
            while (websitesCursor.moveToNext()) {
                var websitesCursorJson = helper.convertNativeCursorToJson(websitesCursor);

                this.urls.push({
                    label: helper.getWebsiteType(websitesCursorJson["data2"], websitesCursorJson["data3"]),
                    value: websitesCursorJson["data1"]
                });
            };
            websitesCursor.close();
        } else {
            delete this.urls;
        }

        if (contactFields.indexOf('organization') > -1) {
            //Get Organization
            var orgParameters = [
                this.id.toString(),
                "vnd.android.cursor.item/organization" //ContactsContract.CommonDataKinds.Organization.CONTENT_ITEM_TYPE
            ];
            var orgCursor = helper.getComplexCursor(this.id,
                android.provider.ContactsContract.Data.CONTENT_URI,
                null,
                orgParameters);
            if (orgCursor.getCount() > 0) {
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
        } else {
            delete this.organization;
        }
    }

    Contact.prototype.initializeFromObject = function (
        cObject,
        contactFields
    ) {
        contactFields = contactFields || ['name', 'organization', 'nickname', 'notes', 'photo', 'urls', 'phoneNumbers', 'emailAddresses', 'postalAddresses'];

        var mainCursorJson = cObject;

        for (var prop in cObject) {
            this[prop] = cObject[prop]
        }
    }

    Contact.prototype.save = function () {
        var mgr = android.accounts.AccountManager.get(appModule.android.foregroundActivity);
        var accounts = mgr.getAccounts();
        var accountName = null;
        var accountType = null;
        var id = this.id;
        var rawId = 0;
        var contentResolver = appModule.android.foregroundActivity.getContentResolver();
        var ops = new java.util.ArrayList();

        if (accounts.length !== 0) { 
            accountName = accounts[0].name;
            accountType = accounts[0].type;
        }

        if (id && id !== "") {
            var rawIdCursor = contentResolver.query(android.provider.ContactsContract.RawContacts.CONTENT_URI, ["_id"],
                "contact_id = " + id,
                null,
                null)
            if (!rawIdCursor.moveToFirst()) {
                throw new Error("Error optaining raw contact id");
                return;
            }

            rawId = rawIdCursor.getString(rawIdCursor.getColumnIndex("_id"));
            rawIdCursor.close();

            ops.add(android.content.ContentProviderOperation.newUpdate(android.provider.ContactsContract.RawContacts.CONTENT_URI)
                .withValue(ACCOUNT_TYPE, accountType)
                .withValue(ACCOUNT_NAME, accountName)
                .build());

            // If existing contact, since we do not know which sub-data exactly was deleted, remove all and then it will be added again below. 
            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE, true)
                .build());
            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.Email.CONTENT_ITEM_TYPE, true)
                .build());
            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.StructuredPostal.CONTENT_ITEM_TYPE, true)
                .build());
            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.Website.CONTENT_ITEM_TYPE, true)
                .build());
            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.Organization.CONTENT_ITEM_TYPE, true)
                .build());
            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.Photo.CONTENT_ITEM_TYPE, true)
                .build());
        } else {
            ops.add(android.content.ContentProviderOperation.newInsert(android.provider.ContactsContract.RawContacts.CONTENT_URI)
                .withValue(ACCOUNT_TYPE, accountType)
                .withValue(ACCOUNT_NAME, accountName)
                .build());
        }

        // Add/Update Names
        ops.add(helper.getContactBuilder(id, android.provider.ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE)
            .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredName.DISPLAY_NAME, this.name.displayname)
            .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredName.GIVEN_NAME, this.name.given)
            .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredName.MIDDLE_NAME, this.name.middle)
            .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredName.FAMILY_NAME, this.name.family)
            .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredName.PREFIX, this.name.prefix)
            .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredName.SUFFIX, this.name.suffix)
            .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredName.PHONETIC_GIVEN_NAME, this.name.phonetic.given)
            .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredName.PHONETIC_MIDDLE_NAME, this.name.phonetic.middle)
            .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredName.PHONETIC_FAMILY_NAME, this.name.phonetic.family)
            .build());

        // Add/Update Nickname
        ops.add(helper.getContactBuilder(id, android.provider.ContactsContract.CommonDataKinds.Nickname.CONTENT_ITEM_TYPE)
            .withValue(android.provider.ContactsContract.CommonDataKinds.Nickname.NAME, this.nickname)
            .build());


        // Add Phones
        this.phoneNumbers.forEach(function (item) {
            var nativePhoneType = helper.getNativePhoneType(item.label);

            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE)
                .withValue(TYPE, new java.lang.Integer(nativePhoneType))
                .withValue(LABEL, (nativePhoneType ? "" : item.label))
                .withValue(android.provider.ContactsContract.CommonDataKinds.Phone.NUMBER, item.value)
                .build());
        });

        // Add Emails
        this.emailAddresses.forEach(function (item) {
            var nativeEmailType = helper.getNativeEmailType(item.label);

            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.Email.CONTENT_ITEM_TYPE)
                .withValue(TYPE, new java.lang.Integer(nativeEmailType))
                .withValue(LABEL, (nativeEmailType ? "" : item.label))
                .withValue(android.provider.ContactsContract.CommonDataKinds.Email.ADDRESS, item.value)
                .build());
        });

        // Add Addresses
        this.postalAddresses.forEach(function (item) {
            var nativeAddressType = helper.getNativeAddressType(item.label);

            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.StructuredPostal.CONTENT_ITEM_TYPE)
                .withValue(TYPE, new java.lang.Integer(nativeAddressType))
                .withValue(LABEL, (nativeAddressType ? "" : item.label))
                .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredPostal.STREET, item.location.street)
                .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredPostal.CITY, item.location.city)
                .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredPostal.REGION, item.location.state)
                .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredPostal.POSTCODE, item.location.postalCode)
                .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredPostal.COUNTRY, item.location.country)
                .withValue(android.provider.ContactsContract.CommonDataKinds.StructuredPostal.FORMATTED_ADDRESS, item.location.formatted)
                .build());
        });

        // Add/Update Note
        ops.add(helper.getContactBuilder(id, android.provider.ContactsContract.CommonDataKinds.Note.CONTENT_ITEM_TYPE)
            .withValue(android.provider.ContactsContract.CommonDataKinds.Note.NOTE, this.notes)
            .build());


        // Add Websites
        this.urls.forEach(function (item) {
            var nativeWebsiteType = helper.getNativeWebsiteType(item.label);

            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.Website.CONTENT_ITEM_TYPE)
                .withValue(TYPE, new java.lang.Integer(nativeWebsiteType))
                .withValue(LABEL, (nativeWebsiteType ? "" : item.label))
                .withValue(android.provider.ContactsContract.CommonDataKinds.Website.URL, item.value)
                .build());
        });

        // Add Organization
        var nativeOrgType = helper.getNativeOrgType(this.organization.type);
        ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.Organization.CONTENT_ITEM_TYPE)
            .withValue(TYPE, new java.lang.Integer(nativeOrgType))
            .withValue(LABEL, (nativeOrgType ? "" : this.organization.type))
            .withValue(android.provider.ContactsContract.CommonDataKinds.Organization.DEPARTMENT, this.organization.department)
            .withValue(android.provider.ContactsContract.CommonDataKinds.Organization.COMPANY, this.organization.name)
            .withValue(android.provider.ContactsContract.CommonDataKinds.Organization.TITLE, this.organization.jobTitle)
            .withValue(android.provider.ContactsContract.CommonDataKinds.Organization.SYMBOL, this.organization.symbol)
            .withValue(android.provider.ContactsContract.CommonDataKinds.Organization.PHONETIC_NAME, this.organization.phonetic)
            .withValue(android.provider.ContactsContract.CommonDataKinds.Organization.OFFICE_LOCATION, this.organization.location)
            .build());

        // Add Photo
        if (this.photo && this.photo.android) {
            var stream = new java.io.ByteArrayOutputStream();
            this.photo.android.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, stream);

            ops.add(helper.getRawContactBuilder(rawId, android.provider.ContactsContract.CommonDataKinds.Photo.CONTENT_ITEM_TYPE)
                .withValue(IS_SUPER_PRIMARY, new java.lang.Integer(1))
                .withValue(android.provider.ContactsContract.CommonDataKinds.Photo.PHOTO, stream.toByteArray())
                .build());
        }

        // Perform the save
        var results = contentResolver.applyBatch(android.provider.ContactsContract.AUTHORITY, ops),
            contactId = android.content.ContentUris.parseId(results[0].uri);

        //Update our id for new contacts so that we can do something else with them if we choose.
        if (contactId !== this.id) {
            this.id = contactId;
        }
    };

    Contact.prototype.delete = function () {
        var mgr = android.accounts.AccountManager.get(appModule.android.foregroundActivity),
            accounts = mgr.getAccounts(),
            id = this.id,
            rawId = 0,
            contentResolver = appModule.android.foregroundActivity.getContentResolver(),
            ops = new java.util.ArrayList();

        if (accounts.length === 0) {
            throw new Error("No Accounts!");
        }

        if (id && id !== "") {
            var rawIdCursor = contentResolver.query(android.provider.ContactsContract.RawContacts.CONTENT_URI, ["_id"], "_id = " + id, null, null);
            if (!rawIdCursor.moveToFirst()) {
                throw new Error("Error optaining group id");
                return;
            }

            rawId = rawIdCursor.getString(rawIdCursor.getColumnIndex("_id"));
            rawIdCursor.close();

            ops.add(android.content.ContentProviderOperation.newDelete(android.provider.ContactsContract.RawContacts.CONTENT_URI)
                .withSelection("_id" + "=?", [rawId])
                .build());

            // Perform the delete
            contentResolver.applyBatch(android.provider.ContactsContract.AUTHORITY, ops);
        }
    };

    return Contact;
})(ContactCommon);

module.exports = Contact;
