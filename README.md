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

### Methods

####getContact: Pick one contact and bring back its data.

```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.getContact().then(function(args){
    /// Returns args:
    /// args.data: Generic cross platform JSON object
    /// args.ios: Raw iOS object before conversion
    /// args.android.cursor: Raw Android object before conversion
    /// args.android.data: JSONified cursor 
    
    var contact = args.data; //See data structure below
    
    // lets say you wanted to grab first name and last name
    console.log(contact.name.given + " " + contact.name.family);
    
    //lets say you want to get the phone numbers
    contact.phoneNumbers.forEach(function(phone){
        console.log(phone.value);
    });

    //lets say you want to get the addresses
    contact.postalAddresses.forEach(function(address){
        console.log(address.location.street);
    });
});
```

### Single User Data Structure
```js
    id : "";
    name : {
        given: "",
        middle: "",
        family: "",
        prefix: "",
        suffix: "",
        phonetic: {
            first: "",
            middle: "",
            last: ""   
        }
    }
    
    jobTitle : "";
    nickname : "";
    department : "";
    organization : "";
    notes : "";

    phoneNumbers : []; 
    emailAddresses : [];
    postalAddresses : [];
```

### PhoneNumber structure
``` js
{
    id: "",
    label: "",
    value: ""
}
```

### EmailAddress structure
``` js
{
    id: "",
    label: "",
    value: ""
}
```

### PostalAddress structure
``` js
{
    id: "",
    label: "",
    location: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        countryCode: "",
    }
}
```

### iOS
See apples docs on properties available: 
https://developer.apple.com/library/mac/documentation/Contacts/Reference/CNContact_Class/index.html#//apple_ref/occ/cl/CNContact
