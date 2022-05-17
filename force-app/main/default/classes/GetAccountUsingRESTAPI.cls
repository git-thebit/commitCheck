public class GetAccountUsingRESTAPI {
    private final String clientId = '3MVG9fe4g9fhX0E4ewSUHP3XK15rYcrHOllWoR0LkOCEb926jZlv4J8d0zEaojIwQID6x4ZdsoU8l.QqNSfdd';
    private final String clientSecret = 'D8AC393F047F0A9EE96B00EF79C3EBDC4782159F508B7C7DAF7DC2593227DDD9';
    private final String username = 'devs@devlop.com';
    private final String password = 'Aa@8765216983';
    public class deserializeResponse
    {
        public String id;
        public String access_token;
    }
    public String ReturnAccessToken (GetAccountUsingRESTAPI acount)
    {
        String reqbody = '?grant_type=password&client_id='+clientId
            +'&client_secret='+clientSecret+'&username='+username+'&password='+password;
            system.debug(reqbody=='?grant_type=password&client_id=3MVG9fe4g9fhX0E4ewSUHP3XK15rYcrHOllWoR0LkOCEb926jZlv4J8d0zEaojIwQID6x4ZdsoU8l.QqNSfdd&client_secret=D8AC393F047F0A9EE96B00EF79C3EBDC4782159F508B7C7DAF7DC2593227DDD9&username=devs@devlop.com&password=Aa@8765216983');
        Http h = new Http();
        HttpRequest req = new HttpRequest();

        req.setBody(reqbody);
        req.setMethod('POST');
        req.setEndpoint('https://login.salesforce.com/services/oauth2/token'+reqbody);
        system.debug('here==>');
        HttpResponse res = h.send(req);
        system.debug(res);
        deserializeResponse response = (deserializeResponse)JSON.deserialize(res.getbody(),deserializeResponse.class);
        system.debug('@@@@access_token@@'+response );
        return response.access_token;
    }
    public static list<account> callGetAccount()
    {
        GetAccountUsingRESTAPI acount1 = new GetAccountUsingRESTAPI();
        String accessToken;
        system.debug('here==>');
        accessToken = acount1.ReturnAccessToken (acount1);
        list<account> ListAccount=new List<account>();
		system.debug('here==>');
        if(accessToken != null) {
            String endPoint = 'https://devs-dev-ed.my.salesforce.com/services/apexrest/getAccounts/';
            Http h2 = new Http();
            HttpRequest req1 = new HttpRequest();
            req1.setHeader('Authorization','Bearer ' + accessToken);
            req1.setHeader('Content-Type','application/json');
            req1.setHeader('accept','application/json');
            req1.setMethod('GET');
            req1.setEndpoint(endPoint);
            HttpResponse res1 = h2.send(req1);
            
            system.debug('here==>');
            
            String trimmedResponse = res1.getBody().unescapeCsv().remove('\\');
            system.debug('@@@RESPONSE@@'+trimmedResponse);
            JSONParser parser = JSON.createParser(res1.getBody());
            set<account> accList=new set<account>();
            
            while (parser.nextToken() != null) {
                if((parser.getCurrentToken() == JSONToken.FIELD_NAME) ) {
                    Account acc;
                    if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'Id')) {
                        parser.nextToken();
                        String sId= parser.getText();
                        acc=new Account();
                        acc.Id=sId;
                        system.debug('Id@@@' + sId);
                        parser.nextToken();
                        if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'Name')) {
                            parser.nextToken();
                            string sName= parser.getText();
                            acc.Name=sName;
                            system.debug('Name@@@' + sName );
                        }
                    }
                    accList.add(acc); 
                }
                accList.remove(null);
            }
            ListAccount.AddAll(accList);
            system.debug('AccountList@@@@'+Json.serialize(ListAccount));
        }
        return ListAccount;
    }
}