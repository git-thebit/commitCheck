public class AccountSelector {
    
	public List<Account> getAccount()
    {
        return [Select Id,Name from Account];
    }
    
    public List<Account> getById(string acctid)
    {
        return [Select Id,Name from Account where id=:acctid];
    }
}