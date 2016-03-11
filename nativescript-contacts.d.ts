declare module "nativescript-contacts" {
    import imageSource = require("image-source");
    
    export interface ContactField {
        id?: string;
        label: string;
        value: string;
    }

    export interface AddressLocation {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
        countryCode?: string;
        formatted?: string;
    }

    export interface ContactAddressField {
        id?: string;
        label: string;
        location: AddressLocation;
    }

    export interface ContactPhoneticName {
        given?: string;
        middle?: string;
        family?: string;
    }

    export interface ContactName {
        given?: string;
        middle?: string;
        family?: string;
        prefix?: string;
        suffix?: string;
        displayname?: string;
        phonetic?: ContactPhoneticName
    }

    export interface Organization {
        name?: string;
        jobTitle?: string;
        department?: string;

        // Android Specific
        symbol?: string;
        phonetic?: string;
        location?: string;
        type?: string;
    }

    export class Contact {
        id: string;
        name: ContactName;
        nickname: string;
        organization: Organization;
        notes: string;
        photo: imageSource.ImageSource

        phoneNumbers: ContactField[];
        emailAddresses: ContactField[];
        postalAddresses: ContactAddressField[];
        urls: ContactField[];

        public save();
    }

    export interface KnownLabel {
        HOME: string;
        MOBILE: string;
        WORK: string;
        FAX_WORK: string;
        FAX_HOME: string;
        PAGER: string;
        HOMEPAGE: string;
        MAIN: string;
        OTHER: string;
        
        // Android Specific                
        CALLBACK: string;
        CAR: string;
        COMPANY_MAIN: string;
        ISDN: string;
        OTHER_FAX: string;
        RADIO: string;
        TELEX: string;
        TTY_TDD: string;
        WORK_MOBILE: string;
        WORK_PAGER: string;
        ASSISTANT: string;
        MMS: string;
        FTP: string;
        PROFILE: string;
        BLOG: string;
    }
    
    export interface GetContactResult {
        data: Contact;
        response: string; // "selected" or "cancelled"
    }
    
    export interface GetFetchResult {
        data: Contact[];
        response: string; // "fetch"
    }

    export function getContact(): Promise<GetContactResult>;
    export function getContactsByName(): Promise<GetFetchResult>;
    export function getAllContacts(): Promise<GetFetchResult>;
    export function getContactsInGroup(): Promise<GetFetchResult>;

    export class Group {
        id: string;
        name: string;
    }

    export interface GetGroupResult {
        data: Group[];
        response: string; // "fetch"
    }
        
    export function getGroups(): Promise<GetGroupResult>;
}
