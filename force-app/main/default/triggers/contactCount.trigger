trigger contactCount on Contact (after insert, after update, after delete, after undelete) {
    Set<Id> accIds = new Set<Id>();
    if(trigger.isInsert || trigger.isUpdate || trigger.isUndelete) {
        for(Contact con:trigger.new){
            if(trigger.isUpdate && trigger.newMap.get(con.Id).AccountId!=trigger.oldMap.get(con.Id).AccountId ){
                if(con.AccountId!=null){
               		accIds.add(con.AccountId);
                }
                accIds.add(trigger.oldMap.get(con.Id).AccountId);
            }
            if(con.AccountId !=null && trigger.isInsert){
				accIds.add(con.AccountId);
            }
            if(con.AccountId !=null && trigger.isUndelete){
                accIds.add(con.AccountId);
            }
            
        }
        if(accIds.size()>0){
			Map<Id,Account> acMap = new Map<Id,Account>([SELECT Id, contact_count__c, (SELECT Id, Name FROM Contacts) FROM Account WHERE Id IN :accIds]);
            for(Account ac:acMap.values()){
                ac.contact_count__c = ac.contacts.size();
            }
            update acMap.values();
        }
    }
    if(trigger.isDelete){
        for(Contact con:trigger.old){
            if(con.AccountId !=null){
                accIds.add(con.AccountId);
            }
        }
        if(accIds.size()>0){
            List<AggregateResult> agMap = new List<AggregateResult>([SELECT count(Id),AccountId FROM Contact WHERE AccountId IN :accIds GROUP BY AccountId]);
            	System.debug(agMap);
            Map<Id,Account> acMap = new Map<Id,Account>([SELECT Id, contact_count__c, (SELECT Id, Name FROM Contacts) FROM Account WHERE Id IN :accIds]);
            for(Account ac:acMap.values()){
                ac.Contact_count__c = ac.contacts.size();
            }
            update acMap.values();
        }
    }
}