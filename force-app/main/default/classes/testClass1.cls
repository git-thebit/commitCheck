@istest
public class testClass1 {
	    @isTest Static void test() {
        
        User user = [SELECT Id, contactId FROM User WHERE Id =:UserInfo.getUserId()];
			system.debug(user);
            user.LastName = 'Dev';
            update user;
            system.debug(user);
            system.debug([SELECT Id,Lastname, contactId FROM User WHERE Id =:UserInfo.getUserId()]);
    }
}