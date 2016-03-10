var helper = require("./contact-helper");
var GroupCommon = require("./group-model-common");

var Group = (function (_super) {
    global.__extends(Group, _super);

    function Group(){
        _super.apply(this, arguments);
    }
    
    Group.prototype.initializeFromNative = function(groupData) {
        this.id = groupData["identifier"];
        this.name = groupData["name"];
    };
    
    Group.prototype.save = function (useDefault) {
        var isUpdate = false,
        store = new CNContactStore(),
        groupRecord,
        containerID = null;
        
        if(!useDefault){
            var foundContainers = store.containersMatchingPredicateError(null,null);
            if(foundContainers.count > 0){
                for(var i=0; i < foundContainers.count; i++){
                    if(foundContainers[i]["type"] === CNContainerType.Local){
                        containerID = foundContainers[i]["identifier"];
                        break;
                    }
                }
            }
        }
        
        if (this.id && this.id !== "") {
            var searchPredicate = CNGroup.predicateForGroupsWithIdentifiers([this.id]);
            var foundGroups = store.groupsMatchingPredicateError(searchPredicate, null);
            if (foundGroups.count > 0) {
                groupRecord = foundGroups[0].mutableCopy();
                isUpdate = true;
            }
        }
        
        if (!groupRecord) {
            groupRecord = new CNMutableGroup();
        }
        
        groupRecord.name = this.name;
        
        var saveRequest = new CNSaveRequest();
        if (isUpdate) {
            saveRequest.updateGroup(groupRecord)
        }
        else {
            saveRequest.addGroupToContainerWithIdentifier(groupRecord, containerID);
        }
        
        var error;
        store.executeSaveRequestError(saveRequest, error);
        
        if (error) {
            throw new Error(error.localizedDescription);
        }
    };
    
    Group.prototype.delete = function(){
        var groupRecord,
        store = new CNContactStore();
        
        if (this.id && this.id !== "") {
            var searchPredicate = CNGroup.predicateForGroupsWithIdentifiers([this.id]);
            var foundGroups = store.groupsMatchingPredicateError(searchPredicate, null);
            if (foundGroups.count > 0) {
                groupRecord = foundGroups[0].mutableCopy();
            }
        }
        
        if(groupRecord){
            var saveRequest = new CNSaveRequest();
            saveRequest.deleteGroup(groupRecord)
            var error;
            store.executeSaveRequestError(saveRequest, error);
            
            if (error) {
                throw new Error(error.localizedDescription);
            }
        }
    };
    
    Group.prototype.addMember = function(contact){
        var groupRecord,
        contactRecord,
        searchPredicate,
        store = new CNContactStore();
        
        //Get groupRecord
        if (this.id && this.id !== "") {
            searchPredicate = CNGroup.predicateForGroupsWithIdentifiers([this.id]);
            var foundGroups = store.groupsMatchingPredicateError(searchPredicate, null);
            if (foundGroups.count > 0) {
                groupRecord = foundGroups[0].mutableCopy();
            }
        }
        //Get contactRecord
        if (contact.id && contact.id !== "") {
            searchPredicate = CNContact.predicateForContactsWithIdentifiers([contact.id]);
            var keysToFetch = [
                "givenName", 
                "familyName", 
                "middleName", 
                "namePrefix", 
                "nameSuffix", 
                "phoneticGivenName", 
                "phoneticMiddleName", 
                "phoneticFamilyName", 
                "nickname", 
                "jobTitle", 
                "departmentName", 
                "organizationName", 
                "notes", 
                "phoneNumbers", 
                "emailAddresses", 
                "postalAddresses", 
                "urlAddresses", 
                "imageData"
            ]; // All Properties that we are changing
            var foundContacts = store.unifiedContactsMatchingPredicateKeysToFetchError(searchPredicate, keysToFetch, null);
            if (foundContacts.count > 0) {
                contactRecord = foundContacts[0].mutableCopy();
            }
        }
        
        //Do Add To Group
        if(groupRecord && contactRecord){
            var saveRequest = new CNSaveRequest();
            saveRequest.addMemberToGroup(contactRecord, groupRecord);
            var error;
            store.executeSaveRequestError(saveRequest, error);
            
            if (error) {
                throw new Error(error.localizedDescription);
            }
        }
    };
    Group.prototype.removeMember = function(contact){
        var groupRecord,
        contactRecord,
        searchPredicate,
        store = new CNContactStore();
        
        //Get groupRecord
        if (this.id && this.id !== "") {
            searchPredicate = CNGroup.predicateForGroupsWithIdentifiers([this.id]);
            var foundGroups = store.groupsMatchingPredicateError(searchPredicate, null);
            if (foundGroups.count > 0) {
                groupRecord = foundGroups[0].mutableCopy();
            }
        }
        //Get contactRecord
        if (contact.id && contact.id !== "") {
            searchPredicate = CNContact.predicateForContactsWithIdentifiers([contact.id]);
            var keysToFetch = [
                "givenName", 
                "familyName", 
                "middleName", 
                "namePrefix", 
                "nameSuffix", 
                "phoneticGivenName", 
                "phoneticMiddleName", 
                "phoneticFamilyName", 
                "nickname", 
                "jobTitle", 
                "departmentName", 
                "organizationName", 
                "notes", 
                "phoneNumbers", 
                "emailAddresses", 
                "postalAddresses", 
                "urlAddresses", 
                "imageData"
            ]; // All Properties that we are changing
            var foundContacts = store.unifiedContactsMatchingPredicateKeysToFetchError(searchPredicate, keysToFetch, null);
            if (foundContacts.count > 0) {
                contactRecord = foundContacts[0].mutableCopy();
            }
        }
        
        //Do Remove From Group
        if(groupRecord && contactRecord){
            var saveRequest = new CNSaveRequest();
            saveRequest.removeMemberFromGroup(contactRecord, groupRecord);
            var error;
            store.executeSaveRequestError(saveRequest, error);
            
            if (error) {
                throw new Error(error.localizedDescription);
            }
        }
    };
    
    return Group;
})(GroupCommon)
module.exports = Group;
