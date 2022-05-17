public class asy {
    
    @AuraEnabled
    public static Contact getContactDetails(String account, String name){
        return [ SELECT Id, Name, Account.Name 
                 FROM Contact
                 WHERE Account.Name = :account AND Name = :name ];
    }
 
    @AuraEnabled
    public static string getTextMethod1(){
        return 'APEX-METHOD-1';
    }
 
    @AuraEnabled
    public static string getTextMethod2(String message1){
        return 'APEX-METHOD-2';
    }
 
    @AuraEnabled
    public static string getTextMethod3(){
        return 'APEX-METHOD-3';
    }
}