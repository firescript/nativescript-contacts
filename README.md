# NativeScript Contacts

A NativeScript module providing easy access to your phones contact directory to pick a contact and return its data.

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
    console.log(args.ios.givenName);
});;
```