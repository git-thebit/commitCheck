public with sharing class getRecords {
    @AuraEnabled(cacheable=true)
    public static List<Object> getData(String objectType){
        try {
            // String query = objectType =='Account'?'SELECT Id, Name, Email__c, Phone FROM '+objectType+' WHERE Phone != null AND Added_to_Call_List__c = false LIMIT 10':'SELECT Id, Name, Account.Name, Email, Phone FROM '+ objectType+' WHERE Phone != null AND Added_to_Call_List__c = false LIMIT 10';
            String query = 'SELECT Id, Name, Account.Name, Email, Phone FROM '+ objectType+' WHERE Phone != null AND Added_to_Call_List__c = false LIMIT 10';
            return Database.query(query);
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
