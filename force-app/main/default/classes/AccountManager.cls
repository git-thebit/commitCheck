@RestResource(urlMapping='/v1/Account/*')
global class AccountManager {
    @httpGet
    global static void getAccountInfo() {
        RestRequest request = RestContext.request;
        String accountId = request.requestURI.substring(request.requestURI.lastIndexOf('/')+1);
        List<Account> accList = new List<Account>([SELECT Id, Name FROM Account WHERE Id =:accountId]);        
    }
}