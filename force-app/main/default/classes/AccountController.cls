public with sharing class AccountController {
 
    @AuraEnabled( cacheable = true )
    public static List< contact > fetchAccounts() {
     
        return [ SELECT Id, Name, Account_Name__c, Email, Phone FROM Contact where Phone != null LIMIT 10];
         
    }
     
}