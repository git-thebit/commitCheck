public with sharing class GenericDataSelector extends ObjectSelector{
    
    //Cache Result for subsequent use
    @AuraEnabled(Cacheable=true)
    public static Map<string,Object> getCachedRecords(Map<String, Object> params) {
        return getRecords(params);
    }
    
    @auraenabled
    public static Map<string,Object> getRecords(Map<String, Object> params)
    {
        String objectName = params.containsKey('objectName') ? (String)params.get('objectName') : null;
        String fields = params.containsKey('fields') ? (String)params.get('fields') : null;
        String sortBy = params.containsKey('sortBy') ? (String)params.get('sortBy') : null;
        String queryType = params.containsKey('queryType') ? (String)params.get('queryType') : null;
        Boolean sortAsc = params.containsKey('sortAsc') ? (Boolean)params.get('sortAsc') : false;
        Integer limitRecords = params.containsKey('limitRecords') ? Integer.valueOf(params.get('limitRecords')) : null;
        String condition = params.containsKey('whereCondition') ? (String)params.get('whereCondition') : null;
        try{
            String limitRecordsStr = String.valueOf(Integer.valueOf(limitRecords));
            GenericDataSelector obj=new GenericDataSelector();
            obj.fieldNames=fields;
            obj.limitRecords=limitRecordsStr;
            obj.objectName=objectName;
            obj.sortAsc=sortAsc;
            obj.sortBy=sortBy;
            obj.whereCondition=condition;
            Map<String, Object> returnMap = new Map<String, Object>();
            List<sObject> sObjectsList = new List<sObject>();
            sObjectsList=obj.selector();
            system.debug('sObjectsList:'+sObjectsList);
            returnMap.put('records', sObjectsList);
            return returnMap;
        }
        catch(Exception ex) {
            system.debug('Error => '+ex.getMessage());
            return null;
            // throw new ApplicationException(ex.getMessage());
        }   	
    }
}