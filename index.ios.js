var frameModule = require("ui/frame");
var UserModel = require("./userModel");

var CustomCNContactPickerViewControllerDelegate = NSObject.extend({    
    initWithResolveReject: function(resolve, reject) {
        var self = this.super.init();
        if(self) {
            this.resolve = resolve;
            this.reject = reject;
        }
        return self;
    },
    contactPickerDidCancel: function(controller){
        this.resolve({
           data: null,
           response: "cancelled",
           ios: null,
           android: null 
        });
    },
    contactPickerDidSelectContact: function(controller, contact) {        
        controller.dismissModalViewControllerAnimated(true);
        
        //Convert the native contact object
        var user = new UserModel();
        user.initalize(contact);
        
        this.resolve({
            data: user,
            response: "selected",
            ios: contact,
            android: null
        });        
        CFRelease(controller.delegate);
    }
}, {
    protocols: [CNContactPickerDelegate]
});

exports.getContact = function (){
    return new Promise(function (resolve, reject) {  
        var controller = CNContactPickerViewController.alloc().init();
        var delegate = CustomCNContactPickerViewControllerDelegate.alloc().initWithResolveReject(resolve, reject);
        
        CFRetain(delegate);
        controller.delegate = delegate;
        
        var page = frameModule.topmost().ios.controller;
        page.presentModalViewControllerAnimated(controller, true);
    });
}

