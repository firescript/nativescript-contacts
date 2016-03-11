# NativeScript Contacts

A NativeScript module providing easy access to iOS and Android contact directory. Pick a contact, update it, delete it, or add a new one. 
Working with groups available in 1.5.0.  Create a group, add and remove contacts to the group, and delete a group.

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
var imageSource = require( "image-source" );

var newContact = new contacts.Contact();
newContact.name.given = "John";
newContact.name.family = "Doe";
newContact.phoneNumbers.push({ label: contacts.KnownLabel.HOME, value: "123457890" }); // See below for known labels
newContact.phoneNumbers.push({ label: "My Custom Label", value: "11235813" });
newContact.photo = imageSource.fromFileOrResource("~/photo.png");
newContact.save();
```

#### Update an existing contact
```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );
var imageSource = require( "image-source" );

contacts.getContact().then(function(args){
    if (args.response === "selected") {
        var contact = args.data;        
        contact.name.given = "Jane";
        contact.name.family = "Doe";
        
        imageSource.fromUrl("http://www.google.com/images/errors/logo_sm_2.png").then(function (src) {
            contact.photo = src;
            contact.save();
        });
    }
});
```

####Delete a contact

```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.getContact().then(function(args){
    /// Returns args:
    /// args.data: Generic cross platform JSON object
    /// args.reponse: "selected" or "cancelled" depending on wheter the user selected a contact. 
    
    if (args.response === "selected") {
        var contact = args.data; //See data structure below
        contact.delete();
    }
});
```

####getContactsByName: Find all contacts whose name matches. Returns an array of contact data.

```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.getContactsByName("Hicks").then(function(args){
    console.log("getContactsByName Complete");
    console.log(JSON.stringify(args));
    /// Returns args:
    /// args.data: Generic cross platform JSON object, null if no contacts were found.
    /// args.reponse: "fetch"
}, function(err){
    console.log("Error: " + err);
});
```

####getAllContacts: Find all contacts. Returns an array of contact data.

```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.getAllContacts().then(function(args){
    console.log("getAllContacts Complete");
    console.log(JSON.stringify(args));
    /// Returns args:
    /// args.data: Generic cross platform JSON object, null if no contacts were found.
    /// args.reponse: "fetch"
}, function(err){
    console.log("Error: " + err);
});
```

####getGroups: Find groups. Returns an array of group data.

```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.getGroups("Test Group") //[name] optional. If defined will look for group with the specified name, otherwise will return all groups.
    .then(function(args){
        console.log("getGroups Complete");
        console.log(JSON.stringify(args));
        /// Returns args:
        /// args.data: Generic cross platform JSON object, null if no groups were found.
        /// args.reponse: "fetch"
        
        if(args.data === null){
            console.log("No Groups Found!");
        }
        else{
            console.log("Group(s) Found!");
        }
        
    }, function(err){
        console.log("Error: " + err);
    });
```

####Save a new group

```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

var groupModel = new contacts.Group();
groupModel.name="Test Group";
//Save Argument (boolean)
//iOS: [false=> Use Local Container, true=> Use Default Container]
//Android: will always be true, setting this value will not affect android.
groupModel.save(false); 
```

####Delete a group

```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.getGroups("Test Group")
.then(function(args){
    console.log("getGroups Complete");
    console.log(JSON.stringify(args));
    /// Returns args:
    /// args.data: Generic cross platform JSON object, null if no groups were found.
    /// args.reponse: "fetch"
        
    if(args.data !== null){
        console.log("Group(s) Found!");
        args.data[0].delete(); //Delete the first found group
    }
}, function(err){
        console.log("Error: " + err);
});
```

####Add Member To Group
```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.getContact().then(function(args){
    /// Returns args:
    /// args.data: Generic cross platform JSON object
    /// args.reponse: "selected" or "cancelled" depending on wheter the user selected a contact. 
    
    if (args.response === "selected") {
        var contact = args.data; //See data structure below
        contacts.getGroups("Test Group")
        .then(function(a){
            if(a.data !== null){
                var group = a.data[0];
                group.addMember(contact);
            }
        }, function(err){
            console.log("Error: " + err);
        });
    }
});
```

####Remove Member From Group
```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.getGroups("Test Group") //[name] optional. If defined will look for group with the specified name, otherwise will return all groups.
.then(function(args){
    if(args.data !== null){
        var group = args.data[0];
            
        contacts.getContactsInGroup(group).then(function(a){
            /// Returns args:
            /// args.data: Generic cross platform JSON object, null if no groups were found.
            /// args.reponse: "fetch"
            console.log("getContactsInGroup complete");

            if(a.data !== null){
                a.data.forEach(function(c,idx){
                    group.removeMember(c);
                });
            }
        }, function(err){
            console.log("Error: " + err);
        });
    }
}, function(err){
    console.log("Error: " + err);
});
```

####getContactsInGroup: Get all contacts in a group. Returns an array of contact data.

```js
var app = require( "application" );
var contacts = require( "nativescript-contacts" );

contacts.getGroups("Test Group") //[name] optional. If defined will look for group with the specified name, otherwise will return all groups.
.then(function(args){
    if(args.data !== null){
        var group = args.data[0];
            
        contacts.getContactsInGroup(group).then(function(a){
            console.log("getContactsInGroup complete");
            /// Returns args:
            /// args.data: Generic cross platform JSON object, null if no groups were found.
            /// args.reponse: "fetch"
        }, function(err){
            console.log("Error: " + err);
        });
    }
}, function(err){
    console.log("Error: " + err);
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
    photo: null, // {N} ImageSource instance
    
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

Those are the system labels but you can also use any custom label you want. 

### Single Group Data Structure
```js
{
    id : "";
    name : "";
}
```

### iOS
See apples docs on properties available: 
https://developer.apple.com/library/mac/documentation/Contacts/Reference/CNContact_Class/index.html#//apple_ref/occ/cl/CNContact

NOTE: Since the plugin uses the Contact framework it is supported only on iOS 9.0 and above!
