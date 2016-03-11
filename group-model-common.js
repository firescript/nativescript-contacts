var Group = (function () {
    function Group() {
        this.id="",
        this.name=""
    } 
    
    Group.prototype.initializeFromNative = function(nativeData) {
        // Abstract Method
    };

    Group.prototype.save = function(useDefault) {
        // Abstract Method
    };
    
    Group.prototype.delete = function() {
        // Abstract Method
    };
    Group.prototype.addMember = function(contact){
        // Abstract Method
    };
    Group.prototype.removeMember = function(contact){
        // Abstract Method
    };
    
    return Group;
})();
module.exports = Group;
