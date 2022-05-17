trigger contactTrigger on Contact (before update) {
    
Map<String, Schema.FieldSet> FsMap = 
    Schema.SObjectType.contact.fieldSets.getMap();
    //system.debug(FsMap);
    List<Schema.FieldsetMember> schemaSet = SObjectType.contact.fieldsets.test1.getFields();
    integer i = 0;
    //for(Schema.fieldSetMember fs:schemaSet)
   // {
    
   // }
    
    List<schema.fieldSetMember> scm = SObjectType.contact.fieldsets.test1.getFields();
       // integer limt=trigger.new.size();
       // integer k = 0;
        //List<contact> conList = trigger.new;
        //list<contact> conr = trigger.new;
        //integer count = 0;
        String ms = '';
        for(schema.fieldSetMember s:scm){
            for(contact con:trigger.new){
                if(con.get(s.getfieldpath())== null){
                    ms+=s.getfieldpath()+' ';
                }
                con.addError('Please fill '+ms);
                
            }  
            
        }
        
        

    
    for(contact con:trigger.new){
    /*integer scmS = scm.size();
            //system.debug(s.getfieldpath());
            //system.debug(scm[0].getFieldpath());
            count++;
            //system.debug(trigger.newMap.get());
            system.debug(k);
            
            system.debug(conList[k].get(s.getfieldpath()));
            if(count == scmS-1){
                break;
            }*/
    //system.debug(con.get(schemaSet[i].getFieldPath()));
        //system.debug(con.get(schemaset[0].getFieldPath()));
       // sobject recordId = con.get(schemaset[0].getFieldPath());
        //trigger.newMap.get(recordId).get()

    }

}