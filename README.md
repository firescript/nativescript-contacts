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
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.one().then(function(args){
    if (app.ios) {
        var contact = args.ios;
        
        // lets say you wanted to grab first name and last name phone number and email 
        console.log(contact.givenName + " " + contact.familyName);
        
        // phoneNumbers and emailAddresses return an array, 
        // however if you dont have a number or email it will crash.
        // so lets check to see if it exists using the count property
        if(contact.phoneNumbers.count > 0){
            console.log(contact.phoneNumbers[0].value.stringValue);
        }
        if(contact.emailAddresses.count > 0){
            console.log(contact.emailAddresses[0].value);        
        }          
    }
    else if (app.android) {
        var contact = args.android;
    }
});
```

### iOS
See apples docs on properties available: 
https://developer.apple.com/library/mac/documentation/Contacts/Reference/CNContact_Class/index.html#//apple_ref/occ/cl/CNContact