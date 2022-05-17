public virtual class ObjectSelector {
    public string objectName{get;set;}
    public string fieldNames{get;set;}
    public string whereCondition{get;set;}
    public string sortBy{get;set;}
    public boolean sortAsc{get;set;}
    public string limitRecords{get;set;}
    
    public ObjectSelector() {
        sortBy= 'Id';
    }
	public virtual List<sObject> selectByRecordId(Id recordId)
    {
        whereCondition='Id=\''+recordId+'\'';
        return (List<sObject>)selector();
    }
    public virtual List<sObject> selector()
    {
        String simpleQuery = 'select {0} FROM {1}';
        String conditionalQuery = 'select {0} FROM {1} WHERE {2}';  
        String executeQuery='';

        if(string.isNotBlank(whereCondition)){
            executeQuery=String.format(conditionalQuery, new List<Object>{fieldNames, objectName, whereCondition});
        } else{
           executeQuery=String.format(simpleQuery, new List<Object>{fieldNames, objectName});
        }
        if(String.isNotBlank(limitRecords)) {
                executeQuery += ' LIMIT ' + limitRecords;
        }
        if(String.isNotBlank(sortBy)){
                executeQuery += ' ORDER BY ' + sortBy + (sortAsc?' ASC ':' DESC ');
        }
        //executeQuery += ' WITH SECURITY_ENFORCED';
        system.debug('executeQuery:'+executeQuery);
        return (List<sObject>) Database.query(executeQuery);
    }
    
    public boolean deleteByCondition(string condition,string fieldNames)
    {
        fieldNames=fieldNames;
        whereCondition=condition;
        List<sObject> deletionList=(List<sObject>)selector();
        if(deletionList.size()>0)
        {
           delete deletionList;
        }
        return true;
    }
}