trigger prodNameUpdater on OpportunityLineItem(after insert, after delete){
    List<Opportunity> opLst = new List<Opportunity>();
    if(trigger.isInsert){
        System.debug(trigger.new);
        For(OpportunityLineItem opl:Trigger.new){
            opLst.add(new Opportunity(Id=opl.OpportunityId,Opportunity_Product__c=opl.Name));
        }
        System.debug(opLst);
        Update opLst;
    }
    
    if(trigger.isDelete){
        for(OpportunityLineItem opl:trigger.old){
            opLst.add(new Opportunity(Id=opl.OpportunityId,Opportunity_Product__c=''));
                      
                      }
                      Update opLst;
                      }
                      }