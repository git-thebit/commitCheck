public class SendAccount {
    //Use your Client Id 
    String clientId ='3MVG9fe4g9fhX0E4ewSUHP3XK1zSyh6_uf6Au9X8ODE5LrxGkOH0fvEj8KANc_q.IGIrk3cQlL3U6uZOK0JVs';
    //Use your Client Secret
    String clientsecret='9CB0D24480E5B7A6B4BC96F3E97A0BED20D7C6539D5419445FEE2A1412762F40';
    //Your Destination org username
    String username=EncodingUtil.urlEncode('devs@devlop.com','UTF-8');
    //Your Destination orgPassword+Security Token
    String password= EncodingUtil.urlEncode('piy@8765216983vmi9qtmYQEYIDsJ7UW2nPrg9','UTF-8');
    String redirect_urior = 'https://login.salesforce.com/services/oauth2/success';
    String accesstoken_url='https://login.salesforce.com/services/oauth2/token';
    String authurl='https://devscommunity001-developer-edition.ap24.force.com/services/oauth2/authorize?response_type=token&client_id='+clientId
        +'&redirect_uri='+redirect_urior;//'https://login.salesforce.com/services/oauth2/authorize';
    public class deserializeResponse {
        public String id;
        public String access_token;
    }
    public static void Req() {
        HttpRequest req = new HttpRequest();
        req.setMethod('POST');
        //req.setHeader('Content-Type','application/x-www-form-urlencoded');
        req.setEndpoint('https://devscommunity001-developer-edition.ap24.force.com/services/oauth2/token');
        String CLIENT_ID = '3MVG9fe4g9fhX0E4ewSUHP3XK1zSyh6_uf6Au9X8ODE5LrxGkOH0fvEj8KANc_q.IGIrk3cQlL3U6uZOK0JVs';
        String CLIENT_SECRET = '9CB0D24480E5B7A6B4BC96F3E97A0BED20D7C6539D5419445FEE2A1412762F40';
        String CODE = 'aPrxGfV7WpWWFnEhpa7d4q9BYyPfZWLfzxKZgd4gMCfMypXcGx8GPHwyTSZeqVdmusVgQgreQA%3D%3D';
        //req.setBody('grant_type=password' + '&client_id='+CLIENT_ID + '&client_secret='+CLIENT_SECRET + '&redirect_uri= https://login.salesforce.com/services/oauth2/success'+'&username=devs@devlop.com&password=piy@8765216983vmi9qtmYQEYIDsJ7UW2nPrg9');
        req.setBody('grant_type=authorization_code' + '&client_id='+CLIENT_ID + '&client_secret='+CLIENT_SECRET +'&code='+ CODE + '&redirect_uri=https://devs63-developer-edition.ap24.force.com');
        Http http = new Http();
        HTTPResponse response = http.send(req);
        
        System.debug('Body ' + response.getBody());
        System.debug('Status ' + response.getStatus());
        System.debug('Status code ' + response.getStatusCode());
    }
    public static void checkOK() {
        HttpRequest req = new HttpRequest();
        req.setMethod('POST');
        //req.setHeader('Content-Type','application/x-www-form-urlencoded');
        req.setEndpoint('https://full-riskonnectrmd.cs1.force.com/redirect/secur/frontdoor.jsp?sid=00DS0000003nHJt!AQIAQPUGYDCEYtw47wK01sLTydaxfFRpACRAEBuDZayTXWzQzunAZ1J9uT12Ixs_nyLt0hJXB9yojFDEo3K0JJacv8XKFmZ.&retURL=%2F');
        String CLIENT_ID = '3MVG9fe4g9fhX0E4ewSUHP3XK1zSyh6_uf6Au9X8ODE5LrxGkOH0fvEj8KANc_q.IGIrk3cQlL3U6uZOK0JVs';
        String CLIENT_SECRET = '9CB0D24480E5B7A6B4BC96F3E97A0BED20D7C6539D5419445FEE2A1412762F40';
        String CODE = 'aPrxGfV7WpWWFnEhpa7d4q9BYyPfZWLfzxKZgd4gMCfMypXcGx8GPHwyTSZeqVdmusVgQgreQA%3D%3D';
        //req.setBody('grant_type=password' + '&client_id='+CLIENT_ID + '&client_secret='+CLIENT_SECRET + '&redirect_uri= https://login.salesforce.com/services/oauth2/success'+'&username=devs@devlop.com&password=piy@8765216983vmi9qtmYQEYIDsJ7UW2nPrg9');
        //req.setBody('grant_type=authorization_code' + '&client_id='+CLIENT_ID + '&client_secret='+CLIENT_SECRET +'&code='+ CODE + '&redirect_uri=https://devs63-developer-edition.ap24.force.com');
        Http http = new Http();
        HTTPResponse response = http.send(req);
        //System.debug('Body ' + response.getBody());
        System.debug('Status ' + response.getStatus());
        System.debug('Status code ' + response.getStatusCode());
    }
    public static String getNewAccessToken() {
        String endpoint = 'https://login.salesforce.com/services/oauth2/token?'+
            'client_id=3MVG9fe4g9fhX0E4ewSUHP3XK1zSyh6_uf6Au9X8ODE5LrxGkOH0fvEj8KANc_q.IGIrk3cQlL3U6uZOK0JVs'+
            '&client_secret=9CB0D24480E5B7A6B4BC96F3E97A0BED20D7C6539D5419445FEE2A1412762F40' +
            '&refresh_token=5Aep861NGChdAifzi0YEd7ENlbFmyt.eqXOk4f0rsIsDBvJoZq9ZuTkBLvT5yKy4T066Gb_iEIB9LtjaOsvyrTo' +
            '&grant_type=refresh_token';
        HTTPResponse response1 = sendReq('GET', endpoint);
        System.debug(response1.getBody());
        if(response1.getStatusCode() == 200) {
            
        }
        return '';
    }
    
    public static HttpResponse sendReq( String method, String endpoint) {
        HttpRequest req = new HttpRequest();
        req.setMethod(method);
        req.setEndpoint(endpoint);
        Http http = new Http();
        HTTPResponse response = http.send(req);
        return response;
    }
    public String ReturnAccessToken(SendAccount Acc){
        String reqbody = 'grant_type=password&client_id='+clientId+'&client_secret='
            +clientSecret+'&username='+username+'&password='+password;
        // String reqbody='{“grant_type”:”password”,”client_id”:clientId,”client_secret”:clientSecret, 'username':username,'password':password}';
        Http h= new Http();
        HttpRequest req= new HttpRequest();
        req.setBody(reqbody);
        req.setMethod('POST');
        //Change “ap4” in url to your Destination Org Instance
        req.setEndpoint('https://devs-dev-ed.my.salesforce.com/services/oauth2/token');
        HttpResponse res=h.send(req);
        System.debug(res.getBody());
        deserializeResponse resp1 = (deserializeResponse)JSON.deserialize(res.getBody(),deserializeResponse.class);
        System.debug(resp1.access_token+' By-AP-deserializeresponse');
        return resp1.access_token;
    }
    @future(callout=true)
    public static void createAccount(String Accname, String Phone, String Website){
        SendAccount acc1= new SendAccount();
        String accessToken=acc1.ReturnAccessToken(acc1);
        System.debug(accessToken+'###AP');
        if(accessToken!=null){
            //Change “ap4” in url to your Destination Org
            String endPoint='https://devs-dev-ed.my.salesforce.com/services/data/v32.0/sobjects/Account/';  
            String jsonstr='{"Name":"'+ Accname +'","Phone":"'+ Phone +'","Website":"'+ Website +'"}';
            Http h2 = new Http();
            HttpRequest req2 = new HttpRequest();
            req2.setHeader('Authorization','Bearer ' + accessToken);
            req2.setHeader('Content-Type','application/json');
            req2.setHeader('accept','application/json');
            req2.setBody(jsonstr);
            req2.setMethod('POST');
            req2.setEndpoint(endPoint);
            HttpResponse res2 = h2.send(req2);
            System.debug(res2);
            //deserializeResponse deresp = (deserializeResponse)System.JSON.deserialize(res2.getBody(),deserializeResponse.class);
            //System.debug('### Deserialized Response ###'+deresp);
        }
    }
    
}