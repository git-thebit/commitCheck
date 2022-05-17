trigger CreateOrderandOrderItem on Opportunity (after insert,after update) {
    
 
    List<Order> lstord=new List<Order>();
    List<OrderItem> OrderItemlst=new List<OrderItem>();
     List<Id> OpportunityId=new List<Id>();
    Map<Id,Integer> OLIsize=new Map<Id,Integer>();
    Map<Id,Order> Ordermap=new Map<Id,Order>();
    Map<id,list<OpportunityLineItem>> myOLI=new map<id,list<OpportunityLineItem>>();
    
    List<OpportunityLineItem> oppLineItems; 
    oppLineItems=[ Select Id from OpportunityLineItem  ];
   
    
    
    
    system.debug('inside CreateOrderandOrderItem');
    for (Opportunity opp:[select Id ,Name,AccountId,StageName,(select Id from OpportunityLineItems) from Opportunity where id IN:Trigger.new]){
        if(opp.StageName=='Closed Won' && opp.OpportunityLineItems.size()>0){
            OLIsize.put(opp.Id, opp.OpportunityLineItems.size());
            OpportunityId.add(opp.Id);
            Order o=new Order();
            o.Name=opp.Name;
            o.OpportunityId=opp.Id;
            o.Status='Draft';
            o.AccountId=opp.AccountId;
            o.EffectiveDate=system.today();
            Ordermap.put(Opp.Id,o);
            system.debug('Oreder++++'+lstord);
        }
    }system.debug('OLIsize'+OLIsize);
    if(Ordermap.size()>0){
        system.debug('Orderlist'+Ordermap);
        insert Ordermap.values(); 
    }
     
  
    for(Id opp:OLIsize.keySet()){
        for(Integer i=0;i<OLIsize.get(opp);i++){
            OrderItem OI=new OrderItem();
            OI.OrderId=Ordermap.get(opp).Id;
            
            OI.UnitPrice=1000.00;
            OI.Quantity=1;
           OI.PricebookEntryId='';
            OrderItemlst.add(OI);
        } 
       
    }
    if(!OrderItemlst.isEmpty()){
        insert OrderItemlst;
    }
}