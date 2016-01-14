var appModule = require("application");

exports.pick = function(){
    var PICK_CONTACT = 1001;

    var openContactsIntent = new android.content.Intent(android.content.Intent.ACTION_PICK);
    
    openContactsIntent.setType(android.provider.ContactsContract.Contacts.CONTENT_TYPE);
   
   var previousResult = appModule.android.onActivityResult;
    appModule.android.onActivityResult = function (requestCode, resultCode, data) {
        appModule.android.onActivityResult = previousResult;
        
        switch(requestCode){
            case PICK_CONTACT:
                debugger;   
                if (resultCode == android.app.Activity.RESULT_OK) {
                    var contactData = data.getData();
                    var loader = new android.content.CursorLoader(appModule.android.context, contactData, null, null, null, android.provider.ContactsContract.Contacts.DISPLAY_NAME);
                    console.log(contactData);
                }
                break;
        }
    }
    
    appModule.android.foregroundActivity.startActivityForResult(openContactsIntent, PICK_CONTACT); 
}