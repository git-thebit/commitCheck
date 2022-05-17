public class DataRepository{
    
    @AuraEnabled(cacheable=true)
    public static List<sObject> execute(String action,Map<String, Object> params)
    {
        try
        {
            system.debug(action + '' + params);
            switch on action {
                when 'getAccount' {
                    return new AccountSelector().getAccount();
                }
                when 'getById' {
                    return new AccountSelector().getById((string)params.get('acctid'));
                }
                when else {
                    return null;
                    // throw new BaseException('Method not implemented');
                }
            }
        }
        catch(Exception ex)
        {
            system.debug('Error => '+ex.getMessage());
            return null;
            // throw new ApplicationException(ex.getMessage());
        }
    }
}