declare module "nativescript-contacts" {
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

        phoneNumbers: ContactField[];
        emailAddresses: ContactField[];
        postalAddresses: ContactAddressField[];
        urls: ContactField[];

        public save();
    }

    export interface GetContactResult {
        data: Contact;
        ios: any; // TODO: Change to CNContact once it is added to {N}'s .d.ts
        android: android.database.Cursor
    }

    export function getContact(): Promise<GetContactResult>;
}