# NativeScript Contacts

A NativeScript module providing easy access to iOS contact directory to pick a contact and return its data.
* Android not built yet. Feel free 👊

## Installation

Run `tns plugin add nativescript-contacts`

## Usage

To use the messenger module you must first `require()` it.

```js
var contacts = require( "nativescript-contacts" );
```

### Method

####one: Pick one contact and bring back its data.

```js
var contacts = require( "nativescript-contacts" );
contacts.one().then(function(args){
    
    // we must specify ios as its directory is different then android.
    var contact = args.ios;
    // lets say you wanted to grab first name and last name phone number and email 
    console.log(contact.givenName + " " + contact.familyName);
    // phoneNumbers returns an array, so we are just going to grab the first one
    console.log(contact.phoneNumbers[0].value.stringValue); 
    // emailAddresses returns an array, so we are just going to grab the first one
    console.log(contact.emailAddresses[0].value);        
    
});;
```

See apples docs on properties available: 
https://developer.apple.com/library/mac/documentation/Contacts/Reference/CNContact_Class/index.html#//apple_ref/occ/cl/CNContact