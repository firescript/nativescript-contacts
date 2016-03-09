var Group = (function () {
    function Group() {
        this.id="",
        this.name=""
    } 
    
    Group.prototype.initializeFromNative = function(nativeData) {
        // Abstract Method
    };

    Group.prototype.save = function() {
        // Abstract Method
    };
    
    return Group;
})();
module.exports = Group;
