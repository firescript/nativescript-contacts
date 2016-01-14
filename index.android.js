var appModule = require("application");

exports.one = function() {
    return new Promise(function(resolve, reject) {
        try {
            var PICK_CONTACT = 1001;

            var openContactsIntent = new android.content.Intent(android.content.Intent.ACTION_PICK);

            openContactsIntent.setType(android.provider.ContactsContract.Contacts.CONTENT_TYPE);

            var previousResult = appModule.android.onActivityResult;
            appModule.android.onActivityResult = function(requestCode, resultCode, data) {
                appModule.android.onActivityResult = previousResult;

                switch (requestCode) {
                    case PICK_CONTACT:
                        if (resultCode == android.app.Activity.RESULT_OK) {
                            var contactData = data.getData();
                            var contact = new android.content.CursorLoader(appModule.android.context, contactData, null, null, null, android.provider.ContactsContract.Contacts.DISPLAY_NAME);
                            return resolve({
                                response: "selected",
                                ios: null,
                                android: contact
                            });
                        }
                        break;
                    default:
                        return resolve({
                            response: {
                                code: resultCode,
                                data: data
                            },
                            ios: null,
                            android: null
                        });
                        break;
                }
            }

            appModule.android.foregroundActivity.startActivityForResult(openContactsIntent, PICK_CONTACT);
        } catch (e) {
            if (reject) {
                reject(e);
            }
        }
    });
}
