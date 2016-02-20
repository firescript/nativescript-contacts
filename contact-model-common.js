var helper = require("./contact-helper");

var Contact = (function () {
    function Contact() {
        this.id = "";
        this.name = {
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
        
        this.organization = {
            name: "",
            jobTitle: "",
            department: "",
        }
        
        this.nickname = "";
        this.notes = "";

        this.urls = [];
        this.phoneNumbers = [];
        this.emailAddresses = [];
        this.postalAddresses = [];
    } 
    
    Contact.prototype.initializeFromNative = function(nativeData) {
        // Abstract Method
    };

    Contact.prototype.save = function() {
        // Abstract Method
    };
    
    /// TODO: NOT FUNCTIONAL ATM
    Contact.prototype.getAvatar = function(){
        return helper.getAvatar();
    }

    return Contact;
})();

module.exports = Contact;