Trigger SendMyAccount on Account (after insert)
{for(Account a:Trigger.new) {SendAccount.createAccount(a.name, a.Phone, a.Website); } }