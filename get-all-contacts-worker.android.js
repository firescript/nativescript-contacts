require('globals'); // necessary to bootstrap tns modules on the new thread
var Contact = require("./contact-model");
var helper = require("./contact-helper");

/* pass debug messages to main thread since web workers do not have console access */
function console_log(msg) { postMessage({ type: 'debug', message: msg }); }
function console_dump(msg) { postMessage({ type: 'dump', message: msg }); }

self.onmessage = function (event) {
  try {
    var c = helper.getContext().getContentResolver().query(android.provider.ContactsContract.Contacts.CONTENT_URI, null, null, null, null);

    if(c.getCount() > 0){
      var cts = [];
      while(c.moveToNext()){
        var contactModel = new Contact();
        contactModel.initializeFromNative(c,event.data.contactFields);
        cts.push(contactModel);
      }
      c.close();
      postMessage({ type: 'result', message: { data: cts, response: "fetch" }});
    } else {
      c.close();
      postMessage({ type: 'result', message: { data: null, response: "fetch" }})
    }
  } catch (e) { postMessage({ type: 'result', message: e }); }
}
