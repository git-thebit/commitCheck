public with sharing class CloseCaseController {
    @AuraEnabled(cacheable = true)
    public static List<CaseWrapper> getClosedCases(){
        List<CaseWrapper> caseList = new List<CaseWrapper>();
        try{
            for(Case caseRecord:[SELECT Id, CaseNumber, Subject, Status FROM Case WHERE Status!='Closed' LIMIT 50]){
                CaseWrapper wrapper = new CaseWrapper(caseRecord);
                caseList.add(wrapper);
            }
        }catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        return caseList;
    }

    public class CaseWrapper {
        @AuraEnabled
        public Case caseRecord { get; set;}
        @AuraEnabled
        public boolean isSelected { get; set;}

        public CaseWrapper(Case caseRecord ) {
            this.isSelected = false;
            this.caseRecord = caseRecord;
        }
    }
}