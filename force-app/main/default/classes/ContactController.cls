public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        return [SELECT Id, Name, Email, Title, Phone FROM Contact LIMIT 30];
    }
}