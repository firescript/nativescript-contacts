var appModule = require("application");

exports.one = function() {
    return new Promise(function(resolve, reject) {
        try {
            var PICK_CONTACT = 1001;
            var openContactsIntent = new android.content.Intent(android.content.Intent.ACTION_PICK);
            openContactsIntent.setType(android.provider.ContactsContract.Contacts.CONTENT_TYPE);
            var previousResult = appModule.android.onActivityResult;
            appModule.android.onActivityResult = function(requestCode, resultCode, data) {
                switch (requestCode) {
                    case PICK_CONTACT:
                        appModule.android.onActivityResult = previousResult;
                        if (resultCode === android.app.Activity.RESULT_OK && data != null) {
                            var contactData = data.getData();
                            var contact = appModule.android.context.getContentResolver().query(contactData, null, null, null, null);
                            if (!contact) {
                                reject();
                                return;
                            }
                            contact.moveToFirst();
                            data = DBGetRowObjectNative(contact);
                            return resolve({
                                response: "selected",
                                ios: null,
                                android: data
                            });
                        } else {
                            reject();
                        }
                        break;
                    default:
                        if (typeof previousResult === 'function') {
                            previousResult(requestCode, resultCode, data);
                        }
                        break;
                }
            };
            appModule.android.foregroundActivity.startActivityForResult(openContactsIntent, PICK_CONTACT);
        } catch (e) {
            if (reject) {
                reject(e);
            }
        }
    });
}

function DBGetRowObjectNative(cursor) {
    //noinspection JSUnresolvedFunction
    var count = cursor.getColumnCount();
    var results = {};
    for (var i=0;i<count;i++) {
        var type = cursor.getType(i);
        //noinspection JSUnresolvedFunction
        var name = cursor.getColumnName(i);
        switch (type) {
            case 0: // NULL
                results[name] = null;
                break;
            case 1: // Integer
                //noinspection JSUnresolvedFunction
                results[name] = cursor.getInt(i);
                break;
            case 2: // Float
                //noinspection JSUnresolvedFunction
                results[name] = cursor.getFloat(i);
                break;
            case 3: // String
                results[name] = cursor.getString(i);
                break;
            case 4: // Blob
                results[name] = cursor.getBlob(i);
                break;
            default:
                throw new Error('Contacts - Unknown Field Type '+ type);
        }
    }
    return results;
}