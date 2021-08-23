public class dataHelper {
    @AuraEnabled( cacheable = true )
    public static List< sObject > fetchContacts() {
     
        return [ SELECT Id, Name, Account.Name, Email, Phone FROM Contact where Phone != null AND Added_to_Call_List__c = false LIMIT 10];
         
    }
}