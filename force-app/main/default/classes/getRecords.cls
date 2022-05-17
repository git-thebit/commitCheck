public with sharing class getRecords {
    @AuraEnabled(cacheable=true)
    public static List<Object> getData(String objectType){
        try {
            system.debug(objectType);
            String query = objectType =='Account'? 'SELECT Id, Name, Type, Phone FROM '+objectType+' WHERE Added_to_Call_List__c = false LIMIT 10':
            objectType == 'Lead'? 'SELECT Id, Name, Phone, Company, Email FROM '+ objectType+' WHERE Added_to_Call_List__c = false AND IsConverted = false LIMIT 10':
            'SELECT Id, Name, Email, Account.Name, Phone FROM '+ objectType+' WHERE Added_to_Call_List__c = false AND AccountId != null LIMIT 10';
            
            // String query = 'SELECT Id, Name, Email, Phone FROM '+ objectType+' WHERE Added_to_Call_List__c = false LIMIT 10';
            return Database.query(query);
            
        } catch (DmlException e) {
            system.debug(e.getDmlMessage(0));
            throw new AuraHandledException(e.getMessage());
        }
    }
}