# NativeScript Contacts

A NativeScript module providing easy access to iOS and Android contact directory. Pick a contact, update it, or add a new one.

## Installation

Run `tns plugin add nativescript-contacts`

## Usage

To use the contacts module you must first `require()` it.

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
    /// args.reponse: "selected" or "cancelled" depending on wheter the user selected a contact. 
    
    if (args.response === "selected") {
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
    }
});
```

#### Save a new contact

```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

var newContact = new contacts.Contact();
newContact.name.given = "John";
newContact.name.family = "Doe";
newContact.phoneNumbers.push({ label: contacts.KnownLabel.HOME, value: "123457890" }); // See below for known labels
newContact.phoneNumbers.push({ label: "My Custom Label", value: "11235813" });
newContact.save();
```

#### Update an existing contact
```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.getContact().then(function(args){
    if (args.response === "selected") {
        var contact = args.data;        
        contact.name.given = "Jane";
        contact.name.family = "Doe";
        contact.save();
    }
});
```

### Single User Data Structure
```js
{
    id : "";
    name = {
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
    nickname : "",
    organization : {
        name: "", 
        jobTitle: "", 
        department: "", 
        
        // Android Specific properties
        symbol: "",
        phonetic: "",
        location: "",
        type: ""
    },
    notes : "",

    phoneNumbers : [], 
    emailAddresses : [],
    postalAddresses : [],
    urls : []
}
```

### PhoneNumber / EmailAddress structure
``` js
{
    id: "",
    label: "",
    value: ""
}
```

### Url structure
``` js
{
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

### Known Labels (for Urls, Addresses and Phones)
The following constants are exposed from the plugin in the `KnownLabel` structure. See details bellow for what types and on what platform they are supported
* **HOME**  
iOS - *phone, email, postal, url*  
Android - *phone, email, postal, url*
* **WORK**  
iOS - *phone, email, postal, url*  
Android - *phone, email, postal, url*
* **OTHER**  
iOS - *phone, email, postal, url*  
Android - *phone, email, postal, url*
* **FAX_HOME**  
iOS - *phone*  
Android - *phone*
* **FAX_WORK**  
iOS - *phone*  
Android - *phone*
* **PAGER**  
iOS - *phone*  
Android - *phone*
* **MAIN**  
iOS - *phone*  
Android - *phone*
* **HOMEPAGE**  
iOS - *url*  
Android - *url*
* **CALLBACK**  
Android - *phone*
* **CAR**  
Android - *phone*
* **COMPANY_MAIN**  
Android - *phone*
* **ISDN**  
Android - *phone*
* **OTHER_FAX**  
Android - *phone*
* **RADIO**  
Android - *phone*
* **TELEX**  
Android - *phone*
* **TTY_TDD**  
Android - *phone*
* **WORK_MOBILE**  
Android - *phone*
* **WORK_PAGER**  
Android - *phone*
* **ASSISTANT**  
Android - *phone*
* **MMS**  
Android - *phone*
* **FTP**  
Android - *url*
* **PROFILE**  
Android - *url*
* **BLOG**  
Android - *url*

Those are the system labels but you can also use any custome label you want. 


### iOS
See apples docs on properties available: 
https://developer.apple.com/library/mac/documentation/Contacts/Reference/CNContact_Class/index.html#//apple_ref/occ/cl/CNContact

NOTE: Since the plugin uses the Contact framework it is supported only on iOS 9.0 and above!
