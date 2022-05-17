@RestResource(urlMapping='/v1/getAccounts/*')
Global with sharing class FetchAccounts {
	@HttpGet
    global static list<Account> fetchAccounts(){
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        List<Account> acLst  = [SELECT Id, Name, Phone FROM Account limit 20];
        return acLst;
    }
}