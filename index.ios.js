var frameModule = require("ui/frame");

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
           response: "cancelled",
           ios: null,
           android: null 
        });
    },
    contactPickerDidSelectContact: function(controller, contact) {        
        controller.dismissModalViewControllerAnimated(true);
        this.resolve({
            response: "selected",
            ios: contact,
            android: null
        });        
        CFRelease(controller.delegate);
    }
}, {
    protocols: [CNContactPickerDelegate]
});

function one(){
    return new Promise(function (resolve, reject) {  
        var controller = CNContactPickerViewController.alloc().init();
        var delegate = CustomCNContactPickerViewControllerDelegate.alloc().initWithResolveReject(resolve, reject);
        CFRetain(delegate);
        controller.delegate = delegate;
        var page = frameModule.topmost().ios.controller;
        page.presentModalViewControllerAnimated(controller, true);
    });
}

exports.one = one;